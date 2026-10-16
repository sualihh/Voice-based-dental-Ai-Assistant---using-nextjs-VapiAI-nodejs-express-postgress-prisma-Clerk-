"use client";

import { AppointmentConfirmationModal } from "@/components/appointement/AppointmentConfirmationModal";
import BookingConfirmationStep from "@/components/appointement/BookingConfirmationStepProps ";
import DoctorSelectionStep from "@/components/appointement/DoctorSelectionStep";
import ProgressSteps from "@/components/appointement/ProgressSteps";
import TimeSelectionStep from "@/components/appointement/TimeSelectionStep";
import Navbar from "@/components/NavBar";
import {
useBookAppointment,
useUserAppointments,
} from "@/hooks/use-appointment";
import { APPOINTMENT_TYPES } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Appointment = {
id: string;
doctorName: string;
doctorImageUrl: string;
reason: string | null;
date: string | Date;
time: string;
patientEmail: string;
};

function AppointmentsPage() {
const { isLoaded, isSignedIn } = useUser();
const [selectedDentistId, setSelectedDentistId] =
useState<string | null>(null);

const [selectedDate, setSelectedDate] = useState("");
const [selectedTime, setSelectedTime] = useState("");
const [selectedType, setSelectedType] = useState("");
const [currentStep, setCurrentStep] = useState(1);

const [showConfirmationModal, setShowConfirmationModal] =
useState(false);

const [bookedAppointment, setBookedAppointment] =
useState<Appointment | null>(null);

const bookAppointmentMutation = useBookAppointment();

const { data: userAppointments = [] } =
useUserAppointments(isSignedIn === true);

const handleSelectDentist = (dentistId: string) => {
setSelectedDentistId(dentistId);

// Reset the state when dentist changes
setSelectedDate("");
setSelectedTime("");
setSelectedType("");

};

const handleBookAppointment = async () => {
if (!selectedDentistId || !selectedDate || !selectedTime) {
toast.error("Please fill in all required fields");
return;
}

const appointmentType = APPOINTMENT_TYPES.find(
  (t) => t.id === selectedType
);

bookAppointmentMutation.mutate(
  {
  doctorId: selectedDentistId,
  date: selectedDate,
  time: selectedTime,
  reason: appointmentType?.name,
  },
  {
    onSuccess: async (appointment) => {
      // Store appointment details
      setBookedAppointment(appointment);

      try {
        const emailResponse = await fetch(
          "/api/send-appointment-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ appointmentId: appointment.id }),
          }
        );

        if (!emailResponse.ok) {
          toast.error("Your appointment was booked, but we couldn't email the confirmation.");
        }
      } catch (error) {
        console.error(
          "Error sending confirmation email:",
          error
        );
        toast.error("Your appointment was booked, but we couldn't email the confirmation.");
      }

      // Show success modal
      setShowConfirmationModal(true);

      // Reset form
      setSelectedDentistId(null);
      setSelectedDate("");
      setSelectedTime("");
      setSelectedType("");
      setCurrentStep(1);
    },

    onError: (error) => {
      toast.error(
        `Failed to book appointment: ${error.message}`
      );
    },
  }
);

};

if (!isLoaded) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-24 text-center text-muted-foreground">
        Loading your appointment booking...
      </main>
    </>
  );
}

if (!isSignedIn) {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 pt-20 text-center">
        <div className="rounded-3xl border border-primary/15 bg-white/90 p-10 shadow-lg shadow-sky-900/5">
          <h1 className="mb-3 text-3xl font-bold">Sign in to book an appointment</h1>
          <p className="mb-6 text-muted-foreground">
            Sign in to choose a dentist, find an available time, and manage your appointments.
          </p>
          <SignInButton mode="modal">
            <Button size="lg">Sign in to continue</Button>
          </SignInButton>
        </div>
      </main>
    </>
  );
}

return (
<>
<Navbar />

  <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
    {/* Header */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">
        Book an Appointment
      </h1>

      <p className="text-muted-foreground">
        Find and book with verified dentists in your area
      </p>
    </div>

    <ProgressSteps currentStep={currentStep} />

    {/* Step 1 - Select Dentist */}
    {currentStep === 1 && (
      <DoctorSelectionStep
        selectedDentistId={selectedDentistId}
        onContinue={() => setCurrentStep(2)}
        onSelectDentist={handleSelectDentist}
      />
    )}

    {/* Step 2 - Select Time */}
    {currentStep === 2 && selectedDentistId && (
      <TimeSelectionStep
        selectedDentistId={selectedDentistId}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedType={selectedType}
        onBack={() => setCurrentStep(1)}
        onContinue={() => setCurrentStep(3)}
        onDateChange={setSelectedDate}
        onTimeChange={setSelectedTime}
        onTypeChange={(type) => {
          setSelectedType(type);
          setSelectedTime("");
        }}
      />
    )}

    {/* Step 3 - Confirm Booking */}
    {currentStep === 3 && selectedDentistId && (
      <BookingConfirmationStep
        selectedDentistId={selectedDentistId}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedType={selectedType}
        isBooking={bookAppointmentMutation.isPending}
        onBack={() => setCurrentStep(2)}
        onModify={() => setCurrentStep(2)}
        onConfirm={handleBookAppointment}
      />
    )}
  </div>

  {/* Appointment Confirmation Modal */}
  {bookedAppointment && (
    <AppointmentConfirmationModal
      open={showConfirmationModal}
      onOpenChange={setShowConfirmationModal}
      appointmentDetails={{
        doctorName: bookedAppointment.doctorName,
        appointmentDate: format(
          parseISO(String(bookedAppointment.date)),
          "EEEE, MMMM d, yyyy"
        ),
        appointmentTime: bookedAppointment.time,
        userEmail: bookedAppointment.patientEmail,
      }}
    />
  )}

  {/* Existing Appointments */}
  {userAppointments.length > 0 && (
    <div className="mb-8 max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-xl font-semibold mb-4">
        Your Upcoming Appointments
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {userAppointments.map(
          (appointment: Appointment) => (
            <div
              key={appointment.id}
              className="bg-card border rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Image
                    src={appointment.doctorImageUrl || "/logo.png"}
                    alt={appointment.doctorName}
                    width={40}
                    height={40}
                    className="size-10 rounded-full"
                  />
                </div>

                <div>
                  <p className="font-medium text-sm">
                    {appointment.doctorName}
                  </p>

                  <p className="text-muted-foreground text-xs">
                    {appointment.reason}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">
                  📅{" "}
                  {format(
                    parseISO(String(appointment.date)),
                    "MMM d, yyyy"
                  )}
                </p>

                <p className="text-muted-foreground">
                  🕐 {appointment.time}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )}
</>

);
}

export default AppointmentsPage;