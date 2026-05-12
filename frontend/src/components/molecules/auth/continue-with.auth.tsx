import googleLogo from "@/assets/google.svg";
import githubLogo from "@/assets/github.svg";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export default function ContinueWithAuth() {
  return (
    <Field className="grid grid-cols-2 gap-4">
      <Button variant="outline" className="items-center">
        <img className="size-4" src={googleLogo} alt="google icon" />{" "}
        <span>Google</span>
      </Button>
      <Button variant="outline" className="items-center">
        <img className="size-4" src={githubLogo} alt="google icon" />{" "}
        <span>Github</span>
      </Button>
    </Field>
  );
}
