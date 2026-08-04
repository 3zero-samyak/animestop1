import { Tv, BookOpen } from 'lucide-react';
import { DisplayMode } from '@/types/displayMode';

type ModeIconProps = {
  mode: DisplayMode;
};

export default function ModeIcon({ mode }: ModeIconProps) {
  if (mode === 'anime') {
    return <Tv size={18} strokeWidth={1.8} />;
  }
  
  return <BookOpen size={18} strokeWidth={1.8} />;
}
