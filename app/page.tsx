import LayoutManagerWithFocus from '@/components/RicedLayout/LayoutManagerWithFocus';
import { FocusProvider } from '@/contexts/FocusContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function Home() {
  return (
    <ThemeProvider>
      <FocusProvider>
        <LayoutManagerWithFocus />
      </FocusProvider>
    </ThemeProvider>
  );
}