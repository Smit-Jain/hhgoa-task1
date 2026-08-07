"use client";

import React, { useEffect, useRef, useState } from "react";

export type FormatType = "A" | "B";

interface CanvasRendererProps {
  format: FormatType;
  imageSrc: string | null;
  name: string;
  stack: string;
  title: string;
  onRenderComplete: (dataUrl: string) => void;
}

export default function CanvasRenderer({
  format,
  imageSrc,
  name,
  stack,
  title,
  onRenderComplete
}: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    // We need to wait for fonts to load before drawing to canvas.
    // document.fonts.ready handles this nicely.
    document.fonts.ready.then(() => {
      if (!imageSrc || !canvasRef.current) return;
      renderCanvas();
    });
  }, [format, imageSrc, name, stack, title]);

  const renderCanvas = async () => {
    setIsRendering(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions
    const width = 1080;
    const height = format === "A" ? 1080 : 1350;
    
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Common Colors
    const colorBg = "#fffbe8"; // Cream
    const colorPrimary = "#0b6839"; // Forest Green
    const colorNeon = "#fee101"; // Neon Yellow
    const colorPink = "#ff0080"; // Hot Pink
    const colorBlack = "#000000";

    // Load User Image
    const userImg = new Image();
    userImg.crossOrigin = "anonymous";
    userImg.src = imageSrc;
    await new Promise((resolve) => (userImg.onload = resolve));

    if (format === "A") {
      // Format A: PFP Frame (Brutalist style)
      
      // Background (optional, usually PFP frames are transparent, but here we want a square export)
      ctx.fillStyle = colorBg;
      ctx.fillRect(0, 0, width, height);

      // We'll draw a brutalist circle or rounded square
      const margin = 100;
      const size = width - margin * 2;
      const x = margin;
      const y = margin;
      
      // Shadow layer
      ctx.fillStyle = colorNeon;
      ctx.beginPath();
      ctx.arc(width/2 + 25, height/2 + 25, size/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Image Base
      ctx.save();
      ctx.beginPath();
      ctx.arc(width/2, height/2, size/2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(userImg, x, y, size, size);
      ctx.restore();

      // Thick Border for Image
      ctx.beginPath();
      ctx.arc(width/2, height/2, size/2, 0, Math.PI * 2);
      ctx.lineWidth = 20;
      ctx.strokeStyle = colorBlack;
      ctx.stroke();

      // Floating Badge
      const badgeW = 600;
      const badgeH = 150;
      const badgeX = (width - badgeW) / 2;
      const badgeY = height - margin - 80;

      // Badge Shadow
      ctx.fillStyle = colorBlack;
      ctx.fillRect(badgeX + 15, badgeY + 15, badgeW, badgeH);

      // Badge Body
      ctx.fillStyle = colorPink;
      ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
      
      // Badge Border
      ctx.lineWidth = 10;
      ctx.strokeStyle = colorBlack;
      ctx.strokeRect(badgeX, badgeY, badgeW, badgeH);

      // Badge Text
      ctx.fillStyle = colorWhiteText();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "800 90px 'Imbue', serif";
      ctx.fillText("HH GOA '26", width/2, badgeY + badgeH/2 + 10);
      
      function colorWhiteText() {
        return "#ffffff";
      }
      
    } else {
      // Format B - Builder ID Card (Neo-Brutalist)
      
      // Card Background (Forest Green)
      ctx.fillStyle = colorPrimary;
      ctx.fillRect(0, 0, width, height);
      
      // Inner Frame
      const margin = 50;
      ctx.lineWidth = 15;
      ctx.strokeStyle = colorBlack;
      ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

      // Shadow for inner frame (inside edge)
      // We will do a brutalist block in the corner
      
      // Header Section
      ctx.fillStyle = colorNeon;
      ctx.fillRect(margin, margin, width - margin * 2, 200);
      ctx.strokeRect(margin, margin, width - margin * 2, 200);
      
      // Header Text
      ctx.fillStyle = colorBlack;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "900 120px 'Imbue', serif";
      ctx.fillText("HACKER HOUSE GOA", width / 2, margin + 110);

      // Photo Section
      const photoSize = 480;
      const photoX = margin + 60;
      const photoY = margin + 200 + 80;
      
      // Photo Shadow
      ctx.fillStyle = colorBlack;
      ctx.fillRect(photoX + 20, photoY + 20, photoSize, photoSize);
      
      // Draw Photo
      ctx.drawImage(userImg, photoX, photoY, photoSize, photoSize);
      
      // Photo Border
      ctx.lineWidth = 12;
      ctx.strokeRect(photoX, photoY, photoSize, photoSize);

      // Right side decorative elements (Brutalist blocks)
      const decoX = photoX + photoSize + 60;
      ctx.fillStyle = colorPink;
      ctx.fillRect(decoX, photoY, 150, 150);
      ctx.strokeRect(decoX, photoY, 150, 150);
      
      ctx.fillStyle = colorBg;
      ctx.fillRect(decoX + 170, photoY, 100, 150);
      ctx.strokeRect(decoX + 170, photoY, 100, 150);

      // Name Text
      const displayName = name.trim() ? name.toUpperCase() : "HACKER";
      ctx.fillStyle = colorNeon;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.font = "900 110px 'Imbue', serif";
      // Text Shadow
      ctx.shadowColor = colorBlack;
      ctx.shadowOffsetX = 6;
      ctx.shadowOffsetY = 6;
      ctx.fillText(displayName, margin + 60, photoY + photoSize + 70);
      
      // Reset Shadow for next text
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Stack/Role Text
      const displayStack = stack.trim() ? stack.toUpperCase() : "BUILDER";
      ctx.fillStyle = colorBg;
      ctx.font = "700 50px 'Victor Mono', monospace";
      ctx.fillText(displayStack, margin + 60, photoY + photoSize + 200);

      // Generated Title Tag
      const titleTag = title || "10X ENGINEER";
      ctx.font = "bold 45px 'Victor Mono', monospace";
      const titleWidth = ctx.measureText(titleTag).width;
      
      const tagX = margin + 60;
      const tagY = photoY + photoSize + 300;
      const tagPadX = 30;
      const tagPadY = 20;
      const tagW = titleWidth + tagPadX * 2;
      const tagH = 45 + tagPadY * 2;
      
      // Tag Shadow
      ctx.fillStyle = colorBlack;
      ctx.fillRect(tagX + 12, tagY + 12, tagW, tagH);
      
      // Tag Body
      ctx.fillStyle = colorPink;
      ctx.fillRect(tagX, tagY, tagW, tagH);
      ctx.strokeRect(tagX, tagY, tagW, tagH);

      // Tag Text
      ctx.fillStyle = colorBlack;
      ctx.fillText(titleTag, tagX + tagPadX, tagY + tagPadY + 5);

      // Barcode / Footer Decoration
      ctx.fillStyle = colorBlack;
      for(let i=0; i<25; i++) {
        const w = Math.random() * 12 + 4;
        ctx.fillRect(width - margin - 50 - (i*18), height - margin - 80, w, 50);
      }
    }

    // Export Data URL
    const finalDataUrl = canvas.toDataURL("image/jpeg", 1.0);
    onRenderComplete(finalDataUrl);
    setIsRendering(false);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-auto brutalist-border brutalist-shadow"
        style={{ 
          display: 'block', 
          aspectRatio: format === "A" ? "1/1" : "4/5" 
        }}
      />
      
      {isRendering && (
        <div className="absolute inset-0 bg-brand-bg/80 flex items-center justify-center">
          <div className="text-black font-mono font-bold text-xl animate-pulse uppercase">
            Rendering...
          </div>
        </div>
      )}
    </div>
  );
}
