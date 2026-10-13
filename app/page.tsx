import LayoutManager from '@/components/layout/LayoutManager';
import { FocusProvider } from '@/contexts/FocusContext';

export default function Home() {
  // ThemeProvider comes from root layout (app/layout.tsx)
  // FocusProvider manages tile focus and the content tile for the homepage layout
  return (
    <FocusProvider>
      <LayoutManager />
    </FocusProvider>
  );
}