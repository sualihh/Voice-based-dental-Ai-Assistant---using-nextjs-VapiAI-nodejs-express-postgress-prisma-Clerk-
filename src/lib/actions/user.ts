"use server"

import { log } from "console";
import { prisma } from "../prisma"; 
import { currentUser } from "@clerk/nextjs/server";

export async function syncuser() {

    try {
        const user = await currentUser();

        if (!user) return;

        const existingUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });

        if (existingUser) return existingUser;

        const dbUsser = await prisma.user.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress, 
                firstName: user.firstName ,
                lastName: user.lastName ,
                phone: user.phoneNumbers[0]?.phoneNumber,
            }
        })
            
        return dbUsser;
    } catch (error) {
        console.log("Error in sync user server action:", error);
    }
}