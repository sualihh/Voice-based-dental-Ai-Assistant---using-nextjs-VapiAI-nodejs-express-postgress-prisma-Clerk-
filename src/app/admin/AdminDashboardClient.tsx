"use client";
import AdminStats from "@/components/admin/AdminStats";
import DoctorsManagement from "@/components/admin/DoctorsManagement";
import RecentAppointments from "@/components/admin/RecentAppointement";
import Navbar from "@/components/NavBar";
import { useGetAppointment } from "@/hooks/use-appointment";
import { useGetDoctors } from "@/hooks/use-doctor";
import { useUser } from "@clerk/nextjs";
import { SettingsIcon } from "lucide-react";
const AdminDashboardClient = () => {
  const { user } = useUser();
  const { data: doctors = [], isLoading: doctorsLoading } = useGetDoctors();
  const { data: appointment = [], isLoading: appointmentLoading } =
    useGetAppointment();
  const stats = {
    totalDoctors: doctors.length,
    activeDoctors: doctors.filter((doc: { isActive: boolean }) => doc.isActive)
      .length,
    totalAppointements: appointment.length,
    completedAppointment: appointment.filter(
      (app: { status: string }) => app.status === "COMPLETED",
    ).length,
  };
  if (doctorsLoading || appointmentLoading) {
    return <LoadingUI />;
  }
  return (
    <div className="min-h-screen bg-background">
      {" "}
      <Navbar />{" "}
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {" "}
        {/* ADMIN WELCOME SECTION */}{" "}
        <div className="mb-12 flex items-center justify-between bg-linear-to-br from-primary/10 via-primary/5 to-background rounded-3xl p-8 border border-primary/20">
          {" "}
          <div className="space-y-4">
            {" "}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              {" "}
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />{" "}
              <span className="text-sm font-medium text-primary">
                {" "}
                Admin Dashboard{" "}
              </span>{" "}
            </div>{" "}
            <div>
              {" "}
              <h1 className="text-4xl font-bold mb-2">
                {" "}
                Welcome back, {user?.firstName || "Admin"}!{" "}
              </h1>{" "}
              <p className="text-muted-foreground">
                {" "}
                Manage doctors, oversee appointments, and monitor your dental
                practice performance.{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="hidden lg:block">
            {" "}
            <div className="w-32 h-32 bg-linear-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              {" "}
              <SettingsIcon className="w-16 h-16 text-primary" />{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <AdminStats
          totalDoctors={stats.totalDoctors}
          activeDoctors={stats.activeDoctors}
          totalAppointements={stats.totalAppointements}
          completedAppointment={stats.completedAppointment}
        />{" "}
        <DoctorsManagement /> <RecentAppointments />{" "}
      </div>{" "}
    </div>
  );
};
export default AdminDashboardClient;
function LoadingUI() {
  return (
    <div className="min-h-screen bg-background">
      {" "}
      <Navbar />{" "}
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {" "}
        <div className="flex items-center justify-center h-96">
          {" "}
          <div className="text-center">
            {" "}
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />{" "}
            <p className="text-muted-foreground"> Loading dashboard... </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
