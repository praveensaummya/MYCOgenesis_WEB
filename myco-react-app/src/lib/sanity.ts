
// myco-react-app/src/lib/sanity.ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Check if Sanity is properly configured
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const isSanityConfigured = projectId && dataset;

// Create Sanity client only if properly configured
export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      useCdn: process.env.NODE_ENV === 'production',
      apiVersion: '2024-03-20',
    })
  : null;

// Create a mock client for build time that doesn't fail
const mockClient = {
  fetch: async () => [],
  create: async () => ({}),
  createOrReplace: async () => ({}),
  delete: async () => ({}),
  patch: async () => ({ execute: async () => ({}) }),
};

// Export the client (mock or real)
export const client = sanityClient || mockClient;

// Create image URL builder only if Sanity is configured
const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlFor(source: SanityImageSource) {
  if (!builder) {
    console.warn('Sanity not configured, returning mock image URL builder');
    return {
      url: () => '',
      width: () => ({ url: () => '', height: () => ({ url: () => '' }) }),
      height: () => ({ url: () => '', width: () => ({ url: () => '' }) })
    };
  }
  return builder.image(source);
}

export { isSanityConfigured };
