import { useGetDoctors } from "@/hooks/use-doctor";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge, EditIcon, MailIcon, PhoneIcon, PlusIcon, Stethoscope } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import AddDoctorDialog from "./AddDoctorDialog";

function DoctorsManagement() {
  const { data: doctors = [] } = useGetDoctors();

  const [isAddDialogOpen, setisAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setisEditDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleEditDoctor = () => {};
  const handleCloseEditDialog = () => {};

  return (
    <>
      <Card className="mb-12">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 ">
              <Stethoscope className="size-5 text-primary" />
              Doctors Management
            </CardTitle>
            <CardDescription>
              Manage and oversee all doctors in your practice
            </CardDescription>
          </div>
          <Button onClick={() => setisAddDialogOpen(true)} className="bg-linear-to-r from-primary to-primary/80 hover:to-primary">
            <PlusIcon className="mr-2 size-4" />
            Add doctor
          </Button>
        </CardHeader>


         <CardContent>
          <div className="space-y-4">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={doctor.imageUrl}
                    alt={doctor.name}
                    width={48}
                    height={48}
                    className="size-12 rounded-full object-cover ring-2 ring-background"
                  />

                  <div>
                    <div className="font-semibold">{doctor.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {doctor.speciality}

                      <span className="ml-2 px-2 py-0.5 bg-muted rounded text-xs">
                        {doctor.gender === "MALE" ? "Male" : "Female"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MailIcon className="h-3 w-3" />
                        {doctor.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <PhoneIcon className="h-3 w-3" />
                        {doctor.phone}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="font-semibold text-primary">{doctor.appointmentCount}</div>
                    <div className="text-xs text-muted-foreground">Appointments</div>
                  </div>

                  {doctor.isActive ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3"
                    onClick={() => handleEditDoctor(doctor)}
                  >
                    <EditIcon className="size-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddDoctorDialog isOpen={isAddDialogOpen} onClose={() => setisAddDialogOpen(false)}
    </>
  );
}

export default DoctorsManagement;
