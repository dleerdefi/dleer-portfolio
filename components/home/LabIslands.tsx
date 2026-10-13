'use client';

import dynamic from 'next/dynamic';

// The home page's lab entry points as client-side dynamic imports: each is its own chunk, fetched
// only when it renders, so a flag-off build never loads lab code. (A server component's client
// imports ship in the page's chunk whether they render or not, dynamic() or not.)
export const LabTile = dynamic(() => import('@/components/lab/home/LabTile'));
export const NeofetchLabRows = dynamic(() => import('@/components/lab/home/NeofetchLabRows'));
