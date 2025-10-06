import LayoutManager from '@/components/layout/LayoutManager';
import { FocusProvider } from '@/contexts/FocusContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WindowManagerProvider } from '@/contexts/WindowManagerContext';
import { ViewProvider } from '@/contexts/ViewContext';

export default function Home() {
  return (
    <ThemeProvider>
      <FocusProvider>
        <WindowManagerProvider>
          <ViewProvider>
            <LayoutManager />
          </ViewProvider>
        </WindowManagerProvider>
      </FocusProvider>
    </ThemeProvider>
  );
}