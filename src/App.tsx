import { Box, Typography } from '@mui/material';
import BackgroundDecor from './components/BackgroundDecor';
import PageSection from './components/PageSection';
import ImageCarousel from './components/ImageCarousel';
import SlidingPuzzle from './components/SlidingPuzzle';

export default function App() {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <BackgroundDecor />

      {/* Page 1 */}
      <PageSection index={0}>
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' },
            color: 'primary.main',
          }}
        >
          Dear Marianna ❤️
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
          我爱你! Happy 520, my darling.
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 3 }}>
          Today I wanted to take a moment to tell you how happy you make me.
        </Typography>
        <Box
          component="img"
          src="/assets/us-in-the-woods.png"
          alt="Us together in the woods, surrounded by nature"
          sx={{
            width: '100%',
            maxHeight: '55vh',
            objectFit: 'contain',
            borderRadius: 3,
            display: 'block',
            mx: 'auto',
          }}
        />
      </PageSection>

      {/* Page 2 */}
      <PageSection index={1}>
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            mb: 2,
       fontSize: { xs: '1.6rem', md: '2.2rem' },
            color: 'primary.main',
          }}
        >
          This little corner of the internet only exists because we met 🧸
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 3 }}>
          You inspire me every day to be creative and to find new ways to make you feel appreciated, loved, and smiling.
        </Typography>
        <Box
          component="img"
          src="/assets/us-cheers.png"
          alt="Us cheering together, celebrating our love"
          sx={{
            width: '100%',
            maxHeight: '55vh',
            objectFit: 'contain',
            borderRadius: 3,
            display: 'block',
            mx: 'auto',
          }}
        />
      </PageSection>

      {/* Page 3 */}
      <PageSection index={2}>
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontSize: { xs: '1.6rem', md: '2.2rem' },
            color: 'primary.main',
          }}
        >
          We have so much fun together, angel 😎
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
          We dine, we hike, we rave.
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
          Thank you for tolerating my concert addiction and for introducing me to experiences I had never even thought of before.
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 3 }}>
          Exploring the world feels so much better with you next to me 🌎
        </Typography>
      <ImageCarousel
          images={[
            { src: '/assets/us-in-waterfall.png', alt: 'Us at a beautiful waterfall' },
            { src: '/assets/us-at-gorge.png', alt: 'Us hiking at the gorge' },
            { src: '/assets/us-in-new-resto.png', alt: 'Us trying a new restaurant together' },
          ]}
        />
      </PageSection>

      {/* Page 4 */}
      <PageSection index={3}>
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontSize: { xs: '1.6rem', md: '2.2rem' },
            color: 'primary.main',
          }}
        >
          Team M ❤️
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
          Thank you for sharing this year with me, and for trusting me when life feels heavy.
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
          Things change, and we keep growing, but our care for each other has stayed constant.
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
          I know I'm not always perfect, but I will always do my best to make you smile and feel loved.
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
          We are a team, after all. The best team.
        </Typography>
        <Box
          component="img"
          src="/assets/team-m.png"
          alt="Team M - us together as the best team"
          sx={{
            width: '100%',
            maxHeight: '55vh',
            objectFit: 'contain',
            borderRadius: 3,
            display: 'block',
            mx: 'auto',
            mt: 3,
          }}
        />
      </PageSection>

      {/* Page 5 */}
      <PageSection index={4}>
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontSize: { xs: '1.6rem', md: '2.2rem' },
            color: 'primary.main',
          }}
        >
          One last little surprise… 🎁
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
          Cheers to one more Valentine's Day full of love, care, and fun.
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 3 }}>
          Now solve this puzzle for a special reward!
        </Typography>
        <SlidingPuzzle
          puzzleImage="/assets/us-with-bling.png"
          rewardImage="/assets/reward.png"
          cols={3}
          rows={4}
        />
      </PageSection>
    </Box>
  );
}
