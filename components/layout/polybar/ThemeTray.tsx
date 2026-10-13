'use client';

import React from 'react';
import Image from 'next/image';
import { accentColorMap, useTheme, type AccentColor, type ThemePreset } from '@/contexts/ThemeContext';
import { NordIcon, SolarizedIcon, TokyoNightIcon } from '@/components/icons/ThemeIcons';
import { getThumbnailUrl } from '@/lib/image-paths';
import { themeBackgrounds } from '@/lib/wallpapers';
import { Popover } from './Popover';

const PRESETS: { id: ThemePreset; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: 'tokyo-night', label: 'Tokyo Night', Icon: TokyoNightIcon },
  { id: 'nord', label: 'Nord', Icon: NordIcon },
  { id: 'solarized-light', label: 'Solarized Light', Icon: SolarizedIcon },
];

/** `cool_rocks.webp` → `cool rocks` */
const wallpaperLabel = (url: string) => (url.split('/').pop() ?? url).replace(/\.\w+$/, '').replace(/[_-]+/g, ' ');

/**
 * The polybar's theme tray (docs/PORTFOLIO_V2_SPEC.md §4.1): the three presets, the accent
 * picker, the wallpaper picker with the orbs toggle, and the keys help. It replaces the three
 * settings tiles.
 */
export function ThemeTray() {
  const { theme, setThemePreset, setAccentColor, setBackgroundImage, toggleBackgroundEffect } = useTheme();

  return (
    <div className="tray" role="group" aria-label="Theme">
      {PRESETS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className="tray-button"
          aria-label={`${label} theme`}
          title={label}
          aria-pressed={theme.preset === id}
          onClick={() => setThemePreset(id)}
        >
          <Icon size={15} />
        </button>
      ))}

      <Popover label="Accent color" triggerLabel={`Accent color: ${theme.accentColor}`} trigger={<span className="tray-dot" aria-hidden="true" />}>
        {(close) => (
          <div className="swatch-grid">
            {(Object.entries(accentColorMap) as [AccentColor, string][]).map(([name, hex]) => (
              <button
                key={name}
                type="button"
                className="swatch"
                style={{ backgroundColor: hex }}
                aria-label={name}
                title={name}
                aria-pressed={theme.accentColor === name}
                onClick={() => {
                  setAccentColor(name);
                  close();
                }}
              />
            ))}
          </div>
        )}
      </Popover>

      <Popover label="Wallpaper" triggerLabel="Wallpaper" trigger={<span aria-hidden="true">◫</span>}>
        {() => (
          <div className="wallpaper-picker">
            <div className="wallpaper-grid">
              {themeBackgrounds[theme.preset].map((url) => (
                <button
                  key={url}
                  type="button"
                  className="wallpaper-option"
                  aria-label={wallpaperLabel(url)}
                  aria-pressed={theme.backgroundImage === url}
                  onClick={() => setBackgroundImage(url)}
                >
                  <Image src={getThumbnailUrl(url)} alt="" width={96} height={54} quality={70} sizes="96px" />
                </button>
              ))}
              <button
                type="button"
                className="wallpaper-option wallpaper-none"
                aria-pressed={theme.backgroundImage === null}
                onClick={() => setBackgroundImage(null)}
              >
                none
              </button>
            </div>
            <button type="button" className="popover-toggle" aria-pressed={theme.backgroundEffect} onClick={toggleBackgroundEffect}>
              orbs: {theme.backgroundEffect ? 'on' : 'off'}
            </button>
          </div>
        )}
      </Popover>

      <Popover label="Keyboard shortcuts" triggerLabel="Keyboard shortcuts" trigger={<span aria-hidden="true">?</span>}>
        {() => (
          <dl className="keys-help">
            <dt>Tab</dt>
            <dd>move through links and buttons; the tile you are in lights up</dd>
            <dt>h j k l</dt>
            <dd>jump between tiles</dd>
            <dt>Esc</dt>
            <dd>close this; back to home</dd>
            <dt>j k Enter</dt>
            <dd>move and open in the /projects and /blog lists</dd>
          </dl>
        )}
      </Popover>
    </div>
  );
}
