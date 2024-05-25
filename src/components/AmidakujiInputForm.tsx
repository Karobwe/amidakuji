import React, { useState, useEffect } from 'react';

interface AmidakujiInputFormProps {
  startPoints: string[];
  endPoints: string[];
  solve: boolean;
  onSubmit: (startPoints: string[], endPoints: string[], minRungs: number) => void;
  onSolve: () => void;
  setStartPoints: React.Dispatch<React.SetStateAction<string[]>>;
  setEndPoints: React.Dispatch<React.SetStateAction<string[]>>;
}

const AmidakujiInputForm: React.FC<AmidakujiInputFormProps> = ({
  startPoints,
  endPoints,
  solve,
  onSubmit,
  onSolve,
  setStartPoints,
  setEndPoints
}) => {
  const [pointsCount, setPointsCount] = useState<number>(startPoints.length);
  const [minRungs, setMinRungs] = useState<number>(2);

  useEffect(() => {
    setStartPoints(prev => {
      const newPoints = Array(pointsCount).fill('').map((_, idx) => prev[idx] || `Input ${idx + 1}`);
      return newPoints;
    });
    setEndPoints(prev => {
      const newPoints = Array(pointsCount).fill('').map((_, idx) => prev[idx] || `Output ${idx + 1}`);
      return newPoints;
    });
  }, [pointsCount, setStartPoints, setEndPoints]);

  const handlePointsCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    setPointsCount(count);
  };

  const handleMinRungsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = parseInt(e.target.value, 10);
    setMinRungs(min);
  };

  const handleStartPointChange = (index: number, value: string) => {
    const newStartPoints = [...startPoints];
    newStartPoints[index] = value;
    setStartPoints(newStartPoints);
  };

  const handleEndPointChange = (index: number, value: string) => {
    const newEndPoints = [...endPoints];
    newEndPoints[index] = value;
    setEndPoints(newEndPoints);
  };

  const handleShuffleStartPoints = () => {
    const shuffled = [...startPoints].sort(() => Math.random() - 0.5);
    setStartPoints(shuffled);
  };

  const handleShuffleEndPoints = () => {
    const shuffled = [...endPoints].sort(() => Math.random() - 0.5);
    setEndPoints(shuffled);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(startPoints, endPoints, minRungs);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 max-w-7xl'>
      <div>
        <label className='flex flex-col'>
          <span className='text-sm'>Number of points</span>
          <input
            type="number"
            value={pointsCount}
            onChange={handlePointsCountChange}
            min="2"
            className='p-2 w-fit'
          />
        </label>
      </div>
      <div className='space-y-4'>
        <label className='flex flex-col'>
          <span className='text-sm'>Minimum rungs per column</span>
          <input
            type="number"
            value={minRungs}
            onChange={handleMinRungsChange}
            min="1"
            className='p-2 w-fit'
          />
        </label>
      </div>
      <div className='space-y-1'>
        <div className='flex items-center gap-x-2'>
          <h3 className='text-sm'>Start Points</h3>
          <button type='button' onClick={handleShuffleStartPoints}>
            <span className='sr-only'>Shuffle inputs</span>
            <ShuffleSVGIcon />
          </button>
        </div>
        <div className='grid gap-2 w-full sm:grid-cols-2 lg:grid-cols-4 lg:max-w-4xl'>
          {startPoints.map((point, index) => (
            <input
              key={index}
              type="text"
              value={point}
              onChange={(e) => handleStartPointChange(index, e.target.value)}
              placeholder={`Start ${index + 1}`}
              className='p-2'
            />
          ))}
        </div>
      </div>
      <div className='space-y-1'>
        <div className='flex items-center gap-x-2'>
          <h3 className='text-sm'>End Points</h3>
          <button type='button' onClick={handleShuffleEndPoints}>
            <span className='sr-only'>Shuffle outputs</span>
            <ShuffleSVGIcon />
          </button>
        </div>
        <div className='grid gap-2 w-full sm:grid-cols-2 lg:grid-cols-4 lg:max-w-4xl'>
          {endPoints.map((point, index) => (
            <input
              key={index}
              type="text"
              value={point}
              onChange={(e) => handleEndPointChange(index, e.target.value)}
              placeholder={`End ${index + 1}`}
              className='p-2'
            />
          ))}
        </div>
      </div>
      <div className='pt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:*:col-span-1'>
        <button type="submit" className='bg-indigo-500 text-white min-w-32 px-6 py-2 rounded'>
          Generate
        </button>
        <button type='button' onClick={onSolve} className='bg-gray-500 text-white min-w-32 px-6 py-2 rounded flex items-center justify-center gap-x-2'>
          <span>{!solve ? 'Show' : 'Hide'} solution</span>
          <SolutionSVGIcon />
        </button>
      </div>
    </form>
  );
};

const ShuffleSVGIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-7 text-gray-400"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 4l3 3l-3 3" />
      <path d="M18 20l3 -3l-3 -3" />
      <path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5" />
      <path d="M21 7h-5a4.978 4.978 0 0 0 -3 1m-4 8a4.984 4.984 0 0 1 -3 1h-3" />
    </svg>
  );
};

const SolutionSVGIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-7 text-gray-400"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
      <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
    </svg>
  );
};

export default AmidakujiInputForm;
