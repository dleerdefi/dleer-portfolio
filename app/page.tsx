import LayoutManager from '@/components/layout/LayoutManager';
import { FocusProvider } from '@/contexts/FocusContext';
import { ViewProvider } from '@/contexts/ViewContext';

export default function Home() {
  // ThemeProvider comes from root layout (app/layout.tsx)
  // Only need Focus/View providers for homepage layout management
  return (
    <FocusProvider>
      <ViewProvider>
        <LayoutManager />
      </ViewProvider>
    </FocusProvider>
  );
}