// Synapse AI — Central Data Registry
// Maps 9 Core AI Domains: Overall, Agentic AI, Models, Companies, AI Security, Fellowships, Military, Governance, Multilateral

const DOMAIN_CATEGORIES = {
  overall: {
    label: 'Overall AI Field',
    icon: '🌌',
    color: '#F2B155', // Amber
    colorDim: '#6B4E28',
    description: 'Macro trends, fundamental paradigm shifts, and field-wide breakthroughs.'
  },
  agentic_ai: {
    label: 'Agentic AI Domain',
    icon: '🤖',
    color: '#C77DD9', // Neon Purple
    colorDim: '#5B3068',
    description: 'Autonomous agents, tool-use systems, reasoning loops, multi-agent swarms.'
  },
  models: {
    label: 'Model Releases & Updates',
    icon: '🧠',
    color: '#6FC2E0', // Cyan Blue
    colorDim: '#215368',
    description: 'Frontier foundation models, weights releases, architecture updates, fine-tunes.'
  },
  companies: {
    label: 'Major AI Companies & Compute',
    icon: '🏢',
    color: '#4FA3A0', // Teal
    colorDim: '#1F4745',
    description: 'Meta, Anthropic, OpenAI, Perplexity, DeepSeek, Google, NVIDIA, xAI updates.'
  },
  security: {
    label: 'AI Security & Safety',
    icon: '🛡️',
    color: '#E1614B', // Red Signal
    colorDim: '#68251B',
    description: 'Cybersecurity, model robustness, red-teaming, alignment, jailbreaks, watermarking.'
  },
  fellowships: {
    label: 'Fellowships & Talent',
    icon: '🎓',
    color: '#F7C59F', // Peach Gold
    colorDim: '#6E4E36',
    description: 'Research residencies, talent grants, lab fellowships, academic-industry grants.'
  },
  military: {
    label: 'Military & Defense AI',
    icon: '⚔️',
    color: '#E63946', // Crimson Defense
    colorDim: '#69181E',
    description: 'Autonomous defense systems, strategic sovereignty, NATO/Pentagon contracts.'
  },
  governance: {
    label: 'AI Governance & Policy',
    icon: '🏛️',
    color: '#8E9EDB', // Indigo Policy
    colorDim: '#3B4468',
    description: 'EU AI Act, national safety institutes (US/UK AISI), legal IP & liability rulings.'
  },
  multilateral: {
    label: 'Multilateral & UN Forums',
    icon: '🌐',
    color: '#A6C36F', // Lime Global
    colorDim: '#46562C',
    description: 'UN AI Advisory Body, G7/G20 summits, Bletchley/Seoul/Paris AI Safety Summits, GPAI.'
  }
};

const SYNAPSE_DATA = {
  nodes: [
    // ----------------------------------------------------
    // OVERALL AI FIELD
    // ----------------------------------------------------
    {
      id: 'transformer-scaling-limits',
      title: 'Post-Scaling Paradigm: Test-Time Compute Shift',
      category: 'overall',
      date: '2025-01-15',
      impact: 'CRITICAL',
      company: 'Global Consensus',
      tldr: 'Shift from pure pre-training compute scaling to inference-time reasoning scaling across frontier models.',
      specs: { focus: 'Inference Scaling', impactScore: '9.8/10', velocity: '+85%' },
      tags: ['#TestTimeCompute', '#Reasoning', '#ScalingLaws', '#PostPretraining'],
      sourceUrl: 'https://arxiv.org/abs/2412.00000',
      details: 'Researchers across OpenAI, DeepSeek, and Anthropic verified that allocating compute to test-time search and step-by-step verification yields exponential accuracy gains.'
    },
    {
      id: 'multimodal-native-embs',
      title: 'Any-to-Any Unified Multimodal Processing',
      category: 'overall',
      date: '2025-06-10',
      impact: 'HIGH',
      company: 'Google DeepMind & Meta',
      tldr: 'Foundation architectures processing text, audio, vision, and action tokens natively in unified latent spaces.',
      specs: { modality: 'Text/Audio/Video/Sensory', latency: '<100ms', accuracy: '94.2%' },
      tags: ['#Multimodal', '#UnifiedLatent', '#VisionLanguageAudio'],
      sourceUrl: 'https://ai.google/research/',
      details: 'Native multimodal models eliminate tokenization bottlenecks between visual features and spatial audio generation.'
    },
    {
      id: 'quantum-ai-hybrid',
      title: 'Quantum-Classical Hybrid Machine Learning Benchmarks',
      category: 'overall',
      date: '2026-03-01',
      impact: 'MODERATE',
      company: 'IBM & Google Quantum',
      tldr: 'First empirical demonstration of QPU-accelerated tensor network contraction for deep learning training.',
      specs: { qpus: '128 Qubits', speedup: '14.2x', domain: 'Drug Discovery' },
      tags: ['#QuantumAI', '#TensorNetworks', '#QPU'],
      sourceUrl: 'https://research.ibm.com/quantum',
      details: 'Demonstrates hybrid workflows where quantum coprocessors compute high-dimensional latent space embeddings.'
    },

    // ----------------------------------------------------
    // AGENTIC AI DOMAIN
    // ----------------------------------------------------
    {
      id: 'claude-computer-use',
      title: 'Anthropic Computer Use & GUI Navigation',
      category: 'agentic_ai',
      date: '2024-10-22',
      impact: 'CRITICAL',
      company: 'Anthropic',
      tldr: 'Direct desktop GUI interaction, keystroke automation, and web application navigation via visual perception.',
      specs: { benchmark: 'OSWorld 22.0%', visualFreq: '2Hz', toolIntegration: 'Native Desktop' },
      tags: ['#Anthropic', '#ComputerUse', '#GUI-Agents', '#OSWorld'],
      sourceUrl: 'https://www.anthropic.com/news/3-5-models-and-computer-use',
      details: 'Enables AI agents to perceive pixel coordinates, execute keystrokes, and operate complex desktop CAD/IDE software.'
    },
    {
      id: 'autogen-v04',
      title: 'Microsoft AutoGen 0.4 Multi-Agent Orchestration Framework',
      category: 'agentic_ai',
      date: '2025-02-05',
      impact: 'HIGH',
      company: 'Microsoft Research',
      tldr: 'Event-driven, asynchronous multi-agent architecture with streaming communication and distributed agent state.',
      specs: { protocol: 'gRPC / Event-Driven', scalability: '10,000+ Agents', language: 'Python/C#' },
      tags: ['#Microsoft', '#AutoGen', '#MultiAgent', '#SwarmIntelligence'],
      sourceUrl: 'https://microsoft.github.io/autogen/',
      details: 'Redesigned framework providing strict type safety, state persistence, and distributed multi-agent swarm coordination.'
    },
    {
      id: 'operator-openai',
      title: 'OpenAI Operator & Autonomous Browser Agent',
      category: 'agentic_ai',
      date: '2025-01-23',
      impact: 'CRITICAL',
      company: 'OpenAI',
      tldr: 'Autonomous web agent capable of complex workflow execution, purchasing, form-filling, and multi-step research.',
      specs: { engine: 'CUA Vision', taskCompletion: '87.4%', sandboxing: 'Isolated VM' },
      tags: ['#OpenAI', '#Operator', '#WebAgent', '#BrowserAutomation'],
      sourceUrl: 'https://openai.com/index/operator',
      details: 'Deploys browser-native agentic routines inside sandboxed containerized virtual machines for secure user task execution.'
    },
    {
      id: 'agentic-swe-bench-pro',
      title: 'SWE-bench Pro: Autonomous Coding Benchmark Breakthrough',
      category: 'agentic_ai',
      date: '2025-11-18',
      impact: 'HIGH',
      company: 'Princeton & Cognition',
      tldr: 'Autonomous software engineering agents solving multi-repository pull requests at over 72% resolution rate.',
      specs: { passRate: '72.4%', testCases: '5,000 PRs', contextDepth: '100K LOC' },
      tags: ['#SWEbench', '#DevAgents', '#AutonomousCoding', '#Cognition'],
      sourceUrl: 'https://www.swebench.com/',
      details: 'Evaluates real-world software engineering capabilities across complex multi-file codebase refactoring and debugging.'
    },
    {
      id: 'swarms-framework-v2',
      title: 'Open-Source Hierarchical Swarm Intelligence Frameworks',
      category: 'agentic_ai',
      date: '2026-04-12',
      impact: 'MODERATE',
      company: 'OpenSource Community',
      tldr: 'Hierarchical manager-worker agent topologies with dynamic memory pruning and peer consensus protocols.',
      specs: { consensus: 'Raft-based Agent Sync', memoryPruning: 'Vector-KV', license: 'MIT' },
      tags: ['#Swarms', '#OpenSource', '#MultiAgent', '#DecentralizedAI'],
      sourceUrl: 'https://github.com',
      details: 'Enables open-source developer communities to spin up federated agent networks with specialized sub-agent subroutines.'
    },

    // ----------------------------------------------------
    // MODEL RELEASES & UPDATES
    // ----------------------------------------------------
    {
      id: 'deepseek-r1',
      title: 'DeepSeek-R1 Open Reasoning Model Weights Release',
      category: 'models',
      date: '2025-01-20',
      impact: 'CRITICAL',
      company: 'DeepSeek',
      tldr: 'Open-weights reasoning model using pure reinforcement learning without supervised fine-tuning, matching GPT-4o.',
      specs: { architecture: 'MoE (671B / 37B active)', benchmark: 'AIME 79.8%', license: 'MIT Open Weights' },
      tags: ['#DeepSeek', '#DeepSeekR1', '#OpenWeights', '#Reasoning', '#ReinforcementLearning'],
      sourceUrl: 'https://github.com/deepseek-ai/DeepSeek-R1',
      details: 'Triggered global disruption by proving high-level mathematical reasoning models can be trained at a fraction of Western frontier cluster costs.'
    },
    {
      id: 'claude-3-7-sonnet',
      title: 'Anthropic Claude 3.7 Sonnet Hybrid Reasoning Model',
      category: 'models',
      date: '2025-02-24',
      impact: 'CRITICAL',
      company: 'Anthropic',
      tldr: 'First hybrid model allowing seamless toggle between instantaneous response mode and deep extended reasoning tokens.',
      specs: { maxThinkingTokens: '128,000', sweBench: '70.3%', arenaElo: '1385' },
      tags: ['#Anthropic', '#Claude37', '#ExtendedThinking', '#HybridReasoning', '#Sonnet'],
      sourceUrl: 'https://www.anthropic.com/news/claude-3-7-sonnet',
      details: 'Allows developers to explicitly dial exact budget for thinking tokens, optimizing compute for hard code vs simple queries.'
    },
    {
      id: 'gpt-4o-realtime',
      title: 'OpenAI GPT-4o Realtime Audio & Vision Speech-to-Speech',
      category: 'models',
      date: '2024-10-01',
      impact: 'HIGH',
      company: 'OpenAI',
      tldr: 'Native low-latency speech-to-speech audio API with visual emotion synthesis and interruptible conversational flow.',
      specs: { latency: '232ms', modality: 'Native Audio/Text/Vision', api: 'WebRTC WebSocket' },
      tags: ['#OpenAI', '#GPT4o', '#RealtimeAPI', '#AudioAI', '#SpeechToSpeech'],
      sourceUrl: 'https://openai.com/index/introducing-the-realtime-api',
      details: 'Eliminates pipeline cascade delay by processing raw audio waveforms directly within the transformer network.'
    },
    {
      id: 'llama-4-scout',
      title: 'Meta Llama 4 Open Foundation Model Suite',
      category: 'models',
      date: '2025-04-10',
      impact: 'CRITICAL',
      company: 'Meta',
      tldr: 'Meta releases multi-modal Llama 4 models with native mixture-of-experts and 1M token context windows.',
      specs: { parameters: '400B MoE', context: '1,000,000 tokens', license: 'Meta Community License' },
      tags: ['#Meta', '#Llama4', '#OpenSource', '#MoE', '#ZuckAI'],
      sourceUrl: 'https://ai.meta.com/llama/',
      details: 'Trained on over 30 trillion tokens using Meta’s 100,000 H100 cluster topology.'
    },
    {
      id: 'gemini-2-5-pro',
      title: 'Google Gemini 2.5 Pro Deep Reasoning & Multimodal Flash',
      category: 'models',
      date: '2025-05-18',
      impact: 'HIGH',
      company: 'Google DeepMind',
      tldr: '2 million token context length model integrating native code execution sandbox and real-time video understanding.',
      specs: { contextWindow: '2,000,000 tokens', videoRate: '60 FPS Native', mathBench: '88.1%' },
      tags: ['#Google', '#Gemini25', '#DeepMind', '#LongContext', '#VideoReasoning'],
      sourceUrl: 'https://deepmind.google/technologies/gemini/',
      details: 'Features native integration with Google Workspace, Android OS systems, and Google Cloud Vertex AI infrastructure.'
    },
    {
      id: 'mistral-large-3',
      title: 'Mistral Large 3 European Frontier Weights',
      category: 'models',
      date: '2025-07-22',
      impact: 'HIGH',
      company: 'Mistral AI',
      tldr: 'State-of-the-art multilingual model tailored for European languages, legal compliance, and local deployment.',
      specs: { languages: '32 European', parameterCount: '123B Dense', speed: '140 tok/s' },
      tags: ['#Mistral', '#EuropeanAI', '#Multilingual', '#OpenWeights'],
      sourceUrl: 'https://mistral.ai/',
      details: 'Offers full Apache 2.0 open weight distributions for edge and sovereign European cloud data centers.'
    },
    {
      id: 'grok-3-xai',
      title: 'xAI Grok-3 100K GPU Memphis Supercluster Model',
      category: 'models',
      date: '2025-02-17',
      impact: 'CRITICAL',
      company: 'xAI',
      tldr: 'Frontier model trained on the Colossus 100,000 Liquid-Cooled H100 Supercluster, claiming top math benchmarks.',
      specs: { computeCluster: '100k H100 Colossus', mathPassRate: '92.4%', searchIntegration: 'Realtime X Feed' },
      tags: ['#xAI', '#Grok3', '#Colossus', '#MemphisCluster', '#ElonMusk'],
      sourceUrl: 'https://x.ai/',
      details: 'Built in record time in Memphis, Tennessee, leveraging direct power infrastructure for massive cluster scaling.'
    },

    // ----------------------------------------------------
    // MAJOR AI COMPANIES & COMPUTE
    // ----------------------------------------------------
    {
      id: 'nvidia-blackwell-b200',
      title: 'NVIDIA Blackwell B200 Compute Architecture Shipments',
      category: 'companies',
      date: '2024-12-01',
      impact: 'CRITICAL',
      company: 'NVIDIA',
      tldr: '208-billion transistor dual-die GPU delivering 20 petaflops of FP4 inference compute for frontier model scale.',
      specs: { transistors: '208 Billion', interconnect: '1.8TB/s NVLink', fp4Inference: '20 PFLOPS' },
      tags: ['#NVIDIA', '#Blackwell', '#B200', '#GPU Compute', '#JensenHuang'],
      sourceUrl: 'https://www.nvidia.com/en-us/data-center/blackwell-architecture/',
      details: 'Mass shipment to Microsoft Azure, AWS, Google Cloud, Meta, and Oracle for next-gen 100k+ GPU datacenter clusters.'
    },
    {
      id: 'perplexity-finance-funding',
      title: 'Perplexity AI Search Valuation Surges to $18B',
      category: 'companies',
      date: '2025-03-14',
      impact: 'HIGH',
      company: 'Perplexity AI',
      tldr: 'Perplexity expands conversational search engines into automated deep research engines and financial analytics.',
      specs: { queriesPerMonth: '500M+', valuation: '$18 Billion', product: 'Deep Research Engine' },
      tags: ['#Perplexity', '#AISearch', '#VentureCapital', '#DeepResearch'],
      sourceUrl: 'https://www.perplexity.ai/',
      details: 'Pioneers live citation-backed conversational search and deep multi-source research report synthesizers.'
    },
    {
      id: 'openai-stargate-supercomputer',
      title: 'Project Stargate: $100 Billion AI Data Center Infrastructure',
      category: 'companies',
      date: '2025-01-08',
      impact: 'CRITICAL',
      company: 'OpenAI & SoftBank / Oracle',
      tldr: 'Multi-gigawatt nuclear and renewable powered datacenter initiative aiming for 500,000+ AI accelerators.',
      specs: { powerCapacity: '5 Gigawatts', budget: '$100 Billion', location: 'United States' },
      tags: ['#OpenAI', '#Stargate', '#SoftBank', '#NuclearAI', '#DataCenter'],
      sourceUrl: 'https://openai.com/',
      details: 'Landmark compute infrastructure deal securing nuclear power purchase agreements for exascale AI model training.'
    },
    {
      id: 'anthropic-amazon-investment',
      title: 'Amazon Completes Additional $4B Investment in Anthropic',
      category: 'companies',
      date: '2024-11-22',
      impact: 'HIGH',
      company: 'Anthropic & Amazon AWS',
      tldr: 'Anthropic names AWS as primary cloud training partner, leveraging custom AWS Trainium chips for Claude updates.',
      specs: { totalInvestment: '$8 Billion', silicon: 'AWS Trainium 2', cloud: 'Amazon AWS' },
      tags: ['#Anthropic', '#Amazon', '#AWS', '#Trainium', '#CloudCompute'],
      sourceUrl: 'https://www.anthropic.com/',
      details: 'Solidifies multi-cloud partnership while optimizing Claude model architectures directly on AWS Trainium hardware.'
    },
    {
      id: 'meta-fair-10yr-anniversary',
      title: 'Meta FAIR Lab 10-Year Expansion & Open Science Push',
      category: 'companies',
      date: '2024-12-10',
      impact: 'MODERATE',
      company: 'Meta',
      tldr: 'Yann LeCun outlines vision for World Models, self-supervised learning, and non-autoregressive architectures.',
      specs: { lab: 'FAIR', focus: 'JEPA / World Models', lead: 'Yann LeCun' },
      tags: ['#Meta', '#FAIR', '#YannLeCun', '#WorldModels', '#OpenScience'],
      sourceUrl: 'https://ai.meta.com/research/',
      details: 'Reaffirms commitment to open source AI research despite industry pressures towards closed API monetization.'
    },
    {
      id: 'google-tpu-v6-trillium',
      title: 'Google Custom Silicon: TPU v6 Trillium Deployment',
      category: 'companies',
      date: '2025-02-01',
      impact: 'HIGH',
      company: 'Google Cloud',
      tldr: 'Google rolls out TPU v6 Trillium offering 4.7x performance improvement per watt over TPU v5e.',
      specs: { energyEfficiency: '4.7x per Watt', interconnect: 'ICI 3.2Tbps', deployment: 'Google Cloud Vertex' },
      tags: ['#Google', '#TPU', '#Trillium', '#CustomSilicon', '#CloudInfrastructure'],
      sourceUrl: 'https://cloud.google.com/tpu',
      details: 'Powers Google DeepMind’s internal Gemini training runs while providing enterprise alternative to GPU shortages.'
    },

    // ----------------------------------------------------
    // AI SECURITY & SAFETY
    // ----------------------------------------------------
    {
      id: 'cve-llm-prompt-injection',
      title: 'Indirect Prompt Injection Standardized Threat Matrix (CVE-AI)',
      category: 'security',
      date: '2025-01-30',
      impact: 'CRITICAL',
      company: 'OWASP & US CISA',
      tldr: 'Official taxonomy classification for indirect prompt injections, autonomous agent exfiltration, and tool hijacking.',
      specs: { framework: 'OWASP Top 10 LLM v2.0', vulnerabilityClass: 'Indirect Injection', threatLevel: 'Severe' },
      tags: ['#AISecurity', '#OWASP', '#PromptInjection', '#Cybersecurity', '#CISA'],
      sourceUrl: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
      details: 'Catalogues vector attack vectors where malicious payloads hidden in PDF docs or web content hijack agentic web browsers.'
    },
    {
      id: 'deep-jailbreak-evals',
      title: 'Automated Red-Teaming & Representation Engineering',
      category: 'security',
      date: '2025-04-18',
      impact: 'HIGH',
      company: 'Center for AI Safety & Anthropic',
      tldr: 'Steering vector techniques used to detect and clamp hidden internal representation states linked to harmful outputs.',
      specs: { method: 'Activation Addition / Clamping', defenseRate: '96.2%', latencyOverhead: '<3%' },
      tags: ['#AISafety', '#RedTeaming', '#SteeringVectors', '#RepresentationEngineering'],
      sourceUrl: 'https://www.safe.ai/',
      details: 'Demonstrates real-time neural layer monitoring to intercept safety violations before output token generation.'
    },
    {
      id: 'watermarking-synth-media',
      title: 'SynthID & C2PA Synthetic Content Provenance Mandates',
      category: 'security',
      date: '2024-11-15',
      impact: 'HIGH',
      company: 'Coalition for Content Provenance (C2PA)',
      tldr: 'Cryptographic metadata watermarking standard adopted across major visual, audio, and text generation platforms.',
      specs: { standard: 'C2PA 2.1 / SynthID', tamperProof: 'Cryptographic Signature', coverage: 'Images/Video/Audio' },
      tags: ['#Watermarking', '#C2PA', '#SynthID', '#DeepfakeDefense', '#Provenance'],
      sourceUrl: 'https://c2pa.org/',
      details: 'Protects visual media integrity by embedding imperceptible, cryptographically signed provenance metadata.'
    },
    {
      id: 'model-weight-theft-zero-day',
      title: 'Frontier Model Weight Exfiltration & Countermeasures',
      category: 'security',
      date: '2025-08-05',
      impact: 'CRITICAL',
      company: 'US AISI & Defense Cyber Command',
      tldr: 'Guidelines requiring air-gapped HSM key storage and biometric verification for model checkpoint downloads.',
      specs: { protocol: 'SLSA Level 4', threatActor: 'State-Sponsored', requirement: 'HSM Encrypted Checkpoints' },
      tags: ['#WeightSecurity', '#Exfiltration', '#AISI', '#CyberDefense', '#AirGap'],
      sourceUrl: 'https://www.nist.gov/aisi',
      details: 'Responds to sophisticated state-sponsored cyber espionage attempts directed at Western AI frontier cluster storage.'
    },

    // ----------------------------------------------------
    // FELLOWSHIPS, GRANTS & TALENT
    // ----------------------------------------------------
    {
      id: 'openai-residency-2025',
      title: 'OpenAI Research Residency 2025 Cohort Expansion',
      category: 'fellowships',
      date: '2024-10-15',
      impact: 'HIGH',
      company: 'OpenAI',
      tldr: '6-month transition program for exceptional mathematicians, physicists, and computer scientists into frontier AI research.',
      specs: { stipend: '$210,000 + Equity', duration: '6 Months', location: 'San Francisco, CA' },
      tags: ['#OpenAI', '#Residency', '#Talent', '#Fellowship', '#CareerSwitch'],
      sourceUrl: 'https://openai.com/careers/residency',
      details: 'Provides direct access to 10k+ GPU cluster allocations and mentorship from core GPT-4 and Operator architects.'
    },
    {
      id: 'anthropic-fellows-program',
      title: 'Anthropic AI Safety & Alignment Fellowship',
      category: 'fellowships',
      date: '2025-02-10',
      impact: 'HIGH',
      company: 'Anthropic & Alignment Research Center',
      tldr: 'Fully funded 1-year research fellowship targeting Mechanistic Interpretability, Scalable Oversight, and Evals.',
      specs: { grantAmount: '$180,000', computeGrant: '100,000 H100 Hours', track: 'Interpretability & Safety' },
      tags: ['#Anthropic', '#AISafety', '#Fellowship', '#Interpretability', '#Alignment'],
      sourceUrl: 'https://www.anthropic.com/fellowship',
      details: 'Supports postdocs and PhD researchers conducting fundamental mechanistic interpretability experiments on Claude models.'
    },
    {
      id: 'schmidt-futures-ai-postdoc',
      title: 'Schmidt Sciences AI 2050 Senior & Early Career Fellows',
      category: 'fellowships',
      date: '2025-01-12',
      impact: 'MODERATE',
      company: 'Schmidt Sciences',
      tldr: '$125M global fellowship initiative funding interdisciplinary researchers solving hard open problems in AI.',
      specs: { totalFund: '$125 Million', fellowsCount: '50+ Global Scientists', tenure: '2-5 Years' },
      tags: ['#SchmidtSciences', '#AI2050', '#Grants', '#AcademicFunding', '#Interdisciplinary'],
      sourceUrl: 'https://ai2050.schmidtsciences.org/',
      details: 'Awards unrestricted grants to researchers exploring non-traditional AI architectures, ethics, and economic impact.'
    },
    {
      id: 'meta-ai-phd-fellowship',
      title: 'Meta AI Global PhD Research Fellowship Grants',
      category: 'fellowships',
      date: '2025-03-25',
      impact: 'MODERATE',
      company: 'Meta Research',
      tldr: 'Covers 2 full years of tuition and fees plus $42,000 annual stipend for PhD students in computer vision & NLP.',
      specs: { support: 'Tuition + $42k Stipend', duration: '2 Years', network: 'FAIR Mentorship' },
      tags: ['#Meta', '#PhDFellowship', '#ComputerVision', '#NLP', '#AcademicGrant'],
      sourceUrl: 'https://research.facebook.com/fellowship/',
      details: 'Supports promising doctoral students around the globe while connecting them directly with FAIR lab scientists.'
    },

    // ----------------------------------------------------
    // MILITARY & DEFENSE AI
    // ----------------------------------------------------
    {
      id: 'anduril-lattice-autonomous-defense',
      title: 'Anduril Lattice OS & Autonomous Swarm Air Defense',
      category: 'military',
      date: '2025-02-28',
      impact: 'CRITICAL',
      company: 'Anduril Industries & US DoD',
      tldr: 'Autonomous counter-drone command mesh leveraging edge AI telemetry and real-time computer vision threat classification.',
      specs: { platform: 'Lattice OS', latency: '<10ms Target Lock', deployment: 'US & NATO Defense' },
      tags: ['#DefenseAI', '#Anduril', '#LatticeOS', '#AutonomousSwarm', '#Pentagon'],
      sourceUrl: 'https://www.anduril.com/',
      details: 'Integrates heterogeneous radar, acoustic sensors, and autonomous interceptor drones under unified sensor fusion.'
    },
    {
      id: 'palantir-aip-military-contracts',
      title: 'Palantir AIP Selected for Pentagon Maven Smart System',
      category: 'military',
      date: '2024-11-08',
      impact: 'HIGH',
      company: 'Palantir Technologies & US Army',
      tldr: '$480M contract extension deploying Artificial Intelligence Platform (AIP) for tactical battlefield awareness.',
      specs: { contractValue: '$480 Million', program: 'Project Maven', securityClearance: 'IL6 Classified' },
      tags: ['#Palantir', '#ProjectMaven', '#TacticalAI', '#Pentagon', '#AIP'],
      sourceUrl: 'https://www.palantir.com/platforms/aip/',
      details: 'Allows field commanders to query battle space data using natural language LLMs running inside secure enclaves.'
    },
    {
      id: 'nato-diana-defense-incubator',
      title: 'NATO DIANA Deep Tech & Autonomous Systems Accelerator',
      category: 'military',
      date: '2025-05-14',
      impact: 'HIGH',
      company: 'NATO DIANA',
      tldr: 'NATO selects 25 AI defense startups for maritime security, resilient communications, and autonomous navigation.',
      specs: { budget: '€50 Million', cohort: '25 Defense Startups', region: 'Alliance-wide' },
      tags: ['#NATO', '#DIANA', '#DefenseTech', '#AutonomousNavigation', '#Sovereignty'],
      sourceUrl: 'https://www.diana.nato.int/',
      details: 'Accelerates dual-use technology adoption across 32 NATO member nations with test centers in Europe and North America.'
    },
    {
      id: 'us-dod-responsible-ai-directive',
      title: 'US Department of Defense Directive 3000.09 Updates',
      category: 'military',
      date: '2025-07-01',
      impact: 'HIGH',
      company: 'US Department of Defense',
      tldr: 'Mandates senior official sign-off and strict human-in-the-loop controls before lethal autonomous weapon design.',
      specs: { directive: 'DoD 3000.09', requirement: 'Human-in-the-Loop', scope: 'Autonomous Weapons' },
      tags: ['#DoD', '#DefensePolicy', '#AutonomousWeapons', '#EthicalMilitaryAI'],
      sourceUrl: 'https://www.defense.gov/',
      details: 'Establishes rigid testing, safety evaluation, and chain-of-command accountability standards for weaponized AI systems.'
    },

    // ----------------------------------------------------
    // AI GOVERNANCE & REGULATION
    // ----------------------------------------------------
    {
      id: 'eu-ai-act-enforcement-phase1',
      title: 'EU AI Act First Enforcement Phase: Prohibited Practices',
      category: 'governance',
      date: '2025-02-02',
      impact: 'CRITICAL',
      company: 'European Union AI Office',
      tldr: 'Bans untargeted scraping of facial images, biometric categorization, and social scoring systems across the 27 EU member states.',
      specs: { jurisdiction: '27 EU Nations', fineMax: '€35M or 7% Global Turnover', phase: 'Phase 1 Enforcement' },
      tags: ['#EUAIAct', '#Governance', '#Regulation', '#BiometricBan', '#Compliance'],
      sourceUrl: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
      details: 'First binding global AI regulatory framework entering active penalty enforcement for general-purpose AI providers.'
    },
    {
      id: 'us-aisi-safety-testing-framework',
      title: 'US AI Safety Institute Releases Pre-Deployment Eval Mandates',
      category: 'governance',
      date: '2025-01-18',
      impact: 'HIGH',
      company: 'US AISI & NIST',
      tldr: 'Establishes voluntary testing protocols for chemical, biological, radiological, and cyber warfare capabilities in LLMs.',
      specs: { body: 'NIST / US AISI', evalDomains: 'CBRN & Cyber', compliance: 'Dual-Use Threshold' },
      tags: ['#USAISI', '#NIST', '#SafetyTesting', '#PreDeployment', '#CBRN'],
      sourceUrl: 'https://www.nist.gov/aisi',
      details: 'Frontier AI labs submit pre-release model checkpoints to government researchers for red-teaming evaluations.'
    },
    {
      id: 'copyright-office-ai-art-ruling',
      title: 'US Copyright Office Final Guidance on Generative AI Outputs',
      category: 'governance',
      date: '2025-03-30',
      impact: 'MODERATE',
      company: 'US Copyright Office',
      tldr: 'Affirms purely machine-generated outputs lack human authorship, requiring explicit proof of creative control.',
      specs: { policy: 'Compendium Section 313.2', test: 'Human Authorship Threshold', domain: 'IP Law' },
      tags: ['#Copyright', '#IPLaw', '#GenerativeAI', '#USCopyrightOffice', '#LegalPrecedent'],
      sourceUrl: 'https://www.copyright.gov/ai/',
      details: 'Establishes legal boundary between user-prompted AI generations and copyrightable human-assisted digital artwork.'
    },
    {
      id: 'uk-aisi-international-hub',
      title: 'UK AI Safety Institute San Francisco Office & Global Lab',
      category: 'governance',
      date: '2024-11-20',
      impact: 'HIGH',
      company: 'UK AI Safety Institute',
      tldr: 'UK AISI opens Bay Area operational office to partner directly with Silicon Valley labs on safety benchmarks.',
      specs: { location: 'San Francisco & London', partnerLabs: 'OpenAI, Anthropic, Google', mandate: 'Empirical Evals' },
      tags: ['#UKAISI', '#AISafety', '#InternationalGov', '#SiliconValleyHub'],
      sourceUrl: 'https://www.gov.uk/government/organisations/uk-ai-safety-institute',
      details: 'Enables real-time empirical red-teaming directly in proximity to frontier lab engineering teams.'
    },

    // ----------------------------------------------------
    // MULTILATERAL & UN FORUMS
    // ----------------------------------------------------
    {
      id: 'un-ai-advisory-final-report',
      title: 'UN Advisory Body Releases Global AI Governance Blueprint',
      category: 'multilateral',
      date: '2024-09-25',
      impact: 'CRITICAL',
      company: 'United Nations',
      tldr: 'Recommends creating an International Scientific Panel on AI and a Global AI Data Infrastructure Fund.',
      specs: { resolution: 'UN GA Res 78/265', body: 'UN Secretary-General Advisory', recommendations: '7 Governance Pillars' },
      tags: ['#UnitedNations', '#UNAI', '#GlobalGovernance', '#Multilateral', '#ScientificPanel'],
      sourceUrl: 'https://www.un.org/en/ai-advisory-body',
      details: 'Landmark consensus document backed by 193 member states proposing global equitable access to compute and datasets.'
    },
    {
      id: 'paris-action-summit-2025',
      title: 'Paris AI Action Summit 2025 Communiqué',
      category: 'multilateral',
      date: '2025-02-11',
      impact: 'CRITICAL',
      company: 'French Republic & International Leaders',
      tldr: 'Global heads of state, tech CEOs, and civil society gather in Paris to establish public-interest AI compute foundations.',
      specs: { venue: 'Paris, France', signatories: '60+ Nations', initiative: 'Public Interest AI Compute' },
      tags: ['#ParisAISummit', '#Multilateral', '#PublicCompute', '#Macron', '#GlobalTechPolicy'],
      sourceUrl: 'https://www.elysee.fr/',
      details: 'Follow-up to Bletchley Park and Seoul Summits, shifting focus toward sustainable energy, open science, and global inclusion.'
    },
    {
      id: 'g7-hiroshima-process-code-of-conduct',
      title: 'G7 Hiroshima AI Process Reporting Framework Enforcement',
      category: 'multilateral',
      date: '2025-05-02',
      impact: 'HIGH',
      company: 'G7 Nations (OECD)',
      tldr: 'Operationalizes voluntary code of conduct into standardized annual transparency reporting for frontier AI developers.',
      specs: { forum: 'G7 / OECD', standard: 'Hiroshima Process Protocol', compliance: 'Annual Risk Report' },
      tags: ['#G7', '#HiroshimaProcess', '#OECD', '#CodeOfConduct', '#Transparency'],
      sourceUrl: 'https://www.oecd.org/en/topics/ai.html',
      details: 'Harmonizes safety reporting expectations across the US, UK, Japan, Germany, France, Italy, Canada, and EU.'
    },
    {
      id: 'gpai-oecd-integrated-partnership',
      title: 'Global Partnership on AI (GPAI) & OECD Unified Secretariat',
      category: 'multilateral',
      date: '2024-12-18',
      impact: 'MODERATE',
      company: 'GPAI & OECD',
      tldr: 'Merges GPAI expert working groups into the OECD AI Observatory to create a single global empirical body.',
      specs: { organization: 'GPAI + OECD', focus: 'Empirical AI Metrics', members: '44 Countries' },
      tags: ['#GPAI', '#OECD', '#GlobalPartnership', '#EmpiricalPolicy'],
      sourceUrl: 'https://gpai.ai/',
      details: 'Combines academic research panels with international policy experts to measure global job market impacts and compute distribution.'
    }
  ],

  links: [
    // Model & Reasoning Relationships
    { source: 'transformer-scaling-limits', target: 'deepseek-r1', label: 'Inference Scaling Validation' },
    { source: 'transformer-scaling-limits', target: 'claude-3-7-sonnet', label: 'Extended Thinking Paradigm' },
    { source: 'deepseek-r1', target: 'claude-3-7-sonnet', label: 'Reasoning Market Competition' },
    { source: 'deepseek-r1', target: 'llama-4-scout', label: 'Open Weights Wave' },
    { source: 'claude-3-7-sonnet', target: 'claude-computer-use', label: 'Agentic GUI Execution' },
    { source: 'gpt-4o-realtime', target: 'multimodal-native-embs', label: 'Speech-Vision Latent Fusion' },

    // Agentic AI Connections
    { source: 'claude-computer-use', target: 'operator-openai', label: 'GUI vs Web Agent Rivalry' },
    { source: 'autogen-v04', target: 'swarms-framework-v2', label: 'Multi-Agent Paradigm' },
    { source: 'operator-openai', target: 'agentic-swe-bench-pro', label: 'Autonomous Coding Evaluation' },
    { source: 'claude-3-7-sonnet', target: 'agentic-swe-bench-pro', label: 'SWE-Bench Benchmark Leader' },

    // Compute & Hardware Links
    { source: 'nvidia-blackwell-b200', target: 'openai-stargate-supercomputer', label: 'Cluster Compute Backbone' },
    { source: 'nvidia-blackwell-b200', target: 'grok-3-xai', label: 'Colossus Supercluster Hardware' },
    { source: 'google-tpu-v6-trillium', target: 'gemini-2-5-pro', label: 'Custom Silicon Training' },
    { source: 'anthropic-amazon-investment', target: 'claude-3-7-sonnet', label: 'Trainium Cloud Infrastructure' },
    { source: 'meta-fair-10yr-anniversary', target: 'llama-4-scout', label: 'FAIR Open Science Lineage' },

    // Security & Safety Connections
    { source: 'cve-llm-prompt-injection', target: 'operator-openai', label: 'Browser Agent Threat Risk' },
    { source: 'deep-jailbreak-evals', target: 'claude-3-7-sonnet', label: 'Mechanistic Red-Teaming' },
    { source: 'watermarking-synth-media', target: 'multimodal-native-embs', label: 'Synthetic Content Provenance' },
    { source: 'model-weight-theft-zero-day', target: 'us-aisi-safety-testing-framework', label: 'State-Sponsored Cyber Protocol' },

    // Fellowships & Talent Pipelines
    { source: 'openai-residency-2025', target: 'operator-openai', label: 'Resident Architect Contributions' },
    { source: 'anthropic-fellows-program', target: 'deep-jailbreak-evals', label: 'Interpretability Fellow Research' },
    { source: 'schmidt-futures-ai-postdoc', target: 'transformer-scaling-limits', label: 'Academic Scaling Research' },
    { source: 'meta-ai-phd-fellowship', target: 'meta-fair-10yr-anniversary', label: 'FAIR Mentorship Pipeline' },

    // Military & Defense Links
    { source: 'anduril-lattice-autonomous-defense', target: 'us-dod-responsible-ai-directive', label: 'Ethical Autonomous Directives' },
    { source: 'palantir-aip-military-contracts', target: 'nato-diana-defense-incubator', label: 'NATO Defense Tech Ecosystem' },
    { source: 'model-weight-theft-zero-day', target: 'anduril-lattice-autonomous-defense', label: 'Critical Infrastructure Cyber Shield' },

    // Governance & Regulation Links
    { source: 'eu-ai-act-enforcement-phase1', target: 'mistral-large-3', label: 'European Legal Compliance' },
    { source: 'us-aisi-safety-testing-framework', target: 'uk-aisi-international-hub', label: 'Bilateral Safety Evaluation' },
    { source: 'us-aisi-safety-testing-framework', target: 'deepseek-r1', label: 'Frontier Red-Teaming Audits' },
    { source: 'copyright-office-ai-art-ruling', target: 'multimodal-native-embs', label: 'IP Copyright Boundary' },

    // Multilateral & Global Forum Connections
    { source: 'un-ai-advisory-final-report', target: 'paris-action-summit-2025', label: 'Global Summit Governance' },
    { source: 'paris-action-summit-2025', target: 'g7-hiroshima-process-code-of-conduct', label: 'Multilateral Accord Alignment' },
    { source: 'g7-hiroshima-process-code-of-conduct', target: 'gpai-oecd-integrated-partnership', label: 'Empirical Policy Measurement' },
    { source: 'un-ai-advisory-final-report', target: 'eu-ai-act-enforcement-phase1', label: 'International Governance Baseline' },
    { source: 'paris-action-summit-2025', target: 'deepseek-r1', label: 'Open Compute & Global Access' }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DOMAIN_CATEGORIES, SYNAPSE_DATA };
}
