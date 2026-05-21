import { useState, useRef, useCallback, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface LoveFillInteractionProps {
  image: string;
  rewardImage: string;
}

/* ─── Floating Hearts while filling ─── */
function FloatingHearts({ active }: { active: boolean }) {
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      counter.current++;
      setHearts((prev) => [
        ...prev.slice(-12),
        { id: counter.current, x: Math.random() * 80 + 10 },
      ]);
    }, 250);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 5 }}>
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.span
            key={h.id}
            initial={{ opacity: 1, y: '100%', x: `${h.x}%`, scale: 0.5 }}
            animate={{ opacity: 0, y: '-20%', scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{ position: 'absolute', fontSize: '1.4rem', left: 0, bottom: 0 }}
          >
            ❤️
          </motion.span>
        ))}
      </AnimatePresence>
    </Box>
  );
}

/* ─── Image Fill Reveal ─── */
function ImageFillReveal({
  image,
  progress,
  holding,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
}: {
  image: string;
  progress: number;
  holding: boolean;
  onPointerDown: () => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
}) {
  return (
    <Box
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: holding
          ? '0 6px 28px rgba(233, 30, 99, 0.35)'
          : '0 4px 24px rgba(233, 30, 99, 0.15)',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'none',
        transform: holding ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform 0.15s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Grayscale base */}
      <Box
        component="img"
        src={image}
        alt=""
        sx={{
          width: '100%',
          display: 'block',
          filter: 'grayscale(100%)',
          borderRadius: 3,
        }}
      />
      {/* Color overlay revealed from bottom */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          borderRadius: 3,
        }}
      >
        <Box
          component="img"
          src={image}
          alt="Us with bling"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            clipPath: `inset(${100 - progress}% 0 0 0)`,
            transition: 'clip-path 0.05s linear',
          }}
        />
      </Box>
      {/* Soft glow near completion */}
      {progress > 80 && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 3,
            boxShadow: `inset 0 0 ${(progress - 80) * 2}px rgba(233, 30, 99, ${(progress - 80) / 100})`,
            pointerEvents: 'none',
          }}
        />
      )}
    </Box>
  );
}

/* ─── Reward Reveal ─── */
function RewardReveal({ rewardImage }: { rewardImage: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{ color: 'primary.main', mb: 1, fontSize: { xs: '1.6rem', md: '2.2rem' } }}
        >
          Love successfully delivered ❤️
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          I love you more than words can say, Marianna. Here's to us! 🥂
        </Typography>
        <Box
          component="img"
          src={rewardImage}
          alt="A special reward for you"
          sx={{
            width: '100%',
            maxWidth: 400,
            maxHeight: '60vh',
            objectFit: 'contain',
            borderRadius: 3,
            display: 'block',
            mx: 'auto',
            boxShadow: '0 8px 32px rgba(233, 30, 99, 0.25)',
          }}
        />
      </Box>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function LoveFillInteraction({ image, rewardImage }: LoveFillInteractionProps) {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [holding, setHolding] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const FILL_DURATION = 2500; // ms to fill completely
  const DRAIN_SPEED = 0.15; // fraction of fill speed for draining

  const tick = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setProgress((prev) => {
        const increment = (delta / FILL_DURATION) * 100;
        const next = Math.min(prev + increment, 100);
        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    },
    [FILL_DURATION]
  );

  const startFilling = useCallback(() => {
    if (completed) return;
    setHolding(true);
    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  }, [completed, tick]);

  const stopFilling = useCallback(() => {
    if (completed) return;
    setHolding(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, [completed]);

  // Drain slowly when not holding
  useEffect(() => {
    if (holding || completed) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) return 0;
        const drain = (100 / FILL_DURATION) * 16 * DRAIN_SPEED * 100;
        return Math.max(prev - drain * 0.04, 0);
      });
    }, 16);
    return () => clearInterval(interval);
  }, [holding, completed, FILL_DURATION, DRAIN_SPEED]);

  // Completion check
  useEffect(() => {
    if (progress >= 100 && !completed) {
      setCompleted(true);
      setHolding(false);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // Confetti burst
      setTimeout(() => {
        confetti({
          particleCount: 180,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#e91e63', '#ff6f61', '#f8bbd0', '#ff4081', '#ffab91', '#ff80ab'],
        });
      }, 200);
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 120,
          origin: { y: 0.5 },
          colors: ['#e91e63', '#f8bbd0', '#ff4081'],
        });
      }, 700);
    }
  }, [progress, completed]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <AnimatePresence mode="wait">
        {completed ? (
          <motion.div key="reward" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <RewardReveal rewardImage={rewardImage} />
          </motion.div>
        ) : (
          <motion.div key="fill" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Box sx={{ position: 'relative' }}>
              <FloatingHearts active={holding} />
              <ImageFillReveal
                image={image}
                progress={progress}
                holding={holding}
                onPointerDown={startFilling}
                onPointerUp={stopFilling}
                onPointerLeave={stopFilling}
              />
            </Box>

            {/* Progress bar */}
            <Box
              sx={{
                mt: 2,
                mx: 'auto',
                maxWidth: 400,
                height: 6,
                borderRadius: 3,
                background: 'rgba(233,30,99,0.12)',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #f8bbd0, #e91e63)',
                  borderRadius: 3,
                  transition: 'width 0.05s linear',
                }}
              />
            </Box>

            {/* Hint text */}
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                mt: 2,
                color: 'text.secondary',
                opacity: progress > 0 ? 0.5 : 1,
                transition: 'opacity 0.3s ease',
                fontSize: { xs: '0.85rem', md: '0.95rem' },
              }}
            >
              {holding ? 'Keep holding… 💕' : 'Press & hold the image to fill with love ❤️'}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
