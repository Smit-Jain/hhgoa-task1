"use client";

import React, { useEffect, useRef, useState } from "react";

export type FormatType = "A" | "B";

interface CanvasRendererProps {
  format: FormatType;
  imageSrc: string | null;
  name?: string;
  stack?: string;
  title?: string;
  iBuild?: string;
  onRenderComplete: (dataUrl: string) => void;
}

export default function CanvasRenderer({
  format,
  imageSrc,
  name,
  stack,
  title,
  iBuild,
  onRenderComplete
}: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => {
      if (!imageSrc || !canvasRef.current) return;
      renderCanvas();
    });
  }, [format, imageSrc, name, stack, title, iBuild]);

  const renderCanvas = async () => {
    setIsRendering(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!imageSrc) return;

    const userImg = new window.Image();
    userImg.crossOrigin = "anonymous";
    userImg.src = imageSrc;
    await new Promise((resolve) => (userImg.onload = resolve));

    if (format === "A") {
      // FORMAT A: PFP FRAME
      const bgImg = new window.Image();
      bgImg.src = "/pfp-frame.png"; // User's provided image
      await new Promise((resolve) => (bgImg.onload = resolve));

      const width = 1254;
      const height = 1254;
      
      canvas.width = width;
      canvas.height = height;

      // Add a 10px bleed margin so the photo slightly overlaps the frame edges
      // This prevents any white gaps from the canvas background showing through
      const innerCx = 623;
      const innerCy = 625;
      const innerRx = 345;
      const innerRy = 336;

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(innerCx, innerCy, innerRx, innerRy, 0, 0, Math.PI * 2);
      ctx.clip(); // Clip to the perfect inner ellipse

      // Fill with sand color to hide any white gaps at the bottom of the photo
      ctx.fillStyle = "#fdd763";
      ctx.fill();

      // Draw user image (cover mode)
      const imgRatio = userImg.width / userImg.height;
      const boxRatio = innerRx / innerRy;
      
      const boxW = innerRx * 2;
      const boxH = innerRy * 2;
      const boxX = innerCx - innerRx;
      const boxY = innerCy - innerRy;

      let drawW = boxW, drawH = boxH, drawX = boxX, drawY = boxY;
      
      if (imgRatio > boxRatio) { 
        drawW = drawH * imgRatio; 
        drawX = boxX - (drawW - boxW) / 2;
      } else { 
        drawH = drawW / imgRatio; 
        drawY = boxY - (drawH - boxH) / 2;
      }
      
      ctx.drawImage(userImg, drawX, drawY, drawW, drawH);
      ctx.restore();

      // 2. Draw the frame over the user photo
      // Since the new frame has a transparent center and transparent background, it will perfectly composite.
      ctx.drawImage(bgImg, 0, 0, width, height);

      // We do not draw any dynamic text here because the PFP frame is already complete.

    } else if (format === "B") {
      // FORMAT B: BUILDER ID
      const bgImg = new window.Image();
      bgImg.src = "/builder-id.png";
      await new Promise((resolve) => (bgImg.onload = resolve));

      const width = 1536;   // 1536
      const height = 1024; // 1024
      
      canvas.width = width;
      canvas.height = height;

      // Draw the background template
      ctx.drawImage(bgImg, 0, 0, width, height);

      // 1. Draw user photo in the left white square
      const px = 34;
      const py = 293;
      const pw = 470;
      const ph = 584;
      const radius = 36; // Rounded corners

      ctx.save();
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(px, py, pw, ph, radius);
      } else {
        ctx.rect(px, py, pw, ph);
      }
      ctx.clip();

      const imgRatio = userImg.width / userImg.height;
      const boxRatio = pw / ph;
      let drawW = pw, drawH = ph, drawX = px, drawY = py;
      
      if (imgRatio > boxRatio) { 
        drawW = drawH * imgRatio; 
        drawX = px - (drawW - pw) / 2;
      } else { 
        drawH = drawW / imgRatio; 
        drawY = py - (drawH - ph) / 2;
      }
      ctx.drawImage(userImg, drawX, drawY, drawW, drawH);
      ctx.restore();

      // 2. Erase the dummy text on the right side
      ctx.fillStyle = "#fcfcfc";
      
      // Erase dummy black text (leaving pink titles intact)
      ctx.fillRect(671, 354, 405, 63); // Name
      ctx.fillRect(671, 504, 405, 63); // Stack
      ctx.fillRect(671, 645, 405, 63); // Title
      ctx.fillRect(671, 783, 405, 63); // I Build

      // 3. Draw user's actual text
      ctx.fillStyle = "#111111";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.font = "700 38px 'Victor Mono', monospace"; // Scaled font

      const displayName = name || "JOHN DOE";
      const displayStack = stack || "FULL STACK HACKER";
      const displayTitle = title || "BUILDER";
      const displayIBuild = iBuild || "Awesome things";

      ctx.fillText(displayName, 678, 361);
      ctx.fillText(displayStack, 678, 511);
      ctx.fillText(displayTitle, 678, 651);
      ctx.fillText(displayIBuild, 678, 789);

    }

    const finalDataUrl = canvas.toDataURL("image/png");
    onRenderComplete(finalDataUrl);
    setIsRendering(false);
  };

  return (
    <div className={`relative w-full mx-auto overflow-hidden ${format === "A" ? "max-w-md" : "max-w-4xl"}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-auto brutalist-border brutalist-shadow"
        style={{ 
          display: 'block', 
          aspectRatio: format === "A" ? "1/1" : "1024/682"
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
