// Project configurations with open source projects prioritized
export const projectsData = [
  // === OPEN SOURCE PROJECTS (GitHub Available) ===

  // 1. Peak AI Agent Stack
  {
    id: "peak-ai-agent-stack",
    name: "Peak AI Agent Stack",
    filename: "peak-ai-agent-stack",
    description: "Multi-agent AI orchestration framework for complex workflows",
    overview: "Production-ready framework for orchestrating multiple AI agents with advanced state management, task routing, and error recovery. Built to handle complex, multi-step workflows with automatic fallbacks and parallel execution.",
    features: [
      "Dynamic agent orchestration with dependency resolution",
      "Built-in state persistence and recovery",
      "Parallel task execution with resource management",
      "Comprehensive error handling and retry logic",
      "Real-time monitoring and observability"
    ],
    techStack: ["Python", "LangChain", "Redis", "FastAPI", "PostgreSQL"],
    techStackDisplay: "Python, LangChain, Redis, FastAPI, PostgreSQL",
    github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_HANDLE || 'dleerdefi'}/peak-ai-agent-stack`,
    status: "production",
    category: "systems",
    role: "built",
    visibility: "open-source",
    metrics: [
      "Powers 10+ production AI applications",
      "Handles 100K+ agent interactions daily",
      "99.9% uptime in production"
    ]
  },

  // 2. LLM Security Auditor
  {
    id: "llm-security-auditor",
    name: "LLM Security Auditor",
    filename: "llm-security-auditor",
    description: "Automated security analysis tool for LLM applications",
    overview: "Comprehensive security testing framework specifically designed for LLM-powered applications. Identifies vulnerabilities, prompt injection risks, and data leakage issues.",
    features: [
      "Automated prompt injection testing",
      "Data exfiltration detection",
      "Model behavior analysis",
      "Compliance checking (GDPR, CCPA)",
      "Detailed vulnerability reporting"
    ],
    techStack: ["Python", "LangChain", "OWASP ZAP", "Burp Suite API"],
    techStackDisplay: "Python, LangChain, OWASP ZAP, Burp Suite API",
    github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_HANDLE || 'dleerdefi'}/llm-security-auditor`,
    status: "production",
    category: "systems",
    role: "built",
    visibility: "open-source",
    metrics: [
      "Identified 50+ critical vulnerabilities",
      "Used by 20+ AI companies",
      "Reduced security review time by 80%"
    ]
  },

  // 3. Agent State Machine
  {
    id: "agent-state-machine",
    name: "Agent State Machine",
    filename: "agent-state-machine",
    description: "Finite state machine framework for AI agent behavior",
    overview: "Lightweight framework for managing complex AI agent behaviors using finite state machines. Provides visual debugging tools and behavior tree integration.",
    features: [
      "Visual state machine editor",
      "Behavior tree integration",
      "Real-time state debugging",
      "Plugin architecture",
      "Performance monitoring"
    ],
    techStack: ["TypeScript", "React", "D3.js", "Node.js"],
    techStackDisplay: "TypeScript, React, D3.js, Node.js",
    github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_HANDLE || 'dleerdefi'}/agent-state-machine`,
    demo: "https://agent-fsm-demo.vercel.app",
    status: "production",
    category: "experimental",
    role: "built",
    visibility: "open-source",
    metrics: [
      "Used in 50+ AI projects",
      "500+ GitHub stars",
      "Active community of 100+ developers"
    ]
  },

  // 4. RinAI Multimodal VTuber
  {
    id: "rinai-multimodal-vtuber",
    name: "RinAI Multimodal VTuber",
    filename: "rinai-multimodal-vtuber",
    description: "Real-time AI-powered virtual avatar with multimodal interaction",
    overview: "Experimental project combining computer vision, NLP, and real-time rendering to create an interactive AI VTuber. Features emotion recognition, gesture control, and dynamic responses.",
    features: [
      "Real-time facial tracking and mapping",
      "Voice synthesis with emotion",
      "Gesture recognition and response",
      "Live streaming integration",
      "Custom avatar rendering pipeline"
    ],
    techStack: ["Python", "PyTorch", "OpenCV", "Unity", "WebRTC"],
    techStackDisplay: "Python, PyTorch, OpenCV, Unity, WebRTC",
    github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_HANDLE || 'dleerdefi'}/rinai-multimodal-vtuber`,
    videoUrl: "https://youtube.com/watch?v=example1",
    status: "development",
    category: "experimental",
    role: "built",
    visibility: "open-source",
    metrics: [
      "10ms motion capture latency",
      "95% emotion detection accuracy",
      "1000+ GitHub stars"
    ]
  },

  // 5. Rin Streams
  {
    id: "rin-streams",
    name: "Rin Streams",
    filename: "rin-streams",
    description: "Streaming infrastructure for AI-powered content generation",
    overview: "Real-time streaming platform that combines AI content generation with live broadcasting. Features automatic scene switching, chat interaction, and content moderation.",
    features: [
      "AI-driven content generation",
      "Automatic scene management",
      "Chat sentiment analysis",
      "Real-time content moderation",
      "Multi-platform streaming"
    ],
    techStack: ["Node.js", "FFmpeg", "OBS WebSocket", "TensorFlow.js"],
    techStackDisplay: "Node.js, FFmpeg, OBS WebSocket, TensorFlow.js",
    github: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_HANDLE || 'dleerdefi'}/rin-streams`,
    status: "development",
    category: "experimental",
    role: "built",
    visibility: "open-source",
    metrics: [
      "24/7 autonomous streaming",
      "1000+ concurrent viewers",
      "90% positive engagement rate"
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
    status: "production",
    category: "systems",
    role: "built",
    visibility: "proprietary",
    metrics: [
      "Processed 2M+ transactions daily",
      "Analyzed 30K+ user accounts",
      "Sub-100ms scoring latency"
    ]
  },

  // 7. Token Economy Simulator
  {
    id: "token-economy-simulator",
    name: "Token Economy Simulator",
    filename: "token-economy-simulator",
    description: "Agent-based simulator for token economy modeling",
    overview: "Sophisticated simulation framework that models complex token economies using agent-based modeling. Used by major foundations and market makers for strategic planning.",
    features: [
      "Agent-based market simulation",
      "Monte Carlo scenario analysis",
      "Liquidity pool dynamics modeling",
      "Governance token distribution optimization",
      "Visual analytics dashboard"
    ],
    techStack: ["Python", "NumPy", "Pandas", "Mesa", "Plotly"],
    techStackDisplay: "Python, NumPy, Pandas, Mesa, Plotly",
    status: "production",
    category: "systems",
    role: "built",
    visibility: "proprietary",
    metrics: [
      "Modeled $300M+ in token economies",
      "Used by 5 major crypto foundations",
      "10,000+ simulation runs completed"
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
    status: "production",
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
    status: "production",
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
    status: "production",
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