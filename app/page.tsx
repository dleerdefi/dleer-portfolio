import LayoutManager from '@/components/RicedLayout/LayoutManager';
import { FocusProvider } from '@/contexts/FocusContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function Home() {
  return (
    <ThemeProvider>
      <FocusProvider>
        <LayoutManager />
      </FocusProvider>
    </ThemeProvider>
  );
}