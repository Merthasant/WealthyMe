import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AccessDenied() {
  return (
    <section className="w-full h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">Access Denied!</h1>
      <Link to={"/dashboard"}>
        <Button variant={"outline"}> Back To Dashboard page </Button>
      </Link>
    </section>
  );
}
