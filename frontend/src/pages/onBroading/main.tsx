import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { navigateTo } from "@/lib/utils/navigate.utils";
import { ArrowRight } from "lucide-react";

export default function OnBroadingMainPage() {
  const onSkip = () => {
    navigateTo("/dashboard");
  };
  return (
    <FieldSet>
      <FieldLegend>
        <FieldTitle>
          <h1 className="text-2xl text-primary font-bold">
            Wanna get started?
          </h1>
        </FieldTitle>
        <FieldDescription>
          Create your profile to get the best experience
        </FieldDescription>
      </FieldLegend>
      <div className="flex items-center w-full justify-between gap-4 h-10 mt-6">
        <Button variant={"outline"} onClick={onSkip}>
          skip
        </Button>
        <Button onClick={() => navigateTo("/onBoarding/create-profile")}>
          next <ArrowRight />{" "}
        </Button>
      </div>
    </FieldSet>
  );
}
