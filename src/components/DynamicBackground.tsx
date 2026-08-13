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
      { x: width * 0.2, y: 30, speed: 0.6, scale: 0.8, dir: 1 },
      { x: width * 0.8, y: 70, speed: -0.4, scale: 0.6, dir: -1 }
    ];

    // --- DRAWING HELPER FUNCTIONS ---

    const drawBoat = (x: number, y: number, scale: number, time: number, direction: number) => {
      const bobY = Math.sin(time * 0.002 + x * 0.01) * 4;
      const tilt = Math.sin(time * 0.0015 + x * 0.005) * 0.06 * direction; // Gentle rocking
      const windSway = Math.sin(time * 0.001) * 0.15; // Sail billowing

      ctx.save();
      ctx.translate(x, y + bobY);
      ctx.scale(scale * direction, scale); // Flip based on direction
      ctx.rotate(tilt);

      // --- WAKE TRAIL (Behind the boat) ---
      ctx.save();
      ctx.globalAlpha = 0.25;
      const wakeSpread = 25;
      for (let i = 0; i < 3; i++) {
        const wakeAlpha = 0.2 - i * 0.06;
        ctx.strokeStyle = `rgba(255, 255, 255, ${wakeAlpha})`;
        ctx.lineWidth = 2 - i * 0.5;
        ctx.beginPath();
        ctx.moveTo(-30, 16);
        const wavePhase = time * 0.003 + i * 0.8;
        for (let wx = -30; wx > -120 - i * 40; wx -= 5) {
          const wy = 16 + (-wx - 30) * 0.15 * (1 + i * 0.3)
            + Math.sin(wx * 0.08 + wavePhase) * (3 + i * 1.5);
          ctx.lineTo(wx, wy + (i - 1) * wakeSpread * 0.15);
        }
        ctx.stroke();

        // Mirror wake on the other side
        ctx.beginPath();
        ctx.moveTo(-30, 16);
        for (let wx = -30; wx > -120 - i * 40; wx -= 5) {
          const wy = 16 + (-wx - 30) * 0.15 * (1 + i * 0.3)
            + Math.sin(wx * 0.08 + wavePhase) * (3 + i * 1.5);
          ctx.lineTo(wx, wy - (i - 1) * wakeSpread * 0.15 + 4);
        }
        ctx.stroke();
      }
      ctx.restore();

      // --- HULL ---
      // Hull gradient (rich wood tone)
      const hullGradient = ctx.createLinearGradient(0, 0, 0, 22);
      hullGradient.addColorStop(0, "#2c1810");
      hullGradient.addColorStop(0.5, "#5a3a28");
      hullGradient.addColorStop(1, "#1a0e08");
      ctx.fillStyle = hullGradient;

      // Curved hull shape
      ctx.beginPath();
      ctx.moveTo(-45, 2);
      ctx.quadraticCurveTo(-48, 8, -30, 20);
      ctx.lineTo(30, 20);
      ctx.quadraticCurveTo(50, 8, 45, 2);
      ctx.quadraticCurveTo(25, -2, 0, -1);
      ctx.quadraticCurveTo(-25, -2, -45, 2);
      ctx.closePath();
      ctx.fill();

      // Hull outline
      ctx.strokeStyle = "#1a0e08";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Waterline stripe
      ctx.strokeStyle = "#cc3333";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-42, 8);
      ctx.quadraticCurveTo(0, 12, 42, 8);
      ctx.stroke();

      // Deck line
      ctx.strokeStyle = "#8b6914";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-38, 4);
      ctx.quadraticCurveTo(0, 1, 38, 4);
      ctx.stroke();

      // --- MAST ---
      ctx.fillStyle = "#3a2a1a";
      ctx.fillRect(-2, -75, 4, 77);

      // Cross-beam (boom)
      ctx.fillRect(-2, -15, 38, 3);

      // --- MAIN SAIL (billowing with wind) ---
      const sailBulge = 12 + windSway * 20;
      const mainSailGradient = ctx.createLinearGradient(2, -70, 2 + sailBulge, -15);
      mainSailGradient.addColorStop(0, "#fff8f0");
      mainSailGradient.addColorStop(0.5, "#f5efe6");
      mainSailGradient.addColorStop(1, "#e8dfd2");
      ctx.fillStyle = mainSailGradient;

      ctx.beginPath();
      ctx.moveTo(2, -70);
      // Curved billowing edge
      ctx.bezierCurveTo(
        2 + sailBulge * 0.6, -55,
        2 + sailBulge, -35,
        35, -15
      );
      ctx.lineTo(2, -15);
      ctx.closePath();
      ctx.fill();

      // Sail outline
      ctx.strokeStyle = "#bbb0a0";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Sail seam lines (horizontal stripes)
      ctx.strokeStyle = "rgba(150, 140, 125, 0.3)";
      ctx.lineWidth = 0.5;
      for (let sy = -60; sy < -20; sy += 12) {
        const t = (-sy - 15) / 55; // 0 at boom, 1 at top
        const bulgeAtY = sailBulge * Math.sin(t * Math.PI * 0.8);
        ctx.beginPath();
        ctx.moveTo(2, sy);
        ctx.lineTo(2 + bulgeAtY * 0.8, sy);
        ctx.stroke();
      }

      // --- JIB SAIL (front triangular sail) ---
      const jibBulge = 8 + windSway * 12;
      ctx.fillStyle = "#fff5eb";
      ctx.beginPath();
      ctx.moveTo(0, -65);
      ctx.bezierCurveTo(
        -jibBulge * 0.5, -45,
        -jibBulge, -25,
        -35, -5
      );
      ctx.lineTo(0, -5);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#c0b8ac";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // --- PENNANT FLAG at masthead ---
      const flagWave = Math.sin(time * 0.006 + x * 0.01) * 6;
      const flagWave2 = Math.sin(time * 0.008 + x * 0.02 + 1) * 3;
      ctx.fillStyle = "#ff007f"; // Brand pink
      ctx.beginPath();
      ctx.moveTo(2, -75);
      ctx.quadraticCurveTo(10 + flagWave, -80 + flagWave2, 22 + flagWave, -77 + flagWave2);
      ctx.quadraticCurveTo(10 + flagWave * 0.5, -74 + flagWave2 * 0.5, 2, -70);
      ctx.closePath();
      ctx.fill();

      // --- WATER REFLECTION (subtle) ---
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = "#2c1810";
      ctx.beginPath();
      ctx.ellipse(0, 24, 35, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

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

      // 3. SEA — Multi-layered animated ocean
      const seaGradient = ctx.createLinearGradient(0, skyHeight, 0, sandY);
      seaGradient.addColorStop(0, "#053a1e");
      seaGradient.addColorStop(0.3, "#064022");
      seaGradient.addColorStop(0.7, "#07502a");
      seaGradient.addColorStop(1, "#0a6135");
      ctx.fillStyle = seaGradient;
      ctx.fillRect(0, skyHeight, width, seaHeight);

      // --- ANIMATED WAVE LAYERS ---
      const waveLayers = [
        { yPct: 0.20, amp: 3,  freq: 0.008, speed: 0.0008, color: "rgba(10, 97, 53, 0.4)", lineW: 2 },
        { yPct: 0.35, amp: 5,  freq: 0.006, speed: 0.0012, color: "rgba(11, 104, 57, 0.5)", lineW: 2.5 },
        { yPct: 0.50, amp: 6,  freq: 0.010, speed: 0.0015, color: "rgba(13, 120, 62, 0.5)", lineW: 3 },
        { yPct: 0.65, amp: 8,  freq: 0.007, speed: 0.0010, color: "rgba(15, 130, 68, 0.4)", lineW: 2.5 },
        { yPct: 0.80, amp: 10, freq: 0.005, speed: 0.0018, color: "rgba(20, 150, 80, 0.35)", lineW: 3 },
      ];

      for (const layer of waveLayers) {
        const baseY = skyHeight + seaHeight * layer.yPct;
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = layer.lineW;
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= width; x += 4) {
          const y = baseY
            + Math.sin(x * layer.freq + time * layer.speed) * layer.amp
            + Math.sin(x * layer.freq * 2.3 + time * layer.speed * 1.7) * (layer.amp * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // --- FOAM / WHITE WAVE CRESTS ---
      const foamLayers = [
        { yPct: 0.30, amp: 4,  freq: 0.009, speed: 0.0014, alpha: 0.15 },
        { yPct: 0.55, amp: 5,  freq: 0.007, speed: 0.0010, alpha: 0.12 },
        { yPct: 0.78, amp: 7,  freq: 0.006, speed: 0.0016, alpha: 0.18 },
      ];

      for (const foam of foamLayers) {
        const baseY = skyHeight + seaHeight * foam.yPct;
        ctx.strokeStyle = `rgba(255, 255, 255, ${foam.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= width; x += 3) {
          const y = baseY
            + Math.sin(x * foam.freq + time * foam.speed + 1.5) * foam.amp
            + Math.cos(x * foam.freq * 1.8 + time * foam.speed * 0.9) * (foam.amp * 0.3);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // --- SUN SPARKLES ON WATER ---
      ctx.fillStyle = "rgba(254, 225, 1, 0.6)";
      const sparkleCount = Math.floor(width / 25);
      for (let i = 0; i < sparkleCount; i++) {
        const sx = ((i * 137.5) % width);
        const syBase = skyHeight + seaHeight * 0.1 + ((i * 73.1) % (seaHeight * 0.75));
        const phase = i * 2.39;
        const flicker = Math.sin(time * 0.004 + phase) * 0.5 + 0.5;
        if (flicker > 0.65) {
          const sparkleRadius = 1 + flicker * 2;
          ctx.globalAlpha = flicker * 0.7;
          ctx.beginPath();
          ctx.arc(sx, syBase + Math.sin(time * 0.001 + phase) * 3, sparkleRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // 2. SUN & ANIMATED RAYS
      const cx = width / 2;
      const cy = skyHeight;
      const baseSunRadius = Math.min(width, viewportHeight) * 0.18;
      const pulse = Math.sin(time * 0.002) * (baseSunRadius * 0.03);
      const sunRadius = baseSunRadius + pulse;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, width, skyHeight);
      ctx.clip();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.0003);

      ctx.strokeStyle = cSun;
      ctx.lineWidth = 5;
      ctx.lineCap = "round";

      const numRays = 16;
      for (let i = 0; i < numRays; i++) {
        const angle = (i / numRays) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        if (i % 2 !== 0) {
          ctx.moveTo(sunRadius + 20, 0);
          ctx.lineTo(sunRadius + 40, 0);
          ctx.moveTo(sunRadius + 55, 0);
          ctx.lineTo(sunRadius + 65, 0);
        } else {
          ctx.moveTo(sunRadius + 20, 0);
          ctx.lineTo(sunRadius + 85, 0);
        }
        ctx.stroke();
        ctx.restore();
      }

      ctx.fillStyle = cSun;
      ctx.beginPath();
      ctx.arc(0, 0, sunRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Sun Reflection in Sea
      ctx.fillStyle = cSun;
      const drawReflectionBlob = (yOffset: number, w: number, h: number) => {
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
        if (b.x > width + 150) b.x = -150;
        if (b.x < -150) b.x = width + 150;
        drawBoat(b.x, skyHeight + b.y, b.scale, time, b.dir);
      });

      // --- ANIMATED SURF / SHORE WASH ---
      const shoreWashAlpha = 0.15 + Math.sin(time * 0.001) * 0.08;
      ctx.fillStyle = `rgba(255, 255, 255, ${shoreWashAlpha})`;
      ctx.beginPath();
      ctx.moveTo(0, sandY - 5);
      for (let x = 0; x <= width; x += 20) {
        const waveOffset = Math.sin(x * 0.005 + time * 0.002) * 12 + Math.sin(x * 0.012 + time * 0.003) * 5;
        ctx.lineTo(x, sandY + waveOffset);
      }
      ctx.lineTo(width, sandY + 20);
      ctx.lineTo(0, sandY + 20);
      ctx.closePath();
      ctx.fill();

      // 4. SAND
      ctx.fillStyle = cSand;
      ctx.beginPath();
      ctx.moveTo(0, sandY);
      for (let x = 0; x <= width; x += 30) {
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
      ctx.strokeStyle = cSand;
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
