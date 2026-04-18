"use client";

import { createDoctor, getDoctors, updateDoctor } from "@/lib/actions/doctors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetDoctors() {
  const result = useQuery({
    queryKey: ["getDoctors"],
    queryFn: getDoctors,
  });
  return result;
}

export function useCreateDoctors() {
  const queryClient = useQueryClient();

  const result = useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getDoctors"] });
    },
    onError: () => console.log("Error in Doctor creating"),
  });
  return result;
}



export function useUpdateDoctor() {
  const queryClient = useQueryClient();

  const result = useMutation({
    mutationFn: updateDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getDoctors"] });
    },
    onError: () => console.log("Error in Doctor updating"),
  });
  return result;
}
