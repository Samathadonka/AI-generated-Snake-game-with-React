/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-vt overflow-hidden relative flex flex-col items-center justify-center p-4 selection:bg-[#ff00ff] selection:text-black">
      {/* Glitch/Static Overlays */}
      <div className="absolute inset-0 static-noise z-50 pointer-events-none" />
      <div className="absolute inset-0 scanlines z-40 pointer-events-none" />
      
      {/* Raw Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffff33_1px,transparent_1px),linear-gradient(to_bottom,#ff00ff33_1px,transparent_1px)] bg-[size:32px_32px] z-0" />

      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12 animate-tear">
        {/* Left/Top: Music Player & Stats */}
        <div className="w-full max-w-md flex flex-col items-center gap-8">
          <div className="text-center w-full border-4 border-[#ff00ff] bg-black p-4 shadow-[8px_8px_0px_0px_#00ffff]">
            <h1 
              className="text-3xl md:text-4xl font-pixel text-[#00ffff] mb-2 glitch uppercase" 
              data-text="ENTITY.SNAKE"
            >
              ENTITY.SNAKE
            </h1>
            <p className="text-[#ff00ff] font-vt text-xl tracking-widest uppercase bg-black inline-block px-2">
              [AURAL_STIMULUS_OVERRIDE]
            </p>
          </div>
          
          <MusicPlayer />
          
          <div className="w-full bg-black border-4 border-[#00ffff] p-6 shadow-[-8px_8px_0px_0px_#ff00ff]">
            <h3 className="text-[#ff00ff] font-pixel text-sm uppercase tracking-widest mb-6 border-b-2 border-[#ff00ff] pb-2">
              &gt; DATA_FRAGMENTS
            </h3>
            <div className="flex justify-between items-end mb-4">
              <span className="text-[#00ffff] font-vt text-2xl">YIELD_CURRENT</span>
              <span className="text-4xl font-pixel text-[#ff00ff]">{score}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-[#00ffff] font-vt text-2xl">YIELD_PEAK</span>
              <span className="text-4xl font-pixel text-[#00ffff]">{highScore}</span>
            </div>
          </div>
        </div>

        {/* Right/Center: Game */}
        <div className="flex-1 flex justify-center items-center">
          <SnakeGame onScoreChange={handleScoreChange} />
        </div>
      </div>
    </div>
  );
}
