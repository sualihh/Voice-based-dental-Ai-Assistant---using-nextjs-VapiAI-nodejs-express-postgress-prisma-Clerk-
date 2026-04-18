import { useUpdateDoctor } from "@/hooks/use-doctor";
import { formatPhoneNumber } from "@/lib/utils";
import { Doctor, Gender } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface EditDoctorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
}

function EditDoctorDialog({ isOpen, onClose, doctor }: EditDoctorDialogProps) {
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(doctor);

  useEffect(() => {
    setEditingDoctor(doctor);
  }, [doctor]);

  // at doctor is null to solve this we have to add key when calling this as aprop

  const updateDoctor = useUpdateDoctor();

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);

    if (editingDoctor) {
      setEditingDoctor({ ...editingDoctor, phone: formatted });
    }
  };

  const handleSave = () => {
    if (editingDoctor) {
      updateDoctor.mutate(
        {
          id: editingDoctor.id,
          name: editingDoctor.name ?? undefined,
          email: editingDoctor.email ?? undefined,
          phone: editingDoctor.phone ?? undefined,
          specialty: editingDoctor.specialty ?? undefined,
          gender: editingDoctor.gender ?? undefined,
          isActive: editingDoctor.isActive,
        },
        { onSuccess: handleClose },
      );
    }
  };

  const handleClose = () => {
    onClose();
    setEditingDoctor(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Edit Doctor</DialogTitle>
          <DialogDescription>
            Update doctor information and status.
          </DialogDescription>
        </DialogHeader>

        {editingDoctor && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editingDoctor.name?? ""}
                  onChange={(e) =>
                    setEditingDoctor({ ...editingDoctor, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="speciality">Speciality</Label>
                <Input
                  id="speciality"
                  value={editingDoctor.specialty}
                  onChange={(e) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      specialty: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editingDoctor.email}
                onChange={(e) =>
                  setEditingDoctor({ ...editingDoctor, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editingDoctor.phone?? ""}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={editingDoctor.gender || ""}
                  onValueChange={(value) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      gender: value as Gender,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editingDoctor.isActive ? "active" : "inactive"}
                  onValueChange={(value) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      isActive: value === "active",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
            disabled={updateDoctor.isPending}
          >
            {updateDoctor.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditDoctorDialog;
