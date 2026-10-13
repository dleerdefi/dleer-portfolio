import { ContentIndexProvider } from '@/contexts/ContentIndexContext';
import { FocusProvider } from '@/contexts/FocusContext';
import { contentIndex } from '@/lib/content-index';
import { labEnabled } from '@/lib/lab/flag';
import { featuredProjects, otherProjects } from '@/lib/projects';
import { FocusTile } from '@/components/home/FocusTile';
import { HomeShell } from '@/components/home/HomeShell';
import { HomeView } from '@/components/home/HomeView';
import { LabTile } from '@/components/home/LabIslands';
import NavTree from '@/components/home/NavTree';
import { Neofetch } from '@/components/home/Neofetch';
import { Stage } from '@/components/home/Stage';
import { ContactSection, ProjectsSection } from '@/components/home/sections/PhoneSections';

/**
 * The home page, server-rendered as one document (docs/PORTFOLIO_V2_SPEC.md §4.3). CSS lays the
 * same markup out as the desktop tiles (neofetch, contents, lab, stage) or the phone column
 * (hero, featured, lab, projects, contact); nothing here depends on the width.
 */
export default function Home() {
  const index = contentIndex();
  const lab = labEnabled();
  const others = otherProjects(index.projects, featuredProjects(index.projects));
  const sectionIds = ['top', 'home', ...(lab ? ['lab'] : []), 'projects', 'contact'];

  return (
    <ContentIndexProvider value={index}>
      <FocusProvider>
        <HomeShell hasLab={lab} sectionIds={sectionIds}>
          <FocusTile id="neofetch" sectionId="top" label="Profile" dim className="home-hero">
            <Neofetch />
          </FocusTile>
          <FocusTile id="navigation" sectionId="contents" label="Contents" dim className="home-nav">
            <NavTree />
          </FocusTile>
          <FocusTile id="content" sectionId="home" label="Featured" className="home-stage">
            <Stage home={<HomeView projects={index.projects} />} />
          </FocusTile>
          {lab && (
            <FocusTile id="lab" sectionId="lab" label="Lab" dim className="home-lab">
              <LabTile />
            </FocusTile>
          )}
          <ProjectsSection projects={others} />
          <ContactSection />
        </HomeShell>
      </FocusProvider>
    </ContentIndexProvider>
  );
}
