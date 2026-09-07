export type PageFace =
  | { kind: "cover" }
  | { kind: "backcover" }
  | { kind: "intro"; title: string; lines: string[] }
  | { kind: "chapter"; index: string; title: string; body: string; doodle: DoodleKind }
  | { kind: "resources"; title: string; items: { label: string; value: string }[] }
  | { kind: "dedication"; lines: string[]; sign: string };

export type DoodleKind =
  | "book"
  | "scale"
  | "star"
  | "hands"
  | "megaphone"
  | "heart"
  | "speech";

export type Sheet = { front: PageFace; back: PageFace };

export const SHEETS: Sheet[] = [
  {
    front: { kind: "cover" },
    back: {
      kind: "intro",
      title: "FOR TRAINEES, EMPLOYERS & POLICYMAKERS",
      lines: [
        "Have you ever wondered what actually happens after a skill training program ends?",
        "Most systems track enrolment, attendance, and certificates. But true success lies in verified job placement, wage progression, and long-term career retention.",
        "KaushalDrishti bridges this gap through continuous, consent-driven outcome tracking.",
      ],
    },
  },
  {
    front: {
      kind: "chapter",
      index: "01",
      title: "Onboard\nYourself",
      body: "Every career journey requires a strong foundation. Candidates register to create a unified lifetime skill passport, consolidating all multi-program certifications into one secure digital identity.",
      doodle: "book",
    },
    back: {
      kind: "chapter",
      index: "02",
      title: "Address\nSkill Gaps",
      body: "Identify mismatches before they hinder progress. Real-time diagnostic evaluation maps existing competencies against dynamic industry demands to highlight critical areas for improvement.",
      doodle: "scale",
    },
  },
  {
    front: {
      kind: "chapter",
      index: "03",
      title: "Diversify\nOpportunities",
      body: "Expand career horizons beyond traditional employment. Algorithmic matching connects candidates with formal job roles, self-employment avenues, and high-impact apprenticeships.",
      doodle: "star",
    },
    back: {
      kind: "chapter",
      index: "04",
      title: "Connect\n& Validate",
      body: "Build trust through direct verification. Employers seamlessly validate candidate hires, job retention, and wage progression, replacing unverified claims with authentic outcome data.",
      doodle: "hands",
    },
  },
  {
    front: {
      kind: "chapter",
      index: "05",
      title: "Track\nProgress",
      body: "Stay engaged across every career milestone. Automated AI check-ins via WhatsApp and SMS track candidate progress at 3, 6, and 12-month intervals, even if contact details change.",
      doodle: "megaphone",
    },
    back: {
      kind: "chapter",
      index: "06",
      title: "Take\nResponsibility",
      body: "Drive accountability across all training initiatives. Institutional analytics evaluate provider performance, cohort success rates, and attrition reasons to optimize public resource allocation.",
      doodle: "heart",
    },
  },
  {
    front: {
      kind: "chapter",
      index: "07",
      title: "Challenge\nStagnation",
      body: "Transform outcome tracking into continuous growth. Data-driven remedial roadmaps trigger targeted curriculum upgrades, ensuring lifelong learning and long-term economic stability.",
      doodle: "speech",
    },
    back: {
      kind: "resources",
      title: "Beyond\nthe Core",
      items: [
        { label: "LinkedIn Sync", value: "Auto-updates profiles with verified skills" },
        { label: "AI Analysis", value: "Real-time job readiness diagnostics" },
        { label: "Smart Matcher", value: "Direct alignment to relevant roles" },
        { label: "Remedial Roadmaps", value: "Targeted pathways to bridge skill gaps" },
      ],
    },
  },
  {
    front: {
      kind: "dedication",
      lines: [
        "May every skill you gain open a",
        "door to lasting economic success.",
      ],
      sign: "— With commitment to impact & transparency",
    },
    back: { kind: "backcover" },
  },
];

export const TOTAL_SHEETS = SHEETS.length;
