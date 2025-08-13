import React from 'react';

// Types for your data objects
export type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  avatarUrl?: string;
  date?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role?: string;
  companyLogoUrl?: string;
  avatarUrl?: string;
  text: string;
};

// Stars component for ratings
const Stars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.538 1.118l-3.37-2.455a1 1 0 00-1.176 0l-3.37 2.455c-.783.57-1.838-.197-1.538-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.07 9.387c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.96z" />
      </svg>
    ))}
  </div>
);

// Reusable ReviewCard component
export const ReviewCard: React.FC<Review> = ({
  name,
  rating,
  text,
  avatarUrl,
  date,
}) => (
  <div className="border rounded-lg p-6 bg-white shadow hover:shadow-md transition">
    <div className="flex items-center mb-4">
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt={name}
          className="w-12 h-12 rounded-full mr-4"
        />
      )}
      <div>
        <h3 className="font-semibold text-lg">{name}</h3>
        {date && <time className="text-gray-500 text-sm">{date}</time>}
      </div>
    </div>
    <Stars rating={rating} />
    <p className="mt-4 text-gray-700">{text}</p>
  </div>
);

// ReviewSection that maps over array of reviews
export const ReviewSection: React.FC<{ reviews: Review[] }> = ({ reviews }) => (
  <section className="py-12 px-4">
    <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((rev) => (
        <ReviewCard key={rev.id} {...rev} />
      ))}
    </div>
  </section>
);

// Reusable TestimonialCard component
export const TestimonialCard: React.FC<Testimonial> = ({
  name,
  role,
  companyLogoUrl,
  avatarUrl,
  text,
}) => (
  <div className="flex flex-col md:flex-row items-start bg-white border rounded-lg p-6 shadow hover:shadow-lg transition">
    {avatarUrl && (
      <img
        src={avatarUrl}
        alt={name}
        className="w-16 h-16 rounded-full mb-4 md:mb-0 md:mr-6"
      />
    )}
    <div className="flex-1">
      <p className="text-gray-700 italic mb-4">“{text}”</p>
      <div className="flex items-center">
        <div>
          <p className="font-semibold text-lg">{name}</p>
          {role && <p className="text-sm text-gray-500">{role}</p>}
        </div>
        {companyLogoUrl && (
          <img
            src={companyLogoUrl}
            alt="Company logo"
            className="h-8 ml-auto"
          />
        )}
      </div>
    </div>
  </div>
);

// TestimonialSection mapping over array of testimonials
export const TestimonialSection: React.FC<{ testimonials: Testimonial[] }> = ({
  testimonials,
}) => (
  <section className="py-12 px-4 bg-gray-50">
    <h2 className="text-3xl font-bold mb-8">Testimonials</h2>
    <div className="space-y-6">
      {testimonials.map((t) => (
        <TestimonialCard key={t.id} {...t} />
      ))}
    </div>
  </section>
);
