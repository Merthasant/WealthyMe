import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <section className="flex bg-slate-600 items-center justify-center h-screen">
      <h1 className="text-6xl font-bold italic text-slate-100">
        Welcome to the App!
        <Button>Shadcn Button</Button>
      </h1>
    </section>
  );
}
