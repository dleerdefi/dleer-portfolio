import type { Project } from './types';

// Project configurations with open source projects prioritized
export const projectsData: Project[] = [
  // === OPEN SOURCE PROJECTS (GitHub Available) ===

  // 1. RinAI - Peak AI Agent Stack (Most sophisticated system)
  {
    id: "peak-ai-agent-stack",
    name: "RinAI - Agentic AI Companion",
    filename: "peak-ai-agent-stack",
    description: "Sophisticated AI companion with graph-based RAG and intelligent context management",
    overview: "Advanced agentic companion leveraging GraphRAG with Neo4j, real-time tool orchestration, and dynamic LLM gateway. Features ~18,000 processed messages in graph database with parallel execution capabilities and automated conversation summarization.",
    features: [
      "Graph-based RAG with Neo4j (18,000+ messages)",
      "Parallel execution of tools, RAG, and LLM calls",
      "Dynamic LLM gateway supporting multiple providers",
      "Intelligent context management with auto-summarization",
      "Advanced web search using DeepSeek R1"
    ],
    techStack: ["Node.js", "Python", "Neo4j", "MongoDB", "LangChain"],
    techStackDisplay: "Node.js, Python, Neo4j, MongoDB, LangChain",
    github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_HANDLE || 'dleerdefi'}/peak-ai-agent-stack`,
    status: "production" as const,
    category: "systems",
    role: "built",
    visibility: "open-source",
    metrics: [
      "18,000+ processed messages",
      "Multi-LLM provider support",
      "Real-time parallel processing"
    ]
  },

  // 2. LLM Security Auditor (Best concrete metrics)
  {
    id: "llm-security-auditor",
    name: "LLM Security Auditor",
    filename: "llm-security-auditor",
    description: "Universal AI prompt auditing tool reducing jailbreak rates from 23% to 3%",
    overview: "DSPy-powered security framework testing against 25+ attack categories aligned with OWASP LLM Top 10 2025. Cost-effective automated testing at ~$0.50 per audit compared to $1000s for manual testing. A public good tool for the AI community.",
    features: [
      "Automated jailbreak testing (25+ attack categories)",
      "DSPy-powered prompt optimization",
      "OWASP LLM Top 10 2025 aligned",
      "Comprehensive security reports",
      "Multi-model support (GPT-4o, Claude, local models)"
    ],
    techStack: ["Python", "DSPy", "MLflow", "Docker"],
    techStackDisplay: "Python, DSPy, MLflow, Docker",
    github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_HANDLE || 'dleerdefi'}/llm-security-auditor`,
    status: "production" as const,
    category: "systems",
    role: "built",
    visibility: "open-source",
    metrics: [
      "Jailbreak reduction: 23% → 3%",
      "$0.50 per audit vs $1000s manual",
      "25+ attack categories"
    ]
  },

  // 3. Agent State Machine
  {
    id: "agent-state-machine",
    name: "Agent State Machine",
    filename: "agent-state-machine",
    description: "Hierarchical state machine with multi-tool integration and GraphRAG",
    overview: "Streamlined version of RinAI focused on hierarchical state machine architecture for complex multi-turn interactions. Integrates multiple tools including Twitter, crypto tracking, weather, and NEAR Protocol transactions with GraphRAG memory system.",
    features: [
      "Hierarchical state machine for complex interactions",
      "GraphRAG memory system with MongoDB",
      "6+ tool integrations (Twitter, crypto, weather, NEAR)",
      "Simple web-based chat interface",
      "Optional Neo4j support for advanced graph operations"
    ],
    techStack: ["Python", "MongoDB", "Neo4j", "FastAPI"],
    techStackDisplay: "Python, MongoDB, Neo4j, FastAPI",
    github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_HANDLE || 'dleerdefi'}/agent-state-machine`,
    status: "production" as const,
    category: "systems",
    role: "built",
    visibility: "open-source",
    metrics: [
      "6+ integrated tools",
      "Hierarchical state management",
      "MIT licensed framework"
    ]
  },

  // 4. RinAI Multimodal VTuber
  {
    id: "rinai-multimodal-vtuber",
    name: "RinAI VTuber & Desktop Agent",
    filename: "rinai-multimodal-vtuber",
    description: "Open-source AI VTuber with speech processing and streaming automation",
    overview: "Combines real-time speech processing, VTube Studio integration, and desktop automation for autonomous streaming. Features Twitter scheduling, YouTube chat interaction, and extensible tool framework designed for 24/7 autonomous operation.",
    features: [
      "Real-time STT/TTS (Groq Whisper, 11Labs)",
      "VTube Studio and OBS integration",
      "Twitter automation and scheduling",
      "YouTube chat interaction",
      "GraphRAG memory system",
      "Extensible tool framework"
    ],
    techStack: ["Python", "Node.js", "TypeScript", "FFmpeg", "VoiceMeeter"],
    techStackDisplay: "Python, Node.js, TypeScript, FFmpeg, VoiceMeeter",
    github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_HANDLE || 'dleerdefi'}/rinai-multimodal-vtuber`,
    status: "production" as const,
    category: "experimental",
    role: "built",
    visibility: "open-source",
    metrics: [
      "12+ GitHub stars",
      "Autonomous streaming capable",
      "98% Python codebase"
    ]
  },

  // 5. AI VTuber Trading Battle
  {
    id: "rin-streams",
    name: "AI VTuber Trading Battle",
    filename: "rin-streams",
    description: "Dual AI VTubers engage in live trading battles driven by YouTube chat sentiment",
    overview: "Revolutionary streaming system where AI VTubers Rin & Biscuit compete in real-time cryptocurrency trading battles. YouTube chat sentiment drives blockchain trades on Uniswap V3, creating a gamified intersection of AI, streaming, and DeFi. Features 30-second sentiment batch processing and synchronized avatar responses.",
    features: [
      "Dual AI VTubers with distinct personalities",
      "Real-time sentiment-driven blockchain trading",
      "30-second batch sentiment processing",
      "User loyalty momentum system",
      "Synchronized VTube Studio avatar control"
    ],
    techStack: ["Python", "Node.js", "MongoDB", "Uniswap V3", "VTube Studio", "ElevenLabs"],
    techStackDisplay: "Python, Node.js, MongoDB, Uniswap V3, VTube Studio, ElevenLabs",
    github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_HANDLE || 'dleerdefi'}/ai-vtuber-trading-battle`,
    status: "development" as const,
    category: "experimental",
    role: "built",
    visibility: "open-source",
    metrics: [
      "Sentiment-driven trading system",
      "Dual AI personality competition",
      "Real blockchain integration"
    ]
  },

  // === PROPRIETARY PROJECTS (Closed Source) ===

  // 6. Consumer Score Engine
  {
    id: "consumer-score-engine",
    name: "Consumer Score Engine",
    filename: "consumer-score-engine",
    description: "Distributed scoring pipeline for DeFi user behavior analysis",
    overview: "High-performance data pipeline that processes on-chain and social data to generate user scores. Built with microservices architecture for scalability and real-time processing capabilities.",
    features: [
      "Real-time data ingestion from multiple sources",
      "Graph-based relationship modeling",
      "ML-powered scoring algorithms",
      "Horizontal scaling with Kafka",
      "Sub-second query response times"
    ],
    techStack: ["Python", "Kafka", "Neo4j", "Redis", "scikit-learn"],
    techStackDisplay: "Python, Kafka, Neo4j, Redis, scikit-learn",
    status: "production" as const,
    category: "systems",
    role: "built",
    visibility: "proprietary",
    metrics: [
      "Processed 2M+ transactions daily",
      "Analyzed 30K+ user accounts",
      "Sub-100ms scoring latency"
    ]
  },

  // 7. Token Dynamics Simulator
  {
    id: "token-economy-simulator",
    name: "Token Dynamics Simulator",
    filename: "token-economy-simulator",
    description: "Advanced agent-based modeling platform for token launch dynamics and market behavior simulation",
    overview: "Sophisticated agent-based simulation platform for modeling token economies and market dynamics. Features configurable stakeholder behaviors, automated market maker mechanics, and comprehensive Monte Carlo analysis. Used by major foundations and market makers for launch strategy and risk assessment.",
    features: [
      "Uniswap V2 AMM price discovery mechanics",
      "Agent-based modeling with behavioral archetypes",
      "Enhanced Market Maker (EMM) operations",
      "Monte Carlo analysis (10-10,000 runs)",
      "4-phase market lifecycle modeling"
    ],
    techStack: ["Python", "Streamlit", "Mesa", "NumPy", "Pandas", "Plotly"],
    techStackDisplay: "Python, Streamlit, Mesa, NumPy, Pandas, Plotly",
    status: "production" as const,
    category: "systems",
    role: "built",
    visibility: "proprietary",
    metrics: [
      "Modeled $500M+ in token economies",
      "Used by 10+ major foundations and market makers",
      "100,000+ Monte Carlo simulations completed"
    ]
  },

  // 8. Kinsu Savings App
  {
    id: "kinsu-savings",
    name: "Kinsu Savings App",
    filename: "kinsu-savings",
    description: "DeFi savings aggregator built on ConsumerFi protocol",
    overview: "Led the product vision and execution for a consumer-friendly DeFi savings application. Architected the system design and coordinated cross-functional teams from concept to launch.",
    features: [
      "Automated yield optimization",
      "Multi-chain portfolio management",
      "Risk assessment dashboard",
      "One-click diversification strategies",
      "Mobile-first responsive design"
    ],
    techStack: ["React", "Web3.js", "Solidity", "The Graph", "Node.js"],
    techStackDisplay: "React, Web3.js, Solidity, The Graph, Node.js",
    demo: "https://kinsu.fi",
    status: "production" as const,
    category: "product",
    role: "led",
    visibility: "proprietary",
    metrics: [
      "$10M+ TVL at peak",
      "5,000+ active users",
      "4.8/5 user satisfaction score"
    ]
  },

  // 9. Play-to-Airdrop Campaign System
  {
    id: "play-to-airdrop",
    name: "Play-to-Airdrop Campaign System",
    filename: "play-to-airdrop",
    description: "Gamified user acquisition and retention platform",
    overview: "Designed and led the development of a gamified campaign system that increased protocol engagement through quest-based rewards and social mechanics.",
    features: [
      "Dynamic quest generation",
      "Social referral tracking",
      "Anti-sybil protection",
      "Real-time leaderboards",
      "Automated reward distribution"
    ],
    techStack: ["TypeScript", "Next.js", "PostgreSQL", "Redis", "Chainlink"],
    techStackDisplay: "TypeScript, Next.js, PostgreSQL, Redis, Chainlink",
    status: "production" as const,
    category: "product",
    role: "architected",
    visibility: "proprietary",
    metrics: [
      "50K+ participants",
      "3x increase in protocol TVL",
      "85% user retention after 30 days"
    ]
  },

  // 10. Home Lab Infrastructure
  {
    id: "home-lab-infrastructure",
    name: "Home Lab Network",
    filename: "home-lab-network",
    description: "Enterprise-grade home lab with GPU cluster and automation",
    overview: "Designed and deployed a sophisticated home lab infrastructure featuring multiple servers, VLAN segmentation, GPU compute cluster, and comprehensive automation.",
    features: [
      "Proxmox virtualization cluster",
      "VLAN-segmented security zones",
      "4-node GPU compute cluster",
      "Automated backup pipelines",
      "Self-hosted AI inference endpoints"
    ],
    techStack: ["Proxmox", "pfSense", "Kubernetes", "Ansible", "TrueNAS"],
    techStackDisplay: "Proxmox, pfSense, Kubernetes, Ansible, TrueNAS",
    videoUrl: "https://youtube.com/watch?v=example2",
    blogUrl: "/blog/home-lab-setup",
    status: "production" as const,
    category: "experimental",
    role: "built",
    visibility: "proprietary",
    metrics: [
      "99.99% uptime",
      "50TB storage capacity",
      "100+ containers running"
    ]
  }
];