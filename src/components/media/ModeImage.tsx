'use client';

import React, { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { ImageOff } from 'lucide-react';

/**
 * ModeImage - Content image wrapper with automatic Manga Mode support
 * and resilient missing-image / load-error fallback states.
 * 
 * In Manga Mode, content images:
 * - Display black-and-white by default
 * - Reveal original color on hover/focus
 * - Transition smoothly without layout shift
 */

type ModeImageProps = ImageProps & {
  /**
   * Set to true to exempt this image from Manga Mode grayscale treatment.
   * Use for logos, icons, UI graphics, avatars, and interface elements.
   */
  exemptFromModeFilter?: boolean;
};

export default function ModeImage({
  exemptFromModeFilter = false,
  className = '',
  alt,
  onError,
  ...props
}: ModeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`mode-image-fallback flex items-center justify-center ${className}`.trim()}
        style={{
          backgroundColor: 'var(--surface-secondary)',
          border: '1px solid var(--border-soft)',
          width: props.fill ? '100%' : props.width,
          height: props.fill ? '100%' : props.height,
        }}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        <ImageOff className="w-8 h-8 opacity-40 text-[var(--text-muted)]" />
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      onError={(e) => {
        setHasError(true);
        onError?.(e);
      }}
      data-mode-sensitive={exemptFromModeFilter ? undefined : 'true'}
      data-mode-exempt={exemptFromModeFilter ? 'true' : undefined}
      className={`mode-sensitive-image ${className}`.trim()}
    />
  );
}
