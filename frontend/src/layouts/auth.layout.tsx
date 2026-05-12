import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <section className="text-foreground/80 bg-background h-screen w-full flex flex-col py-6">
      <Outlet />
    </section>
  );
}
