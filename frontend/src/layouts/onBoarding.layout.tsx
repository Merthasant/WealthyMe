import { useProfileContext } from "@/provider/profile/profile.provider.hook";
import { Navigate, Outlet } from "react-router-dom";

export default function OnBoardingLayout() {
  const { profile, isLoading } = useProfileContext();

  if (isLoading) return <div>Loading...</div>;
  if (profile) return <Navigate to="/dashboard" />;

  return (
    <section className="bg-background w-full h-screen flex items-center justify-center">
      <Outlet />
    </section>
  );
}
