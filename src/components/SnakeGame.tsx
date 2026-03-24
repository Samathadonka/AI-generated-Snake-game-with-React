import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

interface Point {
  x: number;
  y: number;
}

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);
  const lastProcessedDirectionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    lastProcessedDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      // Prevent default scrolling for game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      const lastDir = lastProcessedDirectionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (lastDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (lastDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (lastDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (lastDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  // Update ref to avoid stale closure in game loop
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const currentDir = directionRef.current;
        lastProcessedDirectionRef.current = currentDir;
        
        const head = prevSnake[0];
        const newHead = {
          x: head.x + currentDir.x,
          y: head.y + currentDir.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood(newSnake));
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [food, gameOver, isPaused, generateFood, score, onScoreChange]);

  return (
    <div className="relative flex flex-col items-center justify-center bg-black p-6 border-4 border-[#00ffff] shadow-[8px_8px_0px_0px_#ff00ff]">
      <div className="mb-4 flex justify-between w-full px-2">
        <div className="text-[#ff00ff] font-pixel text-sm tracking-widest uppercase">
          YIELD: {score}
        </div>
        <div className="text-[#00ffff] font-pixel text-sm tracking-widest uppercase animate-pulse">
          {isPaused ? 'STATUS: HALT' : 'STATUS: EXEC'}
        </div>
      </div>

      <div 
        className="relative bg-black border-4 border-[#ff00ff] overflow-hidden"
        style={{
          width: `${GRID_SIZE * 20}px`,
          height: `${GRID_SIZE * 20}px`,
        }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #ff00ff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Food */}
        <div
          className="absolute bg-[#ff00ff]"
          style={{
            width: '20px',
            height: '20px',
            left: `${food.x * 20}px`,
            top: `${food.y * 20}px`,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${isHead ? 'bg-[#ffffff]' : 'bg-[#00ffff]'}`}
              style={{
                width: '20px',
                height: '20px',
                left: `${segment.x * 20}px`,
                top: `${segment.y * 20}px`,
                border: '1px solid black'
              }}
            />
          );
        })}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 animate-tear">
            <h2 
              className="text-2xl font-pixel text-[#ff00ff] mb-4 text-center glitch"
              data-text="FATAL_EXCEPTION"
            >
              FATAL_EXCEPTION
            </h2>
            <p className="text-[#00ffff] font-vt text-2xl mb-8 bg-[#ff00ff]/20 px-2 border border-[#00ffff]">
              FINAL_YIELD: {score}
            </p>
            <button
              onClick={resetGame}
              className="px-4 py-3 bg-black border-2 border-[#00ffff] text-[#00ffff] font-pixel text-xs uppercase hover:bg-[#ff00ff] hover:text-black hover:border-[#ff00ff] transition-none"
            >
              &gt; INITIATE_RECOVERY
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-[#00ffff] font-vt text-xl text-center border-t border-[#ff00ff] pt-2 w-full uppercase">
        [W,A,S,D] TO OVERRIDE. [SPACE] TO HALT.
      </div>
    </div>
  );
}
