import { OG_CONTENT_TYPE, OG_SIZE, renderSiteCard } from '@/lib/og/card';
import { getPortfolioConfig } from '@/config/portfolio.config';

// The site's default Open Graph card, rendered at build time (lib/og/card.tsx)
export const alt = `${getPortfolioConfig().personal.name}: ${getPortfolioConfig().personal.title}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderSiteCard();
}
