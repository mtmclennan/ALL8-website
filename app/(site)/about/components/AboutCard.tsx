import React from 'react';

export default function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#BFBFBF]/20 bg-white/5 p-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-slate-300">{children}</p>
    </div>
  );
}
