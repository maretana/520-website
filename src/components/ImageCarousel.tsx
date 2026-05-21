import { Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ImageCarouselProps {
  images: { src: string; alt: string }[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        style={{ borderRadius: 16, overflow: 'hidden' }}
      >
        {images.map((image, idx) => (
          <SwiperSlide key={idx}>
            <Box
              component="img"
              src={image.src}
              alt={image.alt}
              sx={{
                width: '100%',
                maxHeight: '60vh',
                objectFit: 'contain',
                borderRadius: 2,
                display: 'block',
                margin: '0 auto',
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
