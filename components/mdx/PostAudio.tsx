'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { formatTime, throttle } from '@/lib/audio-utils';
import {
  trackAudioPlay,
  trackAudioPause,
  trackAudioSeek,
  trackAudioSpeedChange,
  trackAudioDownload,
  trackAudioComplete
} from '@/lib/audio-analytics';

interface PostAudioProps {
  src: string;
  title?: string;
  postSlug?: string;
  duration?: number;
  transcriptUrl?: string;
  download?: boolean;
  speeds?: number[];
  className?: string;
}

export function PostAudio({
  src,
  title = 'Listen to this article',
  postSlug = 'unknown',
  duration: initialDuration,
  transcriptUrl,
  download = true,
  speeds = [1, 1.25, 1.5],
  className = '',
}: PostAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration || 0);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seekPreview, setSeekPreview] = useState<number | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = throttle(() => {
      setCurrentTime(audio.currentTime);
    }, 100);

    const handleEnded = () => {
      setIsPlaying(false);
      trackAudioComplete({ postSlug, src });
    };

    const handleError = () => {
      setError('Unable to load audio');
      setIsLoading(false);
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [src, postSlug]);

  // Handle play/pause
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      trackAudioPause({ postSlug, src, positionSeconds: currentTime });
    } else {
      audioRef.current.play().catch(() => {
        setError('Unable to play audio');
      });
      setIsPlaying(true);
      trackAudioPlay({ postSlug, src, positionSeconds: currentTime });
    }
  }, [isPlaying, postSlug, src, currentTime]);

  // Handle speed change
  const cycleSpeed = useCallback(() => {
    if (!audioRef.current) return;

    const nextIndex = (speedIndex + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];

    audioRef.current.playbackRate = newSpeed;
    setSpeedIndex(nextIndex);
    trackAudioSpeedChange({ postSlug, speed: newSpeed });
  }, [speedIndex, speeds, postSlug]);

  // Handle seek
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    const fromSeconds = audioRef.current.currentTime;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);

    // Track seek if significant (> 1 second difference)
    if (Math.abs(fromSeconds - newTime) > 1) {
      trackAudioSeek({ postSlug, fromSeconds, toSeconds: newTime });
    }
  };

  // Handle progress hover preview
  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    setSeekPreview(percentage * duration);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!audioRef.current) return;

      // Skip if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          if (e.target === document.body) {
            e.preventDefault();
            togglePlayPause();
          }
          break;
        case 'arrowleft':
          e.preventDefault();
          audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
          break;
        case 'arrowright':
          e.preventDefault();
          audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
          break;
        case 's':
          e.preventDefault();
          cycleSpeed();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, duration, speedIndex]);

  // Handle download
  const handleDownload = () => {
    trackAudioDownload({ postSlug, src });
    const a = document.createElement('a');
    a.href = src;
    a.download = `${postSlug}.mp3`;
    a.click();
  };

  // Progress percentage
  const progress = duration ? (currentTime / duration) * 100 : 0;

  // Inject JSON-LD for SEO
  useEffect(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'AudioObject',
      name: `${title} (Audio Edition)`,
      contentUrl: src,
      encodingFormat: 'audio/mpeg',
      duration: duration ? `PT${Math.floor(duration)}S` : undefined,
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [src, title, duration]);

  if (error) {
    return null; // Silent fail if audio unavailable
  }

  return (
    <div
      className={`post-audio-player ${className}`}
      style={{
        backgroundColor: 'var(--theme-surface)',
        borderRadius: '8px',
        border: '2px solid var(--theme-border)',
        padding: '12px 16px',
        marginTop: '16px',
        marginBottom: '24px',
        minHeight: '64px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}
      role="region"
      aria-label={title}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        aria-label={title}
      />

      {/* Play/Pause button */}
      <button
        onClick={togglePlayPause}
        disabled={isLoading}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        aria-pressed={isPlaying}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-color)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--theme-bg)',
          transition: 'transform 0.2s, opacity 0.2s',
          opacity: isLoading ? 0.5 : 1,
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isLoading ? (
          // Loading spinner
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <path d="M18 10a8 8 0 01-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 10 10"
                to="360 10 10"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        ) : isPlaying ? (
          // Pause icon
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="5" y="4" width="4" height="12" />
            <rect x="11" y="4" width="4" height="12" />
          </svg>
        ) : (
          // Play icon
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 4.8v10.4a.8.8 0 001.2.7l8-5.2a.8.8 0 000-1.4l-8-5.2A.8.8 0 006 4.8z" />
          </svg>
        )}
      </button>

      {/* Title */}
      <div
        style={{
          flex: '0 1 auto',
          minWidth: '100px',
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: 'var(--theme-text)',
          fontSize: '14px',
        }}
        title={title}
      >
        {title}
      </div>

      {/* Time display */}
      <div
        style={{
          flex: '0 0 auto',
          color: 'var(--theme-text-dimmed)',
          fontSize: '13px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Progress bar */}
      <div
        ref={progressRef}
        onClick={handleProgressClick}
        onMouseMove={handleProgressHover}
        onMouseLeave={() => setSeekPreview(null)}
        style={{
          flex: '1 1 200px',
          minWidth: '100px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          position: 'relative',
          padding: '0 8px',
        }}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        tabIndex={0}
      >
        <div
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'var(--theme-border)',
            borderRadius: '2px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Progress fill */}
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: 'var(--accent-color)',
              transition: 'width 0.1s',
            }}
          />

          {/* Seek preview */}
          {seekPreview !== null && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: `${(seekPreview / duration) * 100}%`,
                transform: 'translateX(-50%)',
                padding: '4px 8px',
                backgroundColor: 'var(--theme-surface)',
                border: '1px solid var(--theme-border)',
                borderRadius: '4px',
                fontSize: '12px',
                color: 'var(--theme-text)',
                whiteSpace: 'nowrap',
                marginBottom: '4px',
                pointerEvents: 'none',
              }}
            >
              {formatTime(seekPreview)}
            </div>
          )}
        </div>
      </div>

      {/* Speed button */}
      <button
        onClick={cycleSpeed}
        aria-label={`Playback speed: ${speeds[speedIndex]}x`}
        style={{
          padding: '6px 10px',
          backgroundColor: 'transparent',
          border: '1px solid var(--theme-border)',
          borderRadius: '4px',
          color: 'var(--theme-text)',
          fontSize: '13px',
          fontFamily: 'var(--font-mono)',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-border)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        {speeds[speedIndex]}×
      </button>

      {/* Download button */}
      {download && (
        <button
          onClick={handleDownload}
          aria-label="Download audio"
          title="Download audio"
          style={{
            width: '32px',
            height: '32px',
            padding: '6px',
            backgroundColor: 'transparent',
            border: '1px solid var(--theme-border)',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-border)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--theme-text)" strokeWidth="2">
            <path d="M10 3v10m0 0l-3-3m3 3l3-3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 12v4a1 1 0 001 1h12a1 1 0 001-1v-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Transcript link */}
      {transcriptUrl && (
        <a
          href={transcriptUrl}
          aria-label="View transcript"
          title="View transcript"
          style={{
            padding: '6px 10px',
            backgroundColor: 'transparent',
            border: '1px solid var(--theme-border)',
            borderRadius: '4px',
            color: 'var(--theme-text)',
            fontSize: '13px',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-border)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Transcript
        </a>
      )}
    </div>
  );
}