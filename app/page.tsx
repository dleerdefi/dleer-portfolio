import { FocusProvider } from '@/contexts/FocusContext';
import { projectSummaries } from '@/lib/content-index';
import { withGitHubStats } from '@/lib/github';
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
 * (hero, featured, lab, projects, contact); nothing here depends on the width. Rebuilt daily so
 * the GitHub numbers on the cards stay fresh (lib/github.ts).
 */
export const revalidate = 86400;

export default async function Home() {
  const projects = await withGitHubStats(projectSummaries());
  const featured = featuredProjects(projects);
  const others = otherProjects(projects, featured);
  const lab = labEnabled();
  const sectionIds = ['top', 'home', ...(lab ? ['lab'] : []), 'projects', 'contact'];

  return (
    <FocusProvider>
      <HomeShell hasLab={lab} sectionIds={sectionIds}>
        <FocusTile id="neofetch" sectionId="top" label="Profile" dim className="home-hero">
          <Neofetch />
        </FocusTile>
        <FocusTile id="navigation" sectionId="contents" label="Contents" dim className="home-nav">
          <NavTree featured={featured.map(({ slug, title, url }) => ({ slug, title, url }))} more={others.length} />
        </FocusTile>
        <FocusTile id="content" sectionId="home" label="Featured" className="home-stage">
          <Stage home={<HomeView featured={featured} others={others} />} />
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
  );
}
