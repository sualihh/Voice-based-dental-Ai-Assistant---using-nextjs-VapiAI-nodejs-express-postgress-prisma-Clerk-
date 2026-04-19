"use server";

import { Gender } from "@prisma/client";
import { prisma } from "../prisma";
import { generateAvatar } from "../utils";
import { revalidatePath } from "next/cache";

export async function getDoctors() {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        _count: { select: { appointments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return doctors.map((doctor) => ({
      ...doctor,
      appointmentCount: doctor._count.appointments,
    }));
  } catch (error) {
    console.log("Error in fetching doctors", error);
  }
}

interface createDoctorInput {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  gender: Gender;
  isActive: boolean;
}
export async function createDoctor(input: createDoctorInput) {
  try {
    if (!input.name || !input.email)
      throw new Error("Name And Email are required");
    const doctor = await prisma.doctor.create({
      data: {
        ...input,
        imageUrl: generateAvatar(input.name, input.gender),
      },
    });

    revalidatePath("/admin");

    return doctor;
  } catch (error) {
    console.error("Error creating doctor:", error);
    const prismaError = error as { code?: string };

    // Handle unique constraint violation (email already exists)
    if (prismaError?.code === "P2002") {
      throw new Error("A doctor with this email already exists");
    }

    throw new Error("Failed to create doctor");
  }
}


interface updateDoctorInput extends Partial<createDoctorInput> {
  id: string
}
export async function updateDoctor(input:updateDoctorInput) {
  
  try {
    if (!input.name || !input.email)
      throw new Error("Name And Email are required");

    const currentDoctor = await prisma.doctor.findUnique({
      where: { id: input.id}, select: {email: true}
    })

    if(!currentDoctor) throw new Error("Doctor not found")
      
    if (input.email !== currentDoctor.email) {
      const existingDoctor = await prisma.doctor.findUnique({
        where: { email: input.email},
      });

      if (existingDoctor) {
      throw new Error("Another doctor with this email is already registered");
      }
    }


    const doctor = await prisma.doctor.update({
      where: {id: input.id},
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        specialty: input.specialty,
        gender: input.gender,
        isActive: input.isActive,
      }
    })


    return doctor
  } catch (error) {
    console.error("Error updating doctor:", error);
    
  }
}


export async function getAvailableDoctors() {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { appointments: true },
        },
      },
      orderBy: { name: "asc" },
    });
    

    return doctors.map((doctor) => ({
      ...doctor,
      appointmentCount: doctor._count.appointments,
    }));
  } catch (error) {
    console.error("Error fetching available doctors:", error);
    throw new Error("Failed to fetch available doctors");
  }
}