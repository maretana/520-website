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
}: {
  image: string;
  progress: number;
  holding: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: (e?: React.PointerEvent | React.MouseEvent | React.TouchEvent) => void;
}) {
  return (
    <Box
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseUp={onPointerUp}
      onTouchEnd={onPointerUp}
      onPointerLeave={onPointerUp}
      onMouseLeave={onPointerUp}
      onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
      onDragStart={(e: React.DragEvent) => e.preventDefault()}
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
        WebkitUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'none',
        transform: holding ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform 0.15s ease, box-shadow 0.2s ease',
      }}
    >
      <Box
        component="img"
        src={image}
        alt="Us"
        draggable={false}
        sx={{
          width: '100%',
          display: 'block',
          borderRadius: 3,
          pointerEvents: 'none',
          filter: 'grayscale(100%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          borderRadius: 3,
          pointerEvents: 'none',
        }}
      >
        <Box
          component="img"
          src={image}
          alt=""
          draggable={false}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
            clipPath: `inset(${100 - progress}% 0 0 0)`,
          }}
        />
      </Box>
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
  const holdingRef = useRef(false);
  const completedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const FILL_DURATION = 2500; // ms to fill completely
  const DRAIN_RATE = 25; // percent per second drain when released

  // Keep completedRef in sync with state
  useEffect(() => { completedRef.current = completed; }, [completed]);

  // Defensive stop function
  const stopHolding = useCallback(() => {
    holdingRef.current = false;
    setHolding(false);
    lastTimeRef.current = 0;
  }, []);

  // Single RAF loop that handles both filling and draining
  useEffect(() => {
    const tick = (timestamp: number) => {
      if (completedRef.current) return;

      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setProgress((prev) => {
        if (holdingRef.current) {
          // Fill
          const increment = (delta / FILL_DURATION) * 100;
          const next = Math.min(prev + increment, 100);
          if (next >= 100) return 100;
          return next;
        } else {
          // Drain slowly
          if (prev <= 0) return 0;
          const drain = (DRAIN_RATE * delta) / 1000;
          return Math.max(prev - drain, 0);
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [FILL_DURATION, DRAIN_RATE]);

  // Completion check
  useEffect(() => {
    if (progress >= 100 && !completed) {
      holdingRef.current = false;
      setHolding(false);
      setCompleted(true);
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

  // PointerDown on the image starts holding
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (completedRef.current) return;
    (e.currentTarget as HTMLElement).focus?.();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) { /* ignore */ }
    holdingRef.current = true;
    setHolding(true);
    lastTimeRef.current = 0;
  }, []);

  // Stop holding with event context (releases pointer capture)
  const stopHoldingFromEvent = useCallback((e?: React.PointerEvent | React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
      try {
        const target = e.currentTarget as HTMLElement;
        if (target && 'releasePointerCapture' in target && 'pointerId' in e) {
          target.releasePointerCapture((e as React.PointerEvent).pointerId);
        }
      } catch (_) { /* ignore */ }
    }
    stopHolding();
  }, [stopHolding]);

  // Global listeners for defensive stop
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) stopHolding();
    };

    window.addEventListener('pointerup', stopHolding);
    window.addEventListener('pointercancel', stopHolding);
    window.addEventListener('mouseup', stopHolding);
    window.addEventListener('touchend', stopHolding);
    window.addEventListener('blur', stopHolding);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mouseup', stopHolding);

    return () => {
      window.removeEventListener('pointerup', stopHolding);
      window.removeEventListener('pointercancel', stopHolding);
      window.removeEventListener('mouseup', stopHolding);
      window.removeEventListener('touchend', stopHolding);
      window.removeEventListener('blur', stopHolding);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mouseup', stopHolding);
    };
  }, [stopHolding]);

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
                onPointerDown={handlePointerDown}
                onPointerUp={stopHoldingFromEvent}
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
