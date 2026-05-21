import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const hearts = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 20 + 10,
  delay: Math.random() * 5,
  duration: Math.random() * 10 + 10,
  opacity: Math.random() * 0.15 + 0.05,
}));

export default function BackgroundDecor() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ y: '-10vh', opacity: heart.opacity }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: heart.left,
            fontSize: heart.size,
          }}
        >
          ❤️
        </motion.div>
      ))}
    </Box>
  );
}
