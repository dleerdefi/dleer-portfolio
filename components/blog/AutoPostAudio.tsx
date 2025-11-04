'use client';

import { useEffect, useState } from 'react';
import { PostAudio } from '@/components/mdx/PostAudio';
import { getBlogAudioPath, audioExists } from '@/lib/audio-utils';

interface AutoPostAudioProps {
  slug: string;
  title: string;
  className?: string;
}

/**
 * Automatically detects if an audio file exists for a blog post
 * and renders the PostAudio component if found
 */
export function AutoPostAudio({ slug, title, className }: AutoPostAudioProps) {
  const [hasAudio, setHasAudio] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const audioUrl = getBlogAudioPath(slug);

  useEffect(() => {
    // Check if audio file exists
    const checkAudio = async () => {
      try {
        const exists = await audioExists(audioUrl);
        setHasAudio(exists);
      } catch {
        console.debug(`No audio file found for ${slug}`);
        setHasAudio(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAudio();
  }, [audioUrl, slug]);

  // Don't render anything while checking or if no audio
  if (isChecking || !hasAudio) {
    return null;
  }

  return (
    <PostAudio
      src={audioUrl}
      title={`Listen to "${title}"`}
      postSlug={slug}
      className={className}
    />
  );
}