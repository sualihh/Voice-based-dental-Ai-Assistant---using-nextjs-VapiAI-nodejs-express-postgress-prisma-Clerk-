"use client"

import { getDoctors } from "@/lib/actions/doctors"
import { useQuery } from "@tanstack/react-query"


export function useGetDoctors() {
    const result = useQuery({
        queryKey: ["getDoctors"],
        queryFn: getDoctors,
    })
    return result
}