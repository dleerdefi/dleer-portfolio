import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function About() {
  const experience = [
    {
      period: "2021-Present",
      title: "Senior DeFi Architect",
      highlights: [
        "Designed token economics for protocols with $50M+ TVL",
        "Built Neo4j-powered analytics for on-chain data",
        "Led technical due diligence for 10+ DeFi projects"
      ]
    },
    {
      period: "2019-2021",
      title: "Blockchain Engineer",
      highlights: [
        "Developed smart contracts for DEX and lending protocols",
        "Implemented automated market maker algorithms",
        "Created governance frameworks for DAOs"
      ]
    },
    {
      period: "2017-2019",
      title: "Data Science Engineer",
      highlights: [
        "Built ML models for construction project optimization",
        "Developed predictive analytics for resource allocation",
        "Created data pipelines processing 1M+ records daily"
      ]
    }
  ];

  const skills = {
    "Blockchain": [
      "Solidity", "Hardhat", "Foundry",
      "EVM", "Layer 2s", "Cross-chain",
      "Token Standards (ERC20/721/1155)"
    ],
    "Data Engineering": [
      "Neo4j", "Cypher", "GraphQL",
      "Python", "TypeScript", "Rust",
      "ETL", "Real-time Processing"
    ],
    "DeFi Protocols": [
      "AMMs & Liquidity Pools",
      "Lending & Borrowing",
      "Yield Optimization"
    ],
    "Token Economics": [
      "Incentive Design",
      "Governance Mechanisms",
      "Sustainable Tokenomics"
    ]
  };

  return (
    <>
      {/* Hero Section */}
      <Section className="py-16 bg-bg-secondary">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          About Me
        </h1>
        <p className="text-lg text-text-secondary max-w-3xl leading-relaxed">
          DeFi architect and token economics designer with 5+ years of experience building and scaling
          decentralized finance protocols. Specializing in incentive mechanism design, liquidity optimization,
          and knowledge graph integration for next-generation blockchain applications.
        </p>
        <p className="text-text-secondary mt-4 leading-relaxed max-w-3xl">
          Background in construction engineering and data science, bringing a unique analytical perspective
          to protocol design and system architecture. Currently focused on Neo4j knowledge graphs for
          AI/LLM applications in the Web3 space.
        </p>
      </Section>

      {/* Experience Section */}
      <Section>
        <h2 className="text-3xl font-bold text-text-primary mb-8">Experience</h2>
        <div className="space-y-6">
          {experience.map((role, index) => (
            <Card key={index} hover={false}>
              <div className="flex flex-col md:flex-row md:gap-8">
                <div className="text-accent-primary font-semibold mb-2 md:mb-0 md:w-32">
                  {role.period}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    {role.title}
                  </h3>
                  <ul className="space-y-2 text-text-secondary">
                    {role.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-accent-secondary mr-2">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Skills Section */}
      <Section className="bg-bg-secondary">
        <h2 className="text-3xl font-bold text-text-primary mb-8">Technical Expertise</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(skills).map(([category, items]) => (
            <Card key={category} hover={false}>
              <h3 className="text-lg font-bold text-accent-primary mb-4">
                {category}
              </h3>
              <div className="space-y-2">
                {items.map((skill) => (
                  <div key={skill} className="text-text-secondary text-sm">
                    {skill}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Education & Certifications */}
      <Section>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Education</h2>
            <div className="space-y-4">
              <Card hover={false}>
                <h3 className="text-lg font-semibold text-text-primary">M.S. Data Science</h3>
                <p className="text-text-secondary">University of California • 2019</p>
              </Card>
              <Card hover={false}>
                <h3 className="text-lg font-semibold text-text-primary">B.S. Construction Engineering</h3>
                <p className="text-text-secondary">California Polytechnic • 2017</p>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Certifications</h2>
            <Card hover={false}>
              <ul className="space-y-2">
                <li className="text-text-secondary">• Neo4j Certified Professional</li>
                <li className="text-text-secondary">• AWS Solutions Architect</li>
                <li className="text-text-secondary">• Chainlink Developer</li>
                <li className="text-text-secondary">• ConsenSys Blockchain Developer</li>
              </ul>
            </Card>
          </div>
        </div>
      </Section>

      {/* Interests */}
      <Section className="bg-bg-secondary">
        <h2 className="text-3xl font-bold text-text-primary mb-8">Interests & Research</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card hover={false}>
            <h3 className="text-lg font-bold text-accent-primary mb-3">Technical</h3>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li>• Homelab Infrastructure</li>
              <li>• Drone Technology</li>
              <li>• Open Source Contributing</li>
            </ul>
          </Card>
          <Card hover={false}>
            <h3 className="text-lg font-bold text-accent-primary mb-3">Research</h3>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li>• MEV & Protocol Design</li>
              <li>• Knowledge Graph AI</li>
              <li>• Zero-Knowledge Proofs</li>
            </ul>
          </Card>
          <Card hover={false}>
            <h3 className="text-lg font-bold text-accent-primary mb-3">Personal</h3>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li>• Linux Systems</li>
              <li>• UI/UX Design</li>
              <li>• Technical Writing</li>
            </ul>
          </Card>
        </div>
      </Section>
    </>
  );
}