"use client"

import React, { useRef, useEffect } from 'react';

interface AmidakujiProps {
  startPoints: string[];
  endPoints: string[];
  minRungs: number;
  solve: boolean;
}

const Amidakuji: React.FC<AmidakujiProps> = ({ startPoints, endPoints, minRungs, solve }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      console.error('Context not found');
      return;
    }

    if (startPoints.length !== endPoints.length) {
      console.error('Start points and end points length mismatch');
      return;
    }

    const width = canvas.width;
    const height = canvas.height;
    const columns = startPoints.length;
    const columnWidth = width / columns;
    const rowHeight = (height - 80) / 10;
    const maxRungHeight = height - 80; // Ensures rungs are above this height

    context.clearRect(0, 0, width, height);
    context.strokeStyle = 'black';

    // Store rungs coordinates for path tracing
    const rungs: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const columnRungsCount = Array(columns - 1).fill(0); // Track the number of rungs per column
    const rungLevels: Set<number> = new Set(); // Track levels (y-positions) with rungs

    // Draw vertical lines
    for (let i = 0; i < columns; i++) {
      const x = (i + 0.5) * columnWidth;
      context.beginPath();
      context.moveTo(x, 40); // Start below the labels
      context.lineTo(x, height - 40); // End above the labels
      context.stroke();
    }

    // Ensure unique random Y positions for rungs to prevent overlapping
    const generateUniqueRandomYPositions = (count: number): number[] => {
      const positions = new Set<number>();
      while (positions.size < count) {
        const y = Math.floor(Math.random() * 10);
        positions.add(y);
      }
      return Array.from(positions);
    };

    // Draw horizontal lines (rungs) and store their positions
    for (let y of generateUniqueRandomYPositions(10)) {
      const yPos = 40 + (y + 1) * rowHeight;

      if (yPos < maxRungHeight && !rungLevels.has(yPos)) { // Ensure the yPos is below the max height and level is empty
        const i = Math.floor(Math.random() * (columns - 1));
        const x1 = (i + 0.5) * columnWidth;
        const x2 = x1 + columnWidth;
        rungs.push({ x1, y1: yPos, x2, y2: yPos });
        columnRungsCount[i]++;
        rungLevels.add(yPos);
        context.beginPath();
        context.moveTo(x1, yPos);
        context.lineTo(x2, yPos);
        context.stroke();
      }
    }

    // Ensure at least minRungs in each column
    for (let i = 0; i < columns - 1; i++) {
      while (columnRungsCount[i] < minRungs) {
        let y;
        do {
          y = Math.floor(Math.random() * 10);
        } while (rungLevels.has(40 + (y + 1) * rowHeight)); // Find an empty level and ensure it's above the max height

        const yPos = 40 + (y + 1) * rowHeight;
        const x1 = (i + 0.5) * columnWidth;
        const x2 = x1 + columnWidth;
        rungs.push({ x1, y1: yPos, x2, y2: yPos });
        rungLevels.add(yPos);
        columnRungsCount[i]++;
        context.beginPath();
        context.moveTo(x1, yPos);
        context.lineTo(x2, yPos);
        context.stroke();
      }
    }

    // Draw start points
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.fillStyle = 'black';
    startPoints.forEach((point, i) => {
      const x = (i + 0.5) * columnWidth;
      context.fillText(point, x, 30); // Place labels above the vertical lines
    });

    // Draw end points
    endPoints.forEach((point, i) => {
      const x = (i + 0.5) * columnWidth;
      context.fillText(point, x, height - 10); // Place labels below the vertical lines
    });

    if (solve) {
      const colors = ['red', 'blue', 'green', 'orange', 'purple', 'brown', 'pink', 'cyan'];

      // Function to draw a path
      const drawPath = (path: { x: number, y: number }[], color: string) => {
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(path[0].x, path[0].y);
        path.forEach(point => {
          context.lineTo(point.x, point.y);
        });
        context.stroke();
      };

      // Function to trace the path from top to bottom
      const tracePath = (startIndex: number): { x: number, y: number }[] => {
        let x = (startIndex + 0.5) * columnWidth;
        let y = 40;
        const path: { x: number, y: number }[] = [];
        let shiftX = startIndex % 2 === 0 ? -4 : 4;
        let shiftY = startIndex % 2 === 0 ? -4 : 4;

        // Add initial shifted point
        path.push({ x: x + shiftX, y: y + shiftY });

        while (y < height - 40) {
          const rung = rungs.find(r => r.y1 === y && (r.x1 === x || r.x2 === x));

          if (rung) {
            const nextX = rung.x1 === x ? rung.x2 : rung.x1; // Move to the other side of the rung
            path.push({ x: nextX + shiftX, y }); // Move horizontally to the other side of the rung
            x = nextX; // Update x position
          }

          y += rowHeight; // Move down to the next row
          path.push({ x: x + shiftX, y: y + shiftY }); // Add a little shift to distinguish paths
        }

        // Add final shifted point
        path.push({ x: x + shiftX, y: y + shiftY });

        return path;
      };

      // Draw the paths
      startPoints.forEach((_, startIndex) => {
        const path = tracePath(startIndex);
        drawPath(path, colors[startIndex % colors.length]);
      });
    }
  }, [startPoints, endPoints, minRungs, solve]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="bg-white border-none rounded-lg w-full h-auto"
    />
  );
};

export default Amidakuji;
