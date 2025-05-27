"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import imageCompression from "browser-image-compression";

interface ImageUploadProps {
  hideLabel?: boolean;
  value: string[];
  onChange: (urls: string[]) => void;
  onRemove: (url: string) => void;
  maxImages?: number;
}

export default function ImageUpload({
  hideLabel = false,
  value,
  onChange,
  onRemove,
  maxImages = 5,
}: ImageUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Error compressing image:", error);
      return file; // Return original file if compression fails
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsProcessing(true);
    const newImages: string[] = [];

    try {
      for (const file of Array.from(files)) {
        if (newImages.length + value.length >= maxImages) break;

        // Compress the image
        const compressedFile = await compressImage(file);

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            newImages.push(reader.result);
            if (
              newImages.length ===
              Math.min(Array.from(files).length, maxImages - value.length)
            ) {
              const updatedUrls = [...value, ...newImages];
              onChange(updatedUrls);
              setIsProcessing(false);
            }
          }
        };
        reader.readAsDataURL(compressedFile);
      }
    } catch (error) {
      console.error("Error processing images:", error);
      setIsProcessing(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...value];
    const urlToRemove = newImages[index];
    newImages.splice(index, 1);
    onRemove(urlToRemove);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {value.map((url, index) => (
          <div key={index} className="relative aspect-square">
            <Image
              src={url}
              alt={`Image ${index + 1}`}
              fill
              className="rounded-lg object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => removeImage(index)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      {value.length < maxImages && (
        <div className="space-y-2">
          {!hideLabel && <Label htmlFor="images">Upload Images</Label>}
          <Input
            id="images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImageChange}
            disabled={isProcessing}
          />
          {isProcessing && (
            <p className="text-sm text-muted-foreground">
              Processing images...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
