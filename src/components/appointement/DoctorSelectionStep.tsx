import { useAvailableDoctors } from "@/hooks/use-doctor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { MapPinIcon, PhoneIcon, StarIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DoctorCardsLoading } from "./DoctorCardsLoading";

interface DoctorSelectionStepProps {
  selectedDentistId: string | null;
  onSelectDentist: (dentistId: string) => void;
  onContinue: () => void;
}

function DoctorSelectionStep({
  onContinue,
  onSelectDentist,
  selectedDentistId,
}: DoctorSelectionStepProps) {
  const {
    data: dentists = [],
    isError,
    isLoading,
    refetch,
  } = useAvailableDoctors();


  if (isLoading)
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Choose Your Dentist</h2>
        <DoctorCardsLoading />
      </div>
    );

  if (isError)
    return (
      <div className="space-y-4" role="alert">
        <h2 className="text-2xl font-semibold">Choose Your Dentist</h2>
        <p className="text-muted-foreground">
          We couldn&apos;t load available dentists. Check your connection and try again.
        </p>
        <Button onClick={() => refetch()}>Try again</Button>
      </div>
    );

  if (dentists.length === 0)
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Choose Your Dentist</h2>
        <p className="text-muted-foreground">
          No dentists are available for booking right now. Please check back later.
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Choose Your Dentist</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dentists.map((dentist) => (
            
          <button
            key={dentist.id}
            type="button"
            aria-pressed={selectedDentistId === dentist.id}
            className="w-full cursor-pointer rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onSelectDentist(dentist.id)}
          >
            <Card
              className={`h-full transition-all hover:shadow-lg ${
                selectedDentistId === dentist.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Image
                    src={dentist.imageUrl || "/logo.png"}
                    alt={dentist.name || "Dentist"}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-lg">{dentist.name || "Dentist"}</CardTitle>
                    <CardDescription className="text-primary font-medium">
                      {dentist.specialty || "General Dentistry"}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">5</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({dentist.appointmentCount} appointments)
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPinIcon className="w-4 h-4" />
                  <span>DentWise</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PhoneIcon className="w-4 h-4" />
                  <span>{dentist.phone || "Contact details available after booking"}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {dentist.bio || "Experienced dental professional providing quality care."}
                </p>
                <Badge variant="secondary">Licensed Professional</Badge>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {selectedDentistId && (
        <div className="flex justify-end">
          <Button onClick={onContinue}>Continue to Time Selection</Button>
        </div>
      )}
    </div>
  );
}
export default DoctorSelectionStep;