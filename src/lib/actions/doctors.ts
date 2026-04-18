"use server";

import { Gender } from "@prisma/client";
import { prisma } from "../prisma";

export async function getDoctors() {
    try {
        const doctors = await prisma.doctor.findMany({
            include: {
                _count: { select: {appointments: true}}
            },
            orderBy: {createdAt: 'desc'}
        })

        return doctors.map((doctor) => ({
            ...doctor,
            appointmentCount: doctor._count.appointments
        }))
    } catch (error) {
        console.log("Error in fetching doctors", error);
    }
}


interface createDoctorInput {
    name: string,
    email: string,
    phone: string,
    speciality: string,
    gender: Gender,
    iaActive: boolean,
}
export async function createDoctor(input:createDoctorInput) {
    
    try {
        if (!input.name) {
            
        }
    } catch (error) {
        
    }
}