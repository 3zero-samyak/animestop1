import { useContext } from 'react';
import { ModeContext } from '@/components/mode/ModeProvider';

export function useDisplayMode() {
  const context = useContext(ModeContext);
  
  if (!context) {
    throw new Error('useDisplayMode must be used within ModeProvider');
  }
  
  return context;
}
