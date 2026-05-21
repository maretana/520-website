import { useState, useCallback, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface SlidingPuzzleProps {
  puzzleImage: string;
  rewardImage: string;
  cols?: number;
  rows?: number;
}

export default function SlidingPuzzle({
  puzzleImage,
  rewardImage,
  cols = 9,
  rows = 12,
}: SlidingPuzzleProps) {
  const totalTiles = cols * rows;
  const emptyIndex = totalTiles - 1;

  const [tiles, setTiles] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check if a permutation is solvable
  const isSolvable = (arr: number[], cols: number, rows: number): boolean => {
    let inversions = 0;
    const filtered = arr.filter((v) => v !== emptyIndex);
    for (let i = 0; i < filtered.length; i++) {
      for (let j = i + 1; j < filtered.length; j++) {
        if (filtered[i] > filtered[j]) inversions++;
      }
    }
    const emptyRow = Math.floor(arr.indexOf(emptyIndex) / cols);
    const rowFromBottom = rows - 1 - emptyRow;
    if (cols % 2 === 1) {
      return inversions % 2 === 0;
    } else {
      return (inversions + rowFromBottom) % 2 === 0;
    }
  };

  const shuffle = useCallback(() => {
    const arr = Array.from({ length: totalTiles }, (_, i) => i);
    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Ensure solvable
    if (!isSolvable(arr, cols, rows)) {
      // Swap first two non-empty tiles
      const nonEmpty = arr.map((v, i) => ({ v, i })).filter((x) => x.v !== emptyIndex);
      const i0 = nonEmpty[0].i;
      const i1 = nonEmpty[1].i;
      [arr[i0], arr[i1]] = [arr[i1], arr[i0]];
    }
    setTiles(arr);
    setSolved(false);
  }, [totalTiles, cols, rows]);

  useEffect(() => {
    shuffle();
  }, [shuffle]);

  const checkSolved = (arr: number[]) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== i) return false;
    }
    return true;
  };

  const handleTileClick = (clickedIndex: number) => {
    if (solved) return;
    const emptyPos = tiles.indexOf(emptyIndex);
    const clickedRow = Math.floor(clickedIndex / cols);
    const clickedCol = clickedIndex % cols;
    const emptyRowPos = Math.floor(emptyPos / cols);
    const emptyColPos = emptyPos % cols;

    const isAdjacent =
      (Math.abs(clickedRow - emptyRowPos) === 1 && clickedCol === emptyColPos) ||
      (Math.abs(clickedCol - emptyColPos) === 1 && clickedRow === emptyRowPos);

    if (!isAdjacent) return;

    const newTiles = [...tiles];
    [newTiles[clickedIndex], newTiles[emptyPos]] = [newTiles[emptyPos], newTiles[clickedIndex]];
    setTiles(newTiles);

    if (checkSolved(newTiles)) {
      setSolved(true);
      // Trigger confetti
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#e91e63', '#ff6f61', '#f8bbd0', '#ff4081', '#ffab91'],
        });
      }, 300);
    }
  };

  const tileWidth = 100 / cols;
  const tileHeight = 100 / rows;

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      {/* Preload image */}
      <img
        src={puzzleImage}
        alt=""
        style={{ display: 'none' }}
      onLoad={() => setImageLoaded(true)}
      />

      <AnimatePresence mode="wait">
        {solved ? (
          <motion.div
            key="reward"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
         <Box sx={{ textAlign: 'center' }}>
          <Typography
                variant="h3"
                sx={{ color: 'primary.main', mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
           >
                You did it! 🎉
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                I love you more than words can say, Marianna. Here's to us! ❤️
              </Typography>
              <Box
                component="img"
                src={rewardImage}
                alt="A special reward photo of us together"
                sx={{
              width: '100%',
                  maxHeight: '60vh',
                  objectFit: 'contain',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(233, 30, 99, 0.2)',
                }}
              />
            </Box>
          </motion.div>
        ) : (
          <motion.div key="puzzle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', mb: 2, color: 'text.secondary' }}
            >
              Tap a tile next to the empty space to slide it. Solve the puzzle! 🧩
            </Typography>

            {imageLoaded && tiles.length > 0 && (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: `${(rows / cols) * 100}%`,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  background: '#fce4ec',
                }}
              >
            {tiles.map((tileValue, index) => {
                  if (tileValue === emptyIndex) return null;
                  const srcRow = Math.floor(tileValue / cols);
                  const srcCol = tileValue % cols;

                  const destRow = Math.floor(index / cols);
                  const destCol = index % cols;

                  return (
                    <Box
                      key={tileValue}
             onClick={() => handleTileClick(index)}
                      role="button"
                      aria-label={`Puzzle tile ${tileValue + 1}, position row ${destRow + 1} column ${destCol + 1}`}
                      tabIndex={0}
                      onKeyDown={(e) => {
                     if (e.key === 'Enter' || e.key === ' ') handleTileClick(index);
                      }}
                      sx={{
                        position: 'absolute',
                        width: `${tileWidth}%`,
                        height: `${tileHeight}%`,
                        left: `${destCol * tileWidth}%`,
                     top: `${destRow * tileHeight}%`,
                        backgroundImage: `url(${puzzleImage})`,
                        backgroundSize: `${cols * 100}% ${rows * 100}%`,
                 backgroundPosition: `${(srcCol / (cols - 1)) * 100}% ${(srcRow / (rows - 1)) * 100}%`,
                        cursor: 'pointer',
                        transition: 'left 0.15s ease, top 0.15s ease',
                        border: '0.5px solid rgba(255,255,255,0.3)',
                        '&:hover': {
                          filter: 'brightness(1.05)',
                    },
                        '&:focus': {
                          outline: '2px solid #e91e63',
                          outlineOffset: -2,
                    zIndex: 2,
                        },
                      }}
                    />
                );
                })}
              </Box>
            )}

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={shuffle}
                aria-label="Shuffle puzzle tiles"
                sx={{ borderRadius: 3, textTransform: 'none' }}
              >
                🔀 Shuffle Again
              </Button>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
