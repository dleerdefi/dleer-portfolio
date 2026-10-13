'use client';

import React, { createContext, useContext } from 'react';
import type { ContentIndex } from '@/lib/content-types';

const ContentIndexContext = createContext<ContentIndex | null>(null);

/** Holds the slim project and post lists the home page's server component built (lib/content-index.ts). */
export function ContentIndexProvider({ value, children }: { value: ContentIndex; children: React.ReactNode }) {
  return <ContentIndexContext.Provider value={value}>{children}</ContentIndexContext.Provider>;
}

export function useContentIndex(): ContentIndex {
  const value = useContext(ContentIndexContext);
  if (!value) throw new Error('useContentIndex must be used inside ContentIndexProvider');
  return value;
}
