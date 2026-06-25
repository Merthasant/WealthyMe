import { Outlet } from "react-router-dom";

export default function OnBoardingLayout() {
  return (
    <section className="bg-background w-full h-screen flex items-center justify-center">
      <Outlet />
    </section>
  );
}
