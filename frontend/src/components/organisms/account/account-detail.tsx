import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface AccountDetailProps {
  open:boolean;
  onOpenChange: () => void;
  
}

export default function AccountDetail ({open,onOpenChange}:AccountDetailProps) {

  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <h1 className="">Account Detail</h1>
          </SheetTitle>
          <div>
            {}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}