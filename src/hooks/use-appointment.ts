"use client";

import {
  bookAppointment,
  getAppointment,
  getBookedTimeSlots,
  getUserAppointments,
  updateAppointmentStatus,
} from "@/lib/actions/appointment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAppointment() {
  const result = useQuery({
    queryKey: ["getAppointment"],
    queryFn: getAppointment,
  });
  return result;
}

export function useBookedTimeSlots(doctorId: string, date: string, duration: number) {
  return useQuery({
    queryKey: ["getBookedTimeSlots", doctorId, date, duration],
    queryFn: () => getBookedTimeSlots(doctorId, date, duration),
    enabled: !!doctorId && !!date && duration > 0,
  });
}

export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["getBookedTimeSlots"] });
    },
    onError: (error) => console.error("Failed to book appointment:", error),
  });
}

// Get user-specific appointments
export function useUserAppointments(enabled = true) {
  const result = useQuery({
    queryKey: ["getUserAppointments"],
    queryFn: getUserAppointments,
    enabled,
  });

  return result;
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAppointment"] });
    },
    onError: (error) => console.error("Failed to update appointment:", error),
  });
}