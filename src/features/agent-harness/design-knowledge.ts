export interface StyleProfile {
  id: string;
  name: string;
  description: string;
  background: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    mutedText: string;
  };
  typography: {
    titleFont: string;
    bodyFont: string;
    titleWeight: number;
  };
}

export const STYLE_PROFILES: Record<string, StyleProfile> = {
  minimalist: {
    id: "minimalist",
    name: "Studio Minimaliste",
    description: "Épuré, tons neutres, lignes architecturales et grand espace blanc",
    background: "#F8F9FA",
    palette: {
      primary: "#18181B",
      secondary: "#52525B",
      accent: "#71717A",
      text: "#18181B",
      mutedText: "#71717A",
    },
    typography: {
      titleFont: "Arial",
      bodyFont: "Arial",
      titleWeight: 800,
    },
  },
  editorial_luxury: {
    id: "editorial_luxury",
    name: "Luxe Éditorial",
    description: "Charbon profond, touches champagne dorées et typographie sophistiquée",
    background: "#09090B",
    palette: {
      primary: "#D4AF37",
      secondary: "#A1A1AA",
      accent: "#E5E5E5",
      text: "#FAFAFA",
      mutedText: "#A1A1AA",
    },
    typography: {
      titleFont: "Times New Roman",
      bodyFont: "Georgia",
      titleWeight: 700,
    },
  },
  modern_saas: {
    id: "modern_saas",
    name: "Tech & SaaS Moderne",
    description: "Dégradés subtils indigo/cyan, badges arrondis et hiérarchie nette",
    background: "#0F172A",
    palette: {
      primary: "#6366F1",
      secondary: "#06B6D4",
      accent: "#38BDF8",
      text: "#F8FAFC",
      mutedText: "#94A3B8",
    },
    typography: {
      titleFont: "Arial",
      bodyFont: "Arial",
      titleWeight: 700,
    },
  },
  neo_brutalist: {
    id: "neo_brutalist",
    name: "Néo-Brutalisme",
    description: "Contours noirs marqués, contrastes tranchés et jaune acide percutant",
    background: "#FEF08A",
    palette: {
      primary: "#000000",
      secondary: "#F43F5E",
      accent: "#10B981",
      text: "#000000",
      mutedText: "#374151",
    },
    typography: {
      titleFont: "Impact",
      bodyFont: "Arial",
      titleWeight: 900,
    },
  },
  warm_artisan: {
    id: "warm_artisan",
    name: "Artisan Chaleureux",
    description: "Terre cuite, vert sauge, formes douces et ambiance organique",
    background: "#FFFBEB",
    palette: {
      primary: "#C2410C",
      secondary: "#047857",
      accent: "#B45309",
      text: "#451A03",
      mutedText: "#78350F",
    },
    typography: {
      titleFont: "Georgia",
      bodyFont: "Arial",
      titleWeight: 700,
    },
  },
};

export const HARNESS_SYSTEM_PROMPT = `You are the Lead Creative Director and Autonomous Design Engine embedded in CanIA (an advanced Canva-like graphic suite).
Your mission is to formulate autonomous, professional-grade, multi-phase design plans executed live on the canvas.

Design Guidelines (Anti-Slop Standard):
1. SPATIAL BALANCE: Never place all elements in the center. Structure designs with clear vertical or asymmetric zones:
   - Header/Badge: top zone (10-25% from top)
   - Focal Subject: hero image or bold headline in center-upper area
   - Body/Value Proposition: middle-lower area
   - Call to Action/Footer: bottom area (75-90% from top)
2. COLOR CALIBRATION: Avoid random colors. Always stick to a curated harmony:
   - 1 dominant background
   - 1 high-contrast text color
   - 1 or 2 precise accent colors for shapes/highlights
   - Never use illegible gray-on-gray or white-on-yellow
3. TYPOGRAPHY HIERARCHY:
   - Big Display title: size 64-96px, bold/black weight
   - Subtitle: size 32-44px, medium weight
   - Body/Details: size 20-28px, regular weight
   - Badge/Tag: size 16-20px, uppercase, inside a soft rectangle
4. SHAPES & ACCENTS:
   - Use soft rectangles as content cards or button badges behind text
   - Use subtle circles as visual backdrops or decorative accents
5. AI IMAGERY:
   - When requested or when a photographic centerpiece is needed, invoke "generate_image" with a vivid, descriptive prompt in English.

You must respond by calling the "propose_design_plan" tool with a logical, multi-step sequence of actions.`;
