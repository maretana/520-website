import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageSectionProps {
  children: ReactNode;
  index: number;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export default function PageSection({ children, index }: PageSectionProps) {
  const bgGradients = [
    'linear-gradient(135deg, rgba(255,245,245,0.9) 0%, rgba(252,228,236,0.9) 100%)',
    'linear-gradient(135deg, rgba(255,240,245,0.9) 0%, rgba(248,187,208,0.7) 100%)',
    'linear-gradient(135deg, rgba(252,228,236,0.9) 0%, rgba(255,245,245,0.9) 100%)',
    'linear-gradient(135deg, rgba(248,187,208,0.7) 0%, rgba(255,240,245,0.9) 100%)',
    'linear-gradient(135deg, rgba(255,245,245,0.9) 0%, rgba(252,228,236,0.9) 100%)',
  ];

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 6, md: 8 },
        px: 2,
        position: 'relative',
        zIndex: 1,
        background: bgGradients[index % bgGradients.length],
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <Card
            sx={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              boxShadow: '0 12px 40px rgba(233, 30, 99, 0.08)',
              overflow: 'visible',
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              {children}
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
