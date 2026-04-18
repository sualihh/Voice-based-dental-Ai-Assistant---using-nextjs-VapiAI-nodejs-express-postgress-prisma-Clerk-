"use client"

import { getAppointment } from "@/lib/actions/appointment"
import { useQuery } from "@tanstack/react-query"



export function useGetAppointment() {
    const result = useQuery({
        queryKey: ["getAppointment"],
        queryFn: getAppointment,
    })
    return result
}
