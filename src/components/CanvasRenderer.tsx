"use client";

import React, { useEffect, useRef, useState } from "react";

export type FormatType = "A" | "B" | "C";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  github: string;
  twitter: string;
}

interface CanvasRendererProps {
  format: FormatType;
  imageSrc: string | null;
  name: string;
  stack: string;
  github: string;
  twitter: string;
  teamName?: string;
  teamMembers?: TeamMember[];
  title: string;
  onRenderComplete: (dataUrl: string) => void;
}

export default function CanvasRenderer({
  format,
  imageSrc,
  name,
  stack,
  github,
  twitter,
  teamName,
  teamMembers,
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
  }, [format, imageSrc, name, stack, github, twitter, teamName, teamMembers, title]);

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
    if (!imageSrc) return;
    const userImg = new Image();
    userImg.crossOrigin = "anonymous";
    userImg.src = imageSrc;
    await new Promise((resolve) => (userImg.onload = resolve));

    if (format === "A") {
      // Format A: Radial PFP Frame for Social Media
      const cx = width / 2;
      const cy = height / 2;
      const outerRadius = width / 2 - 10;
      const innerRadius = width / 2 - 160; // Ring thickness of 150
      
      // Master circular clip (so outer corners are fully transparent)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, width/2, 0, Math.PI * 2);
      ctx.clip();

      // Clear with transparent
      ctx.clearRect(0, 0, width, height);

      // 1. Draw User Photo in the center (clipped to innerRadius)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(userImg, cx - innerRadius, cy - innerRadius, innerRadius * 2, innerRadius * 2);
      ctx.restore();

      // 2. Draw the alternating Green/Yellow Ring with EXACTLY 1 letter per box
      const textArray = "HACKER HOUSE GOA '26".split(""); // 20 characters including spaces
      const numSegments = 30; // Updated to 30 segments as requested
      const anglePerSegment = (Math.PI * 2) / numSegments;
      
      // Center the 20 characters symmetrically around the top (-Math.PI / 2)
      // Half of the 20 segments is 10 segments. We move back 10 segments from the top center.
      const startAngle = -Math.PI / 2 - (10 * anglePerSegment); 
      
      const textArcRadius = (outerRadius + innerRadius) / 2;
      
      // Use Imbue font, which is the official HH Goa font
      // Scaled up back to 90px since 30 segments provides much wider boxes
      ctx.font = "900 90px 'Imbue', serif"; 
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < numSegments; i++) {
        const thetaStart = startAngle + i * anglePerSegment;
        const thetaEnd = startAngle + (i + 1) * anglePerSegment;
        
        // Determine box color
        const isGreenBox = i % 2 === 0;
        
        // Draw the colored block
        ctx.fillStyle = isGreenBox ? colorPrimary : colorNeon;
        ctx.beginPath();
        ctx.arc(cx, cy, outerRadius, thetaStart, thetaEnd);
        ctx.arc(cx, cy, innerRadius, thetaEnd, thetaStart, true);
        ctx.closePath();
        ctx.fill();
        
        // Brutalist block border
        ctx.lineWidth = 4;
        ctx.strokeStyle = colorBlack;
        ctx.stroke();
        
        // Draw the character if there is one for this block
        if (i < textArray.length) {
          const char = textArray[i];
          const thetaCenter = startAngle + (i + 0.5) * anglePerSegment;
          
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(thetaCenter);
          ctx.translate(textArcRadius, 0);
          ctx.rotate(Math.PI / 2);
          
          // Invert colors: Yellow text on Green box, Green text on Yellow box
          ctx.fillStyle = isGreenBox ? colorNeon : colorPrimary;
          
          // Subtle black stroke for better contrast against the box
          ctx.lineWidth = 2;
          ctx.strokeStyle = colorBlack;
          ctx.strokeText(char, 0, 0);
          
          // Fill text with the inverted color
          ctx.fillText(char, 0, 0);
          ctx.restore();
        }
      }

      // 5. Draw the thick black inner and outer borders
      // Outer border
      ctx.beginPath();
      ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
      ctx.lineWidth = 20;
      ctx.strokeStyle = colorBlack;
      ctx.stroke();

      // Inner border
      ctx.beginPath();
      ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
      ctx.lineWidth = 20;
      ctx.strokeStyle = colorBlack;
      ctx.stroke();

      ctx.restore(); // Restore master clip
    } else if (format === "B") {
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

      // Social Handles (GitHub & Twitter)
      ctx.fillStyle = colorNeon;
      ctx.font = "700 35px 'Victor Mono', monospace";
      ctx.shadowColor = colorBlack;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      if (github.trim()) {
        ctx.fillText(`GH: ${github.toUpperCase()}`, decoX, photoY + 220);
      }
      if (twitter.trim()) {
        ctx.fillText(`X: ${twitter.toUpperCase()}`, decoX, photoY + 280);
      }
      // Reset Shadow for next text
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

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
    } else if (format === "C") {
      // Format C - Team ID Card
      
      // Card Background (Pink)
      ctx.fillStyle = colorPink;
      ctx.fillRect(0, 0, width, height);
      
      // Inner Frame
      const margin = 50;
      ctx.lineWidth = 15;
      ctx.strokeStyle = colorBlack;
      ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
      
      // Header Section (Neon)
      ctx.fillStyle = colorNeon;
      ctx.fillRect(margin, margin, width - margin * 2, 200);
      ctx.strokeRect(margin, margin, width - margin * 2, 200);
      
      // Header Text (Team Name)
      ctx.fillStyle = colorBlack;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "900 100px 'Imbue', serif";
      const displayTeamName = (teamName || "AWESOME TEAM").toUpperCase();
      ctx.fillText(displayTeamName, width / 2, margin + 110);

      // Photo Section (Group Photo)
      const photoWidth = width - margin * 2 - 120;
      const photoHeight = 400;
      const photoX = margin + 60;
      const photoY = margin + 200 + 60;
      
      // Photo Shadow
      ctx.fillStyle = colorBlack;
      ctx.fillRect(photoX + 20, photoY + 20, photoWidth, photoHeight);
      
      // Draw Photo (cropping it to fill the wide rectangle)
      // We will draw it with cover semantics
      ctx.save();
      ctx.beginPath();
      ctx.rect(photoX, photoY, photoWidth, photoHeight);
      ctx.clip();
      
      const imgRatio = userImg.width / userImg.height;
      const boxRatio = photoWidth / photoHeight;
      let drawW = photoWidth;
      let drawH = photoHeight;
      let drawX = photoX;
      let drawY = photoY;
      
      if (imgRatio > boxRatio) {
        drawW = drawH * imgRatio;
        drawX = photoX - (drawW - photoWidth) / 2;
      } else {
        drawH = drawW / imgRatio;
        drawY = photoY - (drawH - photoHeight) / 2;
      }
      ctx.drawImage(userImg, drawX, drawY, drawW, drawH);
      ctx.restore();
      
      // Photo Border
      ctx.lineWidth = 12;
      ctx.strokeStyle = colorBlack;
      ctx.strokeRect(photoX, photoY, photoWidth, photoHeight);

      // Render Team Members
      if (teamMembers && teamMembers.length > 0) {
        const membersStartY = photoY + photoHeight + 80;
        const memberHeight = 160;
        
        teamMembers.forEach((member, index) => {
          const y = membersStartY + index * (memberHeight + 40);
          
          // Member Block Background
          ctx.fillStyle = colorBg;
          ctx.fillRect(margin + 60, y, width - margin * 2 - 120, memberHeight);
          ctx.strokeRect(margin + 60, y, width - margin * 2 - 120, memberHeight);
          
          // Member Name
          ctx.fillStyle = colorPrimary;
          ctx.textAlign = "left";
          ctx.textBaseline = "top";
          ctx.font = "900 60px 'Imbue', serif";
          ctx.fillText(member.name.toUpperCase() || `MEMBER ${index + 1}`, margin + 90, y + 20);
          
          // Member Role
          ctx.fillStyle = colorBlack;
          ctx.font = "700 30px 'Victor Mono', monospace";
          ctx.fillText(member.role.toUpperCase() || "HACKER", margin + 90, y + 100);
          
          // Social Handles
          ctx.fillStyle = colorBlack;
          ctx.font = "700 24px 'Victor Mono', monospace";
          ctx.textAlign = "right";
          
          let handleY = y + 30;
          if (member.github) {
            ctx.fillText(`GH: ${member.github}`, width - margin - 90, handleY);
            handleY += 40;
          }
          if (member.twitter) {
            ctx.fillText(`X: ${member.twitter}`, width - margin - 90, handleY);
          }
        });
      }
    }

    // Export Data URL as PNG to support transparency (critical for circular PFPs)
    const finalDataUrl = canvas.toDataURL("image/png");
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
