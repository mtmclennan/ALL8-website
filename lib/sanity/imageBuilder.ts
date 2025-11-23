import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { sanity } from './sanityClient';

const builder = imageUrlBuilder(sanity);

export function urlFor(source: any) {
  return builder.image(source).auto('format').fit('max');
}
