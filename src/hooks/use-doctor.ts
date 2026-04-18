"use client"

import { createDoctor, getDoctors } from "@/lib/actions/doctors"
import { useMutation, useQuery } from "@tanstack/react-query"


export function useGetDoctors() {
    const result = useQuery({
        queryKey: ["getDoctors"],
        queryFn: getDoctors,
    })
    return result
}

export function useCreateDoctors() {
    const result = useMutation({
        mutationFn: createDoctor,
        onSuccess:() => console.log("Doctor created"),
        onError:() => console.log("Error in Doctor creating")
        
    })
    return result
}