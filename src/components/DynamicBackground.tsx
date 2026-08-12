"use client";

import React, { useEffect, useRef } from "react";

export default function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let viewportHeight = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      viewportHeight = window.innerHeight;
      height = Math.max(document.body.scrollHeight, viewportHeight);
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);

    // Also re-measure when page content changes height
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(document.body);

    resize();

    // Brand Colors
    const cSky = "#0b6839"; // Deep Forest Green
    const cSea = "#064022"; // Darker Green
    const cSun = "#fee101"; // Neon Yellow
    const cSand = "#fef8e7"; // Cream
    const cBlack = "#0f172a";
    const cPink = "#ff007f";
    const cWhite = "#ffffff";

    // Boat State
    const boats = [
      { x: width * 0.2, y: 30, speed: 0.6, scale: 0.8 },
      { x: width * 0.8, y: 70, speed: -0.4, scale: 0.6 }
    ];

    // --- DRAWING HELPER FUNCTIONS ---

    const drawBoat = (x: number, y: number, scale: number, time: number) => {
      const bobY = Math.sin(time * 0.002 + x * 0.01) * 5;
      ctx.save();
      ctx.translate(x, y + bobY);
      ctx.scale(scale, scale);

      // Shadow
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 10;

      // Hull
      ctx.fillStyle = cBlack;
      ctx.beginPath();
      ctx.moveTo(-40, 0);
      ctx.lineTo(40, 0);
      ctx.lineTo(25, 20);
      ctx.lineTo(-25, 20);
      ctx.closePath();
      ctx.fill();

      // Mast
      ctx.fillRect(-2, -60, 4, 60);

      // Sail
      ctx.fillStyle = cSand;
      ctx.beginPath();
      ctx.moveTo(2, -50);
      ctx.lineTo(40, -10);
      ctx.lineTo(2, -10);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawDetailedTree = (x: number, y: number, scale: number, wind: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      // Sand/Mud mound base
      ctx.fillStyle = "#e0cc8d"; // Darker sandy mud
      ctx.beginPath();
      ctx.ellipse(5, 5, 55, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Grass base
      ctx.fillStyle = "#3b9a1d";
      ctx.beginPath();
      ctx.moveTo(-40, 0);
      ctx.lineTo(-30, -15);
      ctx.lineTo(-20, -5);
      ctx.lineTo(-10, -25);
      ctx.lineTo(0, -10);
      ctx.lineTo(15, -30);
      ctx.lineTo(25, -10);
      ctx.lineTo(40, -20);
      ctx.lineTo(45, 0);
      ctx.closePath();
      ctx.fill();

      // Trunk drawing helper
      const drawTrunk = (startX: number, endX: number, endY: number, width: number, segments: number, trunkWind: number) => {
        // Main trunk body
        ctx.strokeStyle = "#8b5a2b";
        ctx.lineWidth = width;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(startX, 0);
        const cpX = startX;
        const cpY = endY / 2;
        const finalX = endX + trunkWind * 0.3;
        ctx.quadraticCurveTo(cpX, cpY, finalX, endY);
        ctx.stroke();

        // Trunk segments
        ctx.strokeStyle = "#5a3a1b";
        ctx.lineWidth = 3;
        for (let i = 1; i < segments; i++) {
          const t = i / segments;
          const cx = Math.pow(1 - t, 2) * startX + 2 * (1 - t) * t * cpX + Math.pow(t, 2) * finalX;
          const cy = Math.pow(1 - t, 2) * 0 + 2 * (1 - t) * t * cpY + Math.pow(t, 2) * endY;

          ctx.beginPath();
          ctx.moveTo(cx - width / 2 + 2, cy);
          ctx.lineTo(cx + width / 2 - 2, cy);
          ctx.stroke();
        }
      };

      // Leaf drawing helper
      const drawFrondCluster = (cx: number, cy: number, size: number, leafWind: number) => {
        ctx.save();
        ctx.translate(cx, cy);

        const baseAngles = [
          // Right side cluster (dir = 1)
          -Math.PI * 0.15, // top right
          Math.PI * 0.05, // mid right
          Math.PI * 0.25, // bottom right
          // Left side cluster (dir = -1)
          -Math.PI * 0.85, // top left
          Math.PI * 0.95, // mid left
          Math.PI * 0.75  // bottom left
        ];

        for (let i = 0; i < baseAngles.length; i++) {
          const angle = baseAngles[i] + leafWind * 0.2;
          ctx.save();
          ctx.rotate(angle);

          // If it's a left-side leaf, local Y is inverted (up). We multiply Y coordinates by -1 so it always droops DOWN in screen space.
          const dir = i >= 3 ? -1 : 1;
          const tipY = size * 0.4 * dir + leafWind * 15 * dir;

          // Draw stylized jagged leaf that arches and droops
          ctx.beginPath();
          ctx.moveTo(0, 0);
          // Top curve (arches upwards relative to screen)
          ctx.quadraticCurveTo(size * 0.5, -size * 0.25 * dir, size, tipY);

          // Bottom jagged return (thinner points)
          ctx.lineTo(size * 0.8, tipY * 0.8 + 6 * dir);
          ctx.lineTo(size * 0.6, tipY * 0.6 - 1 * dir);
          ctx.lineTo(size * 0.4, tipY * 0.4 + 6 * dir);
          ctx.lineTo(0, 0);

          const gradient = ctx.createLinearGradient(0, 0, size, tipY);
          gradient.addColorStop(0, "#81c784"); // Light green at the base
          gradient.addColorStop(1, "#1b5e20"); // Dark green at the tip
          ctx.fillStyle = gradient;
          ctx.fill();

          // Leaf spine (lighter green)
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(size * 0.5, -size * 0.1 * dir, size, tipY);
          ctx.strokeStyle = "#81c784";
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.restore();
        }
        ctx.restore();
      };

      // Back Tall Tree
      drawTrunk(5, 30, -180, 16, 12, wind * 50);
      drawFrondCluster(30 + wind * 15, -180, 110, wind);

      // Front Short Tree
      drawTrunk(-10, -20, -120, 14, 8, wind * 30);
      drawFrondCluster(-20 + wind * 9, -120, 90, wind * 1.2);

      ctx.restore();
    };

    const drawSurfboard = (x: number, y: number, scale: number, rotation: number, colorLeft: string, colorRight: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);



      ctx.save(); // Save state before clipping and rotating
      // Clip everything below Y = 0 so the board looks buried in the sand!
      ctx.beginPath();
      ctx.rect(-50, -200, 100, 200);
      ctx.clip();

      ctx.rotate(rotation);

      // Left Half
      ctx.fillStyle = colorLeft;
      ctx.save();
      ctx.beginPath();
      ctx.rect(-25, -160, 25, 200);
      ctx.clip();
      ctx.beginPath();
      ctx.ellipse(0, -60, 22, 85, 0, 0, Math.PI * 2); // Shifted to be wider at the cutoff
      ctx.fill();
      ctx.restore();

      // Right Half
      ctx.fillStyle = colorRight;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, -160, 25, 200);
      ctx.clip();
      ctx.beginPath();
      ctx.ellipse(0, -60, 22, 85, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Outline
      ctx.strokeStyle = "#0b4d27"; // Very dark green
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(0, -60, 22, 85, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Center stringer line
      ctx.beginPath();
      ctx.moveTo(0, -145);
      ctx.lineTo(0, 20); // Goes past the cutoff so it meets the ground perfectly
      ctx.stroke();

      ctx.restore(); // Removes rotation and clipping mask

      // Individual curvy ground line for this board
      ctx.strokeStyle = "#0b4d27";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-26, -1);
      ctx.quadraticCurveTo(0, 5, 26, -1); // Gentle curve covering the base
      ctx.stroke();

      ctx.restore();
    };



    // --- MAIN RENDER LOOP ---

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // --- LAYOUT PERCENTAGES (based on viewport, not full page) ---
      const skyHeight = viewportHeight * 0.28;
      const seaHeight = viewportHeight * 0.28;
      const sandY = skyHeight + seaHeight; // Y = 56% of viewport down

      // 1. SKY
      ctx.fillStyle = cSky;
      ctx.fillRect(0, 0, width, skyHeight);

      // --- LANDSCAPE (Mountains/Hills) ---
      // Distant Mountains
      ctx.fillStyle = "#085c32"; // Subtle contrast
      ctx.beginPath();
      ctx.moveTo(0, skyHeight);
      ctx.quadraticCurveTo(width * 0.15, skyHeight - 80, width * 0.35, skyHeight);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(width * 0.25, skyHeight);
      ctx.quadraticCurveTo(width * 0.5, skyHeight - 110, width * 0.75, skyHeight);
      ctx.fill();

      // Foreground Hills
      ctx.fillStyle = "#0a6135";
      ctx.beginPath();
      ctx.moveTo(width * 0.6, skyHeight);
      ctx.quadraticCurveTo(width * 0.85, skyHeight - 140, width + 50, skyHeight);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-50, skyHeight);
      ctx.quadraticCurveTo(width * 0.05, skyHeight - 50, width * 0.2, skyHeight);
      ctx.fill();

      // 3. SEA
      ctx.fillStyle = cSea;
      ctx.fillRect(0, skyHeight, width, seaHeight);

      // 2. SUN & ANIMATED RAYS
      const cx = width / 2;
      const cy = skyHeight; // Exact horizon line
      const baseSunRadius = Math.min(width, viewportHeight) * 0.18; // Size matching the photo

      // Add a subtle pulsing effect to the sun
      const pulse = Math.sin(time * 0.002) * (baseSunRadius * 0.03);
      const sunRadius = baseSunRadius + pulse;

      ctx.save();

      // Clip to the sky region so spinning rays don't render over the sea
      ctx.beginPath();
      ctx.rect(0, 0, width, skyHeight);
      ctx.clip();

      ctx.translate(cx, cy);

      // Rotate the entire sun and ray system for continuous motion
      ctx.rotate(time * 0.0003);

      ctx.strokeStyle = cSun;
      ctx.lineWidth = 5;
      ctx.lineCap = "round";

      // Draw 16 rays in a full circle
      const numRays = 16;
      for (let i = 0; i < numRays; i++) {
        const angle = (i / numRays) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle);

        ctx.beginPath();
        if (i % 2 !== 0) {
          // Short and dashed rays
          ctx.moveTo(sunRadius + 20, 0);
          ctx.lineTo(sunRadius + 40, 0);
          ctx.moveTo(sunRadius + 55, 0);
          ctx.lineTo(sunRadius + 65, 0);
        } else {
          // Solid long rays
          ctx.moveTo(sunRadius + 20, 0);
          ctx.lineTo(sunRadius + 85, 0);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Sun Body (Full circle, clipped by the sky rectangle)
      ctx.fillStyle = cSun;
      ctx.beginPath();
      ctx.arc(0, 0, sunRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Sun Reflection in Sea (Exactly 3 minimal wobbly blobs)
      ctx.fillStyle = cSun;

      const drawReflectionBlob = (yOffset: number, w: number, h: number) => {
        // Subtle water wobble effect on the reflection
        const wobble = Math.sin(time * 0.002 + yOffset) * 8;
        ctx.beginPath();
        ctx.ellipse(cx + wobble, skyHeight + yOffset, w, h, 0, 0, Math.PI * 2);
        ctx.fill();
      };

      drawReflectionBlob(15, sunRadius * 0.8, 5);
      drawReflectionBlob(35, sunRadius * 0.4, 4);
      drawReflectionBlob(55, sunRadius * 0.15, 3);

      // Moving Sailboats
      boats.forEach(b => {
        b.x += b.speed;
        // Wrap around logic
        if (b.x > width + 150) b.x = -150;
        if (b.x < -150) b.x = width + 150;
        drawBoat(b.x, skyHeight + b.y, b.scale, time);
      });

      // Simple Sea Tides
      ctx.strokeStyle = cSky;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, skyHeight + seaHeight * 0.6);
      for (let x = 0; x <= width; x += 30) {
        ctx.lineTo(x, skyHeight + seaHeight * 0.6 + Math.sin(x * 0.01 + time * 0.001) * 8);
      }
      ctx.stroke();

      // 4. SAND
      ctx.fillStyle = cSand;
      ctx.beginPath();
      ctx.moveTo(0, sandY);
      for (let x = 0; x <= width; x += 30) {
        // Gentle wavy coastline
        const y = sandY + Math.sin(x * 0.005) * 15;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // White Shoreline border
      ctx.beginPath();
      ctx.moveTo(0, sandY);
      for (let x = 0; x <= width; x += 30) {
        const y = sandY + Math.sin(x * 0.005) * 15;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = cWhite;
      ctx.lineWidth = 6;
      ctx.stroke();

      // 5. FOREGROUND PROPS (Sand level)
      const wind = Math.sin(time * 0.002);

      // Detailed Palm Tree matching user's image
      drawDetailedTree(Math.max(60, width * 0.05), viewportHeight - 45, 1.8, wind);

      // Surfboards on the right side
      const boardBaseX = Math.min(width - 26, width * 0.95 + 14);
      const boardBaseY = viewportHeight - 265;

      // Two upright surfboards matching the reference image
      // Left board: White and Green, leaning slightly left
      drawSurfboard(boardBaseX - 50, boardBaseY, 1.2, -0.1, cWhite, "#66bb6a");
      // Right board: Solid Yellow, leaning slightly right
      drawSurfboard(boardBaseX, boardBaseY, 1.2, 0.1, cSun, cSun);

      // 6. PLAIN CREAM FILL below the first viewport
      if (height > viewportHeight) {
        ctx.fillStyle = cSand;
        ctx.fillRect(0, viewportHeight, width, height - viewportHeight);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      window.removeEventListener("resize", resize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full pointer-events-none transition-opacity duration-1000"
      style={{ zIndex: -10 }}
    />
  );
}
