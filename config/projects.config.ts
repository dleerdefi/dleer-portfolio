import type { Project } from './types';

// Project configurations - Optimized with condensed descriptions
export const projectsData: Project[] = [
  // === OPEN SOURCE PROJECTS (GitHub Available) ===

  // 1. RinAI - Agentic AI Companion
  {
    id: "peak-ai-agent-stack",
    name: "RinAI - Agentic AI Companion",
    filename: "peak-ai-agent-stack",
    description: "Advanced AI companion built with GraphRAG and Neo4j, processing 18,000+ messages with parallel tool execution and dynamic LLM routing across multiple providers. Features intelligent context management, automated conversation summarization, and real-time web search using DeepSeek R1 for sophisticated agentic workflows.",
    metricsSummary: "18K+ messages • Multi-LLM support • Real-time parallel processing",
    techStack: ["Node.js", "Python", "Neo4j", "MongoDB", "LangChain"],
    techStackDisplay: "Node.js, Python, Neo4j, MongoDB, LangChain",
    github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_HANDLE || 'dleerdefi'}/peak-ai-agent-stack`,
    screenshots: [
      "frontend-interface.webp",
      "neo4j-graph.webp",
      "smart-context.webp",
      "agent-stack-diagram.webp"
    ],
    status: "production" as const,
    category: "systems",
    role: "built",
    visibility: "open-source"
  },

  // 2. LLM Security Auditor
  {
    id: "llm-security-auditor",
    name: "LLM Security Auditor",
    filename: "llm-security-auditor",
    description: "DSPy-powered security framework that reduces jailbreak success rates from 23% to 3% through automated testing against 25+ attack categories aligned with OWASP LLM Top 10 2025. Delivers comprehensive security audits at ~$0.50 per run compared to thousands for manual testing, making enterprise-grade security accessible as a public good.",
    metricsSummary: "23% → 3% jailbreak rate • $0.50 vs $1000s • 25+ attack types",
    techStack: ["Python", "DSPy", "MLflow", "Docker"],
    techStackDisplay: "Python, DSPy, MLflow, Docker",
    github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_HANDLE || 'dleerdefi'}/llm-security-auditor`,
    status: "production" as const,
    category: "systems",
    role: "built",
    visibility: "open-source"
  },

  // 3. Agent State Machine
  {
    id: "agent-state-machine",
    name: "Agent State Machine",
    filename: "agent-state-machine",
    description: "Hierarchical state machine architecture for complex multi-turn AI interactions, integrating 6+ tools (Twitter, crypto tracking, weather, NEAR Protocol) with GraphRAG memory system. Streamlined framework built with MongoDB and optional Neo4j support, featuring a clean web interface for managing stateful agent conversations.",
    metricsSummary: "6+ integrated tools • Hierarchical state management • MIT licensed",
    techStack: ["Python", "MongoDB", "Neo4j", "FastAPI"],
    techStackDisplay: "Python, MongoDB, Neo4j, FastAPI",
    github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_HANDLE || 'dleerdefi'}/agent-state-machine`,
    status: "production" as const,
    category: "systems",
    role: "built",
    visibility: "open-source"
  },

  // 4. RinAI VTuber & Desktop Agent
  {
    id: "rinai-multimodal-vtuber",
    name: "RinAI VTuber & Desktop Agent",
    filename: "rinai-multimodal-vtuber",
    description: "Open-source AI VTuber combining real-time speech processing (Groq Whisper, 11Labs), VTube Studio integration, and desktop automation for autonomous 24/7 streaming. Features Twitter scheduling, YouTube chat interaction, GraphRAG memory, and extensible tool framework. Complete streaming automation stack with OBS integration and voice synthesis.",
    metricsSummary: "12+ GitHub stars • Autonomous streaming • 98% Python",
    techStack: ["Python", "Node.js", "TypeScript", "FFmpeg", "VoiceMeeter"],
    techStackDisplay: "Python, Node.js, TypeScript, FFmpeg, VoiceMeeter",
    github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_HANDLE || 'dleerdefi'}/rinai-multimodal-vtuber`,
    screenshots: [
      "vtuber-ux-example.webp",
      "vtuber-architecture.webp"
    ],
    status: "production" as const,
    category: "experimental",
    role: "built",
    visibility: "open-source"
  },

  // 5. AI VTuber Trading Battle
  {
    id: "rin-streams",
    name: "AI VTuber Trading Battle",
    filename: "rin-streams",
    description: "Revolutionary streaming system where dual AI VTubers (Rin & Biscuit) compete in live cryptocurrency trading battles driven by YouTube chat sentiment. Real-time sentiment analysis triggers blockchain trades on Uniswap V3 every 30 seconds, creating a gamified intersection of AI, streaming, and DeFi with synchronized avatar responses and user loyalty tracking.",
    metricsSummary: "Sentiment-driven trading • Dual AI competition • Real blockchain integration",
    techStack: ["Python", "Node.js", "MongoDB", "Uniswap V3", "VTube Studio", "ElevenLabs"],
    techStackDisplay: "Python, Node.js, MongoDB, Uniswap V3, VTube Studio, ElevenLabs",
    github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_HANDLE || 'dleerdefi'}/ai-vtuber-trading-battle`,
    status: "development" as const,
    category: "experimental",
    role: "built",
    visibility: "open-source"
  },

  // === PROPRIETARY PROJECTS (Closed Source) ===

  // 6. Consumer Score Engine
  {
    id: "consumer-score-engine",
    name: "Consumer Score Engine",
    filename: "consumer-score-engine",
    description: "High-performance distributed scoring pipeline processing 2M+ daily transactions across 30K+ DeFi user accounts. Built with microservices architecture using Kafka, Neo4j, and ML-powered algorithms for real-time on-chain and social data ingestion. Graph-based relationship modeling enables sophisticated behavioral analysis at scale.",
    metricsSummary: "2M+ daily transactions • 30K+ users • Real-time scoring",
    techStack: ["Python", "Kafka", "Neo4j", "Redis", "scikit-learn"],
    techStackDisplay: "Python, Kafka, Neo4j, Redis, scikit-learn",
    status: "production" as const,
    category: "systems",
    role: "built",
    visibility: "proprietary"
  },

  // 7. Token Dynamics Simulator
  {
    id: "token-economy-simulator",
    name: "Token Dynamics Simulator",
    filename: "token-economy-simulator",
    description: "Agent-based simulation platform modeling token economies and market dynamics using Uniswap V2 AMM mechanics with configurable stakeholder behaviors. Features Monte Carlo analysis (10-10,000 runs), Enhanced Market Maker operations, and 4-phase lifecycle modeling. Used by major foundations and market makers to model $500M+ in token economies and optimize launch strategies.",
    metricsSummary: "$500M+ modeled • 100K+ simulations • Monte Carlo analysis",
    techStack: ["Python", "Streamlit", "Mesa", "NumPy", "Pandas", "Plotly"],
    techStackDisplay: "Python, Streamlit, Mesa, NumPy, Pandas, Plotly",
    status: "production" as const,
    category: "systems",
    role: "built",
    visibility: "proprietary"
  },

  // 8. Kinsu Savings App
  {
    id: "kinsu-savings",
    name: "Kinsu Savings App",
    filename: "kinsu-savings",
    description: "Leading product vision and execution for a consumer-friendly DeFi savings aggregator. Architected multi-chain portfolio management with automated yield optimization, risk assessment dashboard, and one-click diversification strategies. Coordinated cross-functional teams from concept through development, preparing for public launch.",
    metricsSummary: "Multi-chain support • Automated yield optimization • In development",
    techStack: ["React", "Web3.js", "Solidity", "The Graph", "Node.js"],
    techStackDisplay: "React, Web3.js, Solidity, The Graph, Node.js",
    demo: "https://kinsu.fi",
    status: "development" as const,
    category: "product",
    role: "led",
    visibility: "proprietary"
  },

  // 9. Play-to-Airdrop Campaign System
  {
    id: "play-to-airdrop",
    name: "Play-to-Airdrop Campaign System",
    filename: "play-to-airdrop",
    description: "Designed and led development of multi-chain gamified scoring platform that evaluates user accounts across X/Twitter, Farcaster, Discord, and on-chain wallets spanning Ethereum, Solana, NEAR Protocol, and 60+ EVM chains. Drives daily engagement through quests, sentiment-driven training questions, content sharing, and trading activities. Features real-time scoring, dynamic leaderboards, anti-sybil protection, and automated reward distribution with 50K+ active participants.",
    metricsSummary: "50K+ participants • Multi-chain scoring • 60+ EVM chains",
    techStack: ["TypeScript", "Next.js", "PostgreSQL", "Redis"],
    techStackDisplay: "TypeScript, Next.js, PostgreSQL, Redis",
    status: "production" as const,
    category: "product",
    role: "architected",
    visibility: "proprietary"
  }
];
