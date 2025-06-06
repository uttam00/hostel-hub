"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import imageCompression from "browser-image-compression";

interface ImageFile {
  file: File;
  preview: string;
}

interface ImageUploadProps {
  hideLabel?: boolean;
  value: ImageFile[];
  onChange: (files: ImageFile[]) => void;
  onRemove: (index: number) => void;
  maxImages?: number;
  inputId?: string;
}

export default function ImageUpload({
  inputId,
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
      useWebWorker: false,
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Error compressing image:", error);
      return file;
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsProcessing(true);
    const newImages: ImageFile[] = [];

    try {
      for (const file of Array.from(files)) {
        if (newImages.length + value.length >= maxImages) break;

        const compressedFile = await compressImage(file);
        const preview = URL.createObjectURL(compressedFile);
        newImages.push({ file: compressedFile, preview });

        if (
          newImages.length ===
          Math.min(Array.from(files).length, maxImages - value.length)
        ) {
          const updatedFiles = [...value, ...newImages];
          onChange(updatedFiles);
          setIsProcessing(false);
        }
      }
    } catch (error) {
      console.error("Error processing images:", error);
      setIsProcessing(false);
    }
  };

  const removeImage = (index: number) => {
    if (value[index]?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(value[index].preview);
    }
    onRemove(index);
  };

  const removeAllImages = () => {
    value.forEach((image) => {
      if (image.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(image.preview);
      }
    });
    onChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Upload Box */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <div className="space-y-2">
          {!hideLabel && <Label htmlFor="images">Upload Images</Label>}
          <Input
            id={inputId || "images"}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImageChange}
            disabled={isProcessing}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              document.getElementById(inputId || "images")?.click()
            }
            disabled={isProcessing}
            className="w-full"
          >
            Upload your image
          </Button>
          {isProcessing && (
            <p className="text-sm text-muted-foreground">
              Processing images...
            </p>
          )}
        </div>
      </div>

      {/* Image List */}
      {value.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={removeAllImages}
            >
              Remove All
            </Button>
          </div>
          <div className="space-y-2">
            {value.map((imageFile, index) => (
              <div
                key={index}
                className="flex items-center justify-between border rounded-lg p-2"
              >
                <div className="flex items-center space-x-2">
                  <div className="relative w-[30px] h-[30px]">
                    <Image
                      src={imageFile.preview}
                      alt={`Image ${index + 1}`}
                      fill
                      className="rounded object-cover"
                    />
                  </div>
                  <span className="text-sm truncate">
                    {imageFile.file.name}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeImage(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
