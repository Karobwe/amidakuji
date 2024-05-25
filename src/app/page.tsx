"use client"

import Amidakuji from "@/components/Amidakuji";
import React, { useState } from 'react';
import AmidakujiInputForm from "@/components/AmidakujiInputForm";

export default function Home() {
  const [startPoints, setStartPoints] = useState<string[]>(['Ana', 'Max', 'Sam', 'Tom']);
  const [endPoints, setEndPoints] = useState<string[]>(['Pen', 'Ruler', 'Book', 'Bag']);
  const [minRungs, setMinRungs] = useState<number>(2);
  const [redraw, setRedraw] = useState<boolean>(false);
  const [solve, setSolve] = useState<boolean>(false);

  const handleGenerate = (newStartPoints: string[], newEndPoints: string[], newMinRungs: number) => {
    setStartPoints(newStartPoints);
    setEndPoints(newEndPoints);
    setMinRungs(newMinRungs);
    setRedraw(prevRedraw => !prevRedraw); // Toggle redraw state to force re-render
    setSolve(false); // Reset solve state on generate
  };

  const handleSolve = () => {
    setSolve(prevSolve => !prevSolve);
    setRedraw(prevRedraw => !prevRedraw); // Trigger redraw to show solutions
  };

  return (
    <main className="grid place-content-center min-h-screen p-24 bg-gray-100">
      <div className="space-y-8 max-w-4xl mx-auto">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-indigo-600">Amidakuji Ladder Game</h1>
          <p className="text-lg text-gray-700 mt-2">Create and solve your own Amidakuji ladders easily!</p>
        </header>
        <section>
          <AmidakujiInputForm
            startPoints={startPoints}
            endPoints={endPoints}
            solve={solve}
            onSubmit={handleGenerate}
            onSolve={handleSolve}
            setStartPoints={setStartPoints}
            setEndPoints={setEndPoints}
          />
        </section>
        <section>
          <Amidakuji startPoints={startPoints} endPoints={endPoints} minRungs={minRungs} solve={solve} key={redraw.toString()} />
        </section>
      </div>
    </main>
  );
}
