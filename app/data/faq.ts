// data/faq.ts
import { Circle, CheckCircle, Info, CircleQuestionMark } from 'lucide-react';

export const faqItems = [
  {
    icon: Circle,
    question: 'What areas do you serve?',
    answer:
      'We provide excavation and hauling services in Brantford, Brant, Woodstock, Hamilton, Cambridge, Kitchener-Waterloo, Halton and surrounding areas.',
  },
  {
    icon: Info,
    question: 'How soon can you start my project?',
    answer:
      'Project availability depends on our current bookings, but we aim for quick turnaround times. Contact us to check availability.',
  },
  {
    icon: CheckCircle,
    question: 'Do you offer free estimates?',
    answer:
      'Yes! We provide no-obligation, free quotes tailored to your project needs.',
  },
  {
    icon: CircleQuestionMark,
    question: 'What types of excavation work do you specialize in?',
    answer:
      'We handle foundation digging, land clearing, trenching, grading, septic systems, ponds, and more.',
  },
];
