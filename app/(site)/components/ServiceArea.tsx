import React from 'react';

interface LocalExpertsProps {
  colorDark?: boolean;
}

export default function LocalExperts({ colorDark = false }: LocalExpertsProps) {
  const bgClass = colorDark
    ? 'bg-gray-900 text-white'
    : 'bg-gray-100 text-gray-900';

  return (
    <section className={`${bgClass} py-16 px-6`}>
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">
          Serving Brantford and Brant County with Expertise
        </h2>
        <p className="text-lg">
          With over 40 years of experience in Brant County, Bellhouse Excavating
          understands the local soil conditions and construction needs. We are
          proud to be a trusted local partner in excavation services.
        </p>
      </div>
    </section>
  );
}
