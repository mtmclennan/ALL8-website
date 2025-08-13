// src/data/mockReviewsTestimonials.ts

import { Review, Testimonial } from '@/components/DynamicReviewsTestimonials';

export const reviews: Review[] = [
  {
    id: 'r1',
    name: 'Emily Chen',
    rating: 5,
    text: 'Amazing experience! The team built our site exactly to spec and optimized our SEO—traffic has doubled in just two weeks.',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    date: '2025-07-15',
  },
  {
    id: 'r2',
    name: 'Marcus Thompson',
    rating: 4,
    text: 'Very professional and timely. A couple of tweaks needed on the mobile layout, but they resolved it within hours.',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    date: '2025-06-30',
  },
  {
    id: 'r3',
    name: 'Leah Patel',
    rating: 5,
    text: 'Fantastic service from start to finish. The reusable components saved us so much time on future pages.',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    date: '2025-05-20',
  },
  {
    id: 'r4',
    name: 'Oscar Ruiz',
    rating: 3,
    text: 'Good code quality, but communication lagged a bit during the holiday period. Overall satisfied.',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    date: '2025-04-10',
  },
  {
    id: 'r5',
    name: 'Sabrina Lee',
    rating: 5,
    text: 'Their testimonial and review sections look incredible! Easy to drop onto any page and customize.',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    date: '2025-07-01',
  },
  {
    id: 'r6',
    name: 'Jonas Schmidt',
    rating: 4,
    text: 'Solid work on the landing pages. A couple style tweaks needed, but developer was very responsive.',
    avatarUrl: 'https://i.pravatar.cc/150?img=6',
    date: '2025-06-12',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Alexa Morrison',
    role: 'Marketing Director',
    companyLogoUrl: 'https://via.placeholder.com/100x40?text=Acme+Corp',
    avatarUrl: 'https://i.pravatar.cc/150?img=7',
    text: '“Since launching our new site, leads have increased by 120%. The reusable components made rollout a breeze.”',
  },
  {
    id: 't2',
    name: 'Dr. Kevin Wu',
    role: 'Founder & CEO',
    companyLogoUrl: 'https://via.placeholder.com/100x40?text=HealthCo',
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    text: '“Incredible attention to detail and performance optimization. Our booking system has never run smoother.”',
  },
  {
    id: 't3',
    name: 'Priya Singh',
    role: 'Product Manager',
    companyLogoUrl: 'https://via.placeholder.com/100x40?text=Techify',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    text: '“I love how easy it is to drop in the TestimonialSection on any page. Clients consistently comment on the polished look.”',
  },
  {
    id: 't4',
    name: 'Lucas Martins',
    role: 'UX Lead',
    companyLogoUrl: 'https://via.placeholder.com/100x40?text=DesignPro',
    avatarUrl: 'https://i.pravatar.cc/150?img=10',
    text: '“Great developer! Delivered on time, communicated clearly, and wrote code that’s reusable and maintainable.”',
  },
];
