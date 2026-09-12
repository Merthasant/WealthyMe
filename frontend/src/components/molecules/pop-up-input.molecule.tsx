import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState, type ReactElement, type ReactNode } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

interface PopUpInputProps {
  titleContent?: string;
  descriptionContent?: string;
  children?: ReactNode;
  triggerComponent?: ReactElement;
  // optional props jika mau control di parent component
  openProp?: boolean;
  onOpenChangeProp?: (open: boolean) => void;
}

export default function PopUpInput({
  titleContent = "title content",
  descriptionContent = "description content",
  children = <h1>Default Content</h1>,
  triggerComponent = <Button>Open</Button>,
  openProp,
  onOpenChangeProp,
}: PopUpInputProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer
        open={openProp ?? open}
        onOpenChange={onOpenChangeProp ?? setOpen}
      >
        <DrawerTrigger asChild>{triggerComponent}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{titleContent}</DrawerTitle>
            <DialogDescription>{descriptionContent}</DialogDescription>
          </DrawerHeader>
          {children}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={openProp ?? open} onOpenChange={onOpenChangeProp ?? setOpen}>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titleContent}</DialogTitle>
          <DialogDescription>{descriptionContent}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
