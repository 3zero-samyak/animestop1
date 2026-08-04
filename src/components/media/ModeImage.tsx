import Image, { type ImageProps } from 'next/image';

/**
 * ModeImage - Content image wrapper with automatic Manga Mode support
 * 
 * All future content imagery should use ModeImage or data-mode-sensitive="true".
 * UI icons, logos and avatars must use exemptFromModeFilter or data-mode-exempt="true".
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
  ...props
}: ModeImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      data-mode-sensitive={exemptFromModeFilter ? undefined : 'true'}
      data-mode-exempt={exemptFromModeFilter ? 'true' : undefined}
      className={`mode-sensitive-image ${className}`.trim()}
    />
  );
}
