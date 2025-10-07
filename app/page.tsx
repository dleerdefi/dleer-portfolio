import LayoutManager from '@/components/layout/LayoutManager';
import { FocusProvider } from '@/contexts/FocusContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ViewProvider } from '@/contexts/ViewContext';

export default function Home() {
  return (
    <ThemeProvider>
      <FocusProvider>
        <ViewProvider>
          <LayoutManager />
        </ViewProvider>
      </FocusProvider>
    </ThemeProvider>
  );
}