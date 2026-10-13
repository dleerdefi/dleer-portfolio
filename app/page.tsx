import LayoutManager from '@/components/layout/LayoutManager';
import { FocusProvider } from '@/contexts/FocusContext';
import { ContentIndexProvider } from '@/contexts/ContentIndexContext';
import { contentIndex } from '@/lib/content-index';

export default function Home() {
  // ThemeProvider comes from the root layout (app/layout.tsx). The content index is built here, on
  // the server, so the client gets project and post summaries and never the documents' MDX or HTML.
  return (
    <ContentIndexProvider value={contentIndex()}>
      <FocusProvider>
        <LayoutManager />
      </FocusProvider>
    </ContentIndexProvider>
  );
}
