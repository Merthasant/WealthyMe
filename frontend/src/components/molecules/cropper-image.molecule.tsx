import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { getCroppedImg } from "@/lib/utils/cropped_image.utils";

interface CropperImage {
  open: boolean;
  onClose: () => void;
  onCropDone: (croppedFile: File) => void;
  aspect?: number;
  imageSrc?: string;
}

export default function CropperImage({
  open,
  onClose,
  onCropDone,
  aspect = 16 / 9,
  imageSrc = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
}: CropperImage) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const handleConfirmCrop = async () => {
    if (!croppedAreaPixels && !imageSrc) return;
    const file = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropDone(file);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-sm">
        <DialogHeader>
          <DialogTitle>Avatar photo</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-80 bg-background">
          <Cropper
            classes={{
              cropAreaClassName: "border-2 border-primary rounded-lg",
            }}
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
          />
        </div>
        <Slider
          min={1}
          max={3}
          step={0.00001}
          value={[zoom]}
          onValueChange={(v) => setZoom(v[0])}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleConfirmCrop}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
