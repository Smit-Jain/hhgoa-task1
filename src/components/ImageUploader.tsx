"use client";

import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { X, Check, UploadCloud } from "lucide-react";
import getCroppedImg from "@/utils/cropImage";

interface ImageUploaderProps {
  onImageCropped: (croppedImageUrl: string) => void;
}

export default function ImageUploader({ onImageCropped }: ImageUploaderProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      let imageDataUrl = "";
      
      if (file.name.toLowerCase().endsWith(".heic") || file.type === "image/heic") {
        const heic2any = (await import("heic2any")).default;
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8,
        }) as Blob | Blob[];
        
        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        imageDataUrl = URL.createObjectURL(blob);
      } else {
        imageDataUrl = URL.createObjectURL(file);
      }
      
      setImageSrc(imageDataUrl);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process the image. Please try another one.");
    } finally {
      setIsProcessing(false);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirmCrop = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
        onImageCropped(croppedImage);
        setImageSrc(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleCancel = () => {
    setImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {!imageSrc && (
        <div 
          className="bg-brand-bg text-black brutalist-border p-8 text-center cursor-pointer hover:bg-brand-neon transition-colors"
          style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept="image/jpeg, image/png, image/heic"
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <UploadCloud className="w-12 h-12" />
            <div>
              <p className="text-xl font-black uppercase">
                {isProcessing ? "Processing..." : "SELECT PHOTO"}
              </p>
              <p className="text-sm font-bold mt-1 opacity-70 uppercase">
                JPG, PNG, OR HEIC
              </p>
            </div>
          </div>
        </div>
      )}

      {imageSrc && (
        <div className="relative w-full h-[60vh] min-h-[400px] bg-white brutalist-border flex flex-col text-black">
          <div className="relative flex-grow">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              objectFit="vertical-cover"
            />
          </div>
          
          <div className="p-4 bg-brand-bg flex items-center justify-between z-10 border-t-4 border-black">
            <button 
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 bg-white brutalist-border hover:bg-brand-pink hover:text-white transition-colors font-bold uppercase"
              style={{ boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            
            <div className="flex items-center space-x-2 flex-grow mx-4 max-w-xs hidden sm:flex">
              <span className="text-xs font-bold uppercase">Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-black"
              />
            </div>

            <button 
              onClick={handleConfirmCrop}
              className="flex items-center space-x-2 px-6 py-2 bg-brand-neon brutalist-border hover:bg-brand-primary hover:text-white transition-colors font-bold uppercase"
              style={{ boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
            >
              <Check className="w-4 h-4" />
              <span>Confirm</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
