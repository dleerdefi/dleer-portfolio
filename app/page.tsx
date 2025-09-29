import LayoutManager from '@/components/layout/LayoutManager';
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