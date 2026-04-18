"use server";

import { prisma } from "../prisma";

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

    return result;
  } catch (error) {
    console.log("Error in Featching Appointment");
  }
}
