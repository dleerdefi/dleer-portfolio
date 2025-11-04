/**
 * Audio analytics tracking utilities
 * Dispatches custom events that can be captured by analytics services
 */

export interface AudioEvent {
  postSlug: string;
  src: string;
  positionSeconds?: number;
  fromSeconds?: number;
  toSeconds?: number;
  speed?: number;
}

/**
 * Track audio play event
 */
export function trackAudioPlay(data: Pick<AudioEvent, 'postSlug' | 'src' | 'positionSeconds'>) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('audio_play', {
        detail: data,
      })
    );
  }
}

/**
 * Track audio pause event
 */
export function trackAudioPause(data: Pick<AudioEvent, 'postSlug' | 'src' | 'positionSeconds'>) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('audio_pause', {
        detail: data,
      })
    );
  }
}

/**
 * Track audio seek event
 */
export function trackAudioSeek(data: Pick<AudioEvent, 'postSlug' | 'fromSeconds' | 'toSeconds'>) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('audio_seek', {
        detail: data,
      })
    );
  }
}

/**
 * Track audio speed change event
 */
export function trackAudioSpeedChange(data: Pick<AudioEvent, 'postSlug' | 'speed'>) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('audio_speed_change', {
        detail: data,
      })
    );
  }
}

/**
 * Track audio download event
 */
export function trackAudioDownload(data: Pick<AudioEvent, 'postSlug' | 'src'>) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('audio_download', {
        detail: data,
      })
    );
  }
}

/**
 * Track audio completion event
 */
export function trackAudioComplete(data: Pick<AudioEvent, 'postSlug' | 'src'>) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('audio_complete', {
        detail: data,
      })
    );
  }
}

/**
 * Track audio error event
 */
export function trackAudioError(data: Pick<AudioEvent, 'postSlug' | 'src'> & { error: string }) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('audio_error', {
        detail: data,
      })
    );
  }
}

/**
 * Initialize analytics listeners (optional)
 * This can be used to forward events to Google Analytics, Plausible, etc.
 */
export function initAudioAnalytics() {
  if (typeof window === 'undefined') return;

  // Type for Google Analytics global
  interface WindowWithGtag extends Window {
    gtag?: (...args: unknown[]) => void;
  }

  // Example: Forward to Google Analytics (if available)
  window.addEventListener('audio_play', (event) => {
    const customEvent = event as CustomEvent<AudioEvent>;
    const windowWithGtag = window as WindowWithGtag;
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag('event', 'audio_play', {
        post_slug: customEvent.detail.postSlug,
        position: customEvent.detail.positionSeconds,
      });
    }
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Audio Analytics]', 'Play', customEvent.detail);
    }
  });

  window.addEventListener('audio_pause', (event) => {
    const customEvent = event as CustomEvent<AudioEvent>;
    const windowWithGtag = window as WindowWithGtag;
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag('event', 'audio_pause', {
        post_slug: customEvent.detail.postSlug,
        position: customEvent.detail.positionSeconds,
      });
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('[Audio Analytics]', 'Pause', customEvent.detail);
    }
  });

  window.addEventListener('audio_complete', (event) => {
    const customEvent = event as CustomEvent<AudioEvent>;
    const windowWithGtag = window as WindowWithGtag;
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag('event', 'audio_complete', {
        post_slug: customEvent.detail.postSlug,
      });
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('[Audio Analytics]', 'Complete', customEvent.detail);
    }
  });

  window.addEventListener('audio_speed_change', (event) => {
    const customEvent = event as CustomEvent<AudioEvent>;
    const windowWithGtag = window as WindowWithGtag;
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag('event', 'audio_speed_change', {
        post_slug: customEvent.detail.postSlug,
        speed: customEvent.detail.speed,
      });
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('[Audio Analytics]', 'Speed Change', customEvent.detail);
    }
  });

  window.addEventListener('audio_download', (event) => {
    const customEvent = event as CustomEvent<AudioEvent>;
    const windowWithGtag = window as WindowWithGtag;
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag('event', 'audio_download', {
        post_slug: customEvent.detail.postSlug,
      });
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('[Audio Analytics]', 'Download', customEvent.detail);
    }
  });
}