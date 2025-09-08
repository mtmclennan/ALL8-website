'use client';
import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getIconByName } from '@/lib/icons';
import type { Service } from '../data/services';

export function ServiceCard({ service }: { service: Service }) {
  const Icon = getIconByName(service.icon);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="h-full"
    >
      <Card
        radius="lg"
        className="h-full bg-white/90 border border-silver/30 shadow-md"
      >
        <CardHeader className="flex items-start gap-3">
          <div className="rounded-2xl p-2 bg-blue-50">
            <Icon className="size-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{service.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{service.short}</p>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <ul className="space-y-2 text-sm">
            {service.benefits.slice(0, 3).map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 inline-block size-1.5 rounded-full bg-primary" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </CardBody>
        <CardFooter className="flex items-center justify-between">
          {service.priceFrom && (
            <Chip variant="flat" color="primary">
              From {service.priceFrom}
            </Chip>
          )}
          <Button
            as={Link}
            href={`/services/${service.slug}`}
            color="primary"
            radius="lg"
          >
            View details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
