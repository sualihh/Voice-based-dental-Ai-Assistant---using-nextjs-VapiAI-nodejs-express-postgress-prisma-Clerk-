import AppointmentConfirmationEmail from "@/components/email/AppointmentConfirmationEmail";
import resend from "@/lib/resend";
import { APPOINTMENT_TYPES } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { format, parseISO } from "date-fns";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const appointmentId =
      typeof body?.appointmentId === "string" ? body.appointmentId : "";
    if (!appointmentId) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        user: { clerkId: userId },
      },
      include: {
        user: { select: { email: true } },
        doctor: { select: { name: true } },
      },
    });
    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Appointment confirmation email is not configured" },
        { status: 503 }
      );
    }

    const appointmentType = APPOINTMENT_TYPES.find(
      (type) => type.name === appointment.reason
    );
    const appointmentDate = format(
      parseISO(appointment.date.toISOString().slice(0, 10)),
      "EEEE, MMMM d, yyyy"
    );

    const { data, error } = await resend.emails.send({
      from: "DentAI <no-reply@resend.dev>",
      to: [appointment.user.email],
      subject: "Appointment Confirmation - DentWise",
      react: AppointmentConfirmationEmail({
        doctorName: appointment.doctor.name ?? "Your dentist",
        appointmentDate,
        appointmentTime: appointment.time,
        appointmentType: appointmentType?.name ?? appointment.reason ?? "Dental appointment",
        duration: appointmentType?.duration ?? `${appointment.duration} min`,
        price: appointmentType?.price ?? "To be confirmed",
      }),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Email sent successfully", emailId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}