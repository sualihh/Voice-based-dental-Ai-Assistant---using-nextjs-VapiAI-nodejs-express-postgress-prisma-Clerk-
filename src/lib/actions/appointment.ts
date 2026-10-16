"use server";

import { Prisma, type AppointmentStatus } from "@prisma/client";
import { prisma } from "../prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { APPOINTMENT_TYPES, getAvailableTimeSlots, getNext5Days } from "../utils";

class AppointmentBookingError extends Error {}

type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
  include: {
    user: {
      select: {
        firstName: true;
        lastName: true;
        email: true;
      };
    };
    doctor: {
      select: {
        name: true;
        imageUrl: true;
      };
    };
  };
}>;

function transformAppointment(appointment: AppointmentWithRelations) {
  return {
    ...appointment,
    patientName: `${appointment.user.firstName || ""} ${appointment.user.lastName || ""}`.trim(),
    patientEmail: appointment.user.email,
    doctorName: appointment.doctor.name ?? "Dentist",
    doctorImageUrl: appointment.doctor.imageUrl || "",
    date: appointment.date.toISOString().split("T")[0],
  };
}


export async function getAppointment() {
  try {
    const result = await prisma.appointment.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        doctor: {select: { name: true,  imageUrl: true }}
      },
      orderBy: {createdAt: 'desc'}
    });

    return result.map(transformAppointment);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw new Error("Failed to fetch appointments");
  }
}




export async function getUserAppointments() {
  try {
    // get authenticated user from Clerk
    const { userId } = await auth();
    if (!userId) throw new Error("You must be logged in to view appointments");

    // find user by clerkId from authenticated session
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;
    if (!clerkUser || !email) {
      throw new AppointmentBookingError(
        "Your account needs a verified email address before booking"
      );
    }

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        phone: clerkUser.phoneNumbers[0]?.phoneNumber,
      },
    });

    const appointments = await prisma.appointment.findMany({
      where: { userId: user.id },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        doctor: { select: { name: true, imageUrl: true } },
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    return appointments.map(transformAppointment);
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    throw new Error("Failed to fetch user appointments");
  }
}

export async function getUserAppointmentStats() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("You must be authenticated");

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!user) throw new Error("User not found");

    // these calls will run in parallel, instead of waiting each other
    const [totalCount, completedCount] = await Promise.all([
      prisma.appointment.count({
        where: { userId: user.id },
      }),
      prisma.appointment.count({
        where: {
          userId: user.id,
          status: "COMPLETED",
        },
      }),
    ]);

    return {
      totalAppointments: totalCount,
      completedAppointments: completedCount,
    };
  } catch (error) {
    console.error("Error fetching user appointment stats:", error);
    throw new Error("Failed to fetch user appointment stats");
  }
}

export async function getBookedTimeSlots(
  doctorId: string,
  date: string,
  duration: number
) {
  try {
    if (
      !doctorId ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isInteger(duration) ||
      duration < 1
    ) {
      throw new Error("Doctor, date, and appointment duration are required");
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: new Date(date),
        status: {
          in: ["CONFIRMED", "COMPLETED"], // consider both confirmed and completed appointments as blocking
        },
      },
      select: { time: true, duration: true },
    });

    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    return getAvailableTimeSlots().filter((slot) => {
      const slotStart = toMinutes(slot);
      const slotEnd = slotStart + duration;
      return appointments.some((appointment) => {
        const appointmentStart = toMinutes(appointment.time);
        const appointmentEnd = appointmentStart + appointment.duration;
        return slotStart < appointmentEnd && slotEnd > appointmentStart;
      });
    });
  } catch (error) {
    console.error("Error fetching booked time slots:", error);
    throw new Error("Failed to load appointment availability");
  }
}

interface BookAppointmentInput {
  doctorId: string;
  date: string;
  time: string;
  reason?: string;
}

export async function bookAppointment(input: BookAppointmentInput) {
  try {
    const { userId } = await auth();
    if (!userId) throw new AppointmentBookingError("You must be logged in to book an appointment");

    if (!input.doctorId || !input.date || !input.time) {
      throw new AppointmentBookingError("Doctor, date, and time are required");
    }

    if (!getNext5Days().includes(input.date)) {
      throw new AppointmentBookingError("Please select an available date");
    }

    if (!getAvailableTimeSlots().includes(input.time)) {
      throw new AppointmentBookingError("Please select an available time");
    }

    const appointmentType = APPOINTMENT_TYPES.find(
      (type) => type.name === input.reason
    );
    if (!appointmentType) {
      throw new AppointmentBookingError("Please select a valid appointment type");
    }
    const duration = Number.parseInt(appointmentType.duration, 10);

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) throw new Error("User not found. Please ensure your account is properly set up.");

    const appointment = await prisma.$transaction(
      async (transaction) => {
        const doctor = await transaction.doctor.findFirst({
          where: { id: input.doctorId, isActive: true },
          select: { id: true },
        });
        if (!doctor) {
          throw new AppointmentBookingError("This dentist is no longer available");
        }

        const appointmentsForDay = await transaction.appointment.findMany({
          where: {
            doctorId: doctor.id,
            date: new Date(`${input.date}T00:00:00.000Z`),
            status: { in: ["CONFIRMED", "COMPLETED"] },
          },
          select: { time: true, duration: true },
        });
        const [slotHours, slotMinutes] = input.time.split(":").map(Number);
        const slotStart = slotHours * 60 + slotMinutes;
        const hasConflict = appointmentsForDay.some((appointment) => {
          const [hours, minutes] = appointment.time.split(":").map(Number);
          const appointmentStart = hours * 60 + minutes;
          return (
            slotStart < appointmentStart + appointment.duration &&
            slotStart + duration > appointmentStart
          );
        });
        if (hasConflict) {
          throw new AppointmentBookingError(
            "This time was just booked. Please choose another time"
          );
        }

        return transaction.appointment.create({
          data: {
            userId: user.id,
            doctorId: doctor.id,
            date: new Date(`${input.date}T00:00:00.000Z`),
            time: input.time,
            duration,
            reason: appointmentType.name,
            status: "CONFIRMED",
          },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            doctor: { select: { name: true, imageUrl: true } },
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    return transformAppointment(appointment);
  } catch (error) {
    console.error("Error booking appointment:", error);
    if (error instanceof AppointmentBookingError) {
      throw error;
    }
    throw new Error("Failed to book appointment. Please try again later.");
  }
}

export async function updateAppointmentStatus(input: { id: string; status: AppointmentStatus }) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: input.id },
      data: { status: input.status },
    });

    return appointment;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw new Error("Failed to update appointment");
  }
}