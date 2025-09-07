export interface ThemeColors {
  primary: string;
  primaryDark: string;
  secondary: string;
  secondaryDark: string;
  accent: string;
  accentDark: string;
  background: string;
  backgroundDark: string;
  surface: string;
  surfaceDark: string;
  text: string;
  textDark: string;
  textSecondary: string;
  textSecondaryDark: string;
}

export interface GradientConfig {
  type: 'linear' | 'radial' | 'conic';
  direction?: string;
  colors: string[];
  stops?: number[];
}

export interface ThemeFont {
  family: string;
  weights: number[];
  fallbacks: string[];
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  category: 'islamic' | 'modern' | 'classic' | 'nature' | 'vibrant' | 'minimal' | 'dark' | 'custom';
  colors: ThemeColors;
  gradients: {
    primary: GradientConfig;
    secondary: GradientConfig;
    hero: GradientConfig;
    card: GradientConfig;
    button: GradientConfig;
  };
  fonts: {
    heading: ThemeFont;
    body: ThemeFont;
    arabic?: ThemeFont;
  };
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadows: 'none' | 'soft' | 'medium' | 'strong';
}

export const THEME_PRESETS: Theme[] = [
  // Islamic Themes
  {
    id: 'islamic-emerald',
    name: 'Islamic Emerald',
    description: 'Traditional Islamic green with golden accents',
    category: 'islamic',
    colors: {
      primary: '#059669',
      primaryDark: '#047857',
      secondary: '#F59E0B',
      secondaryDark: '#D97706',
      accent: '#10B981',
      accentDark: '#059669',
      background: '#FFFFFF',
      backgroundDark: '#1F2937',
      surface: '#F9FAFB',
      surfaceDark: '#374151',
      text: '#111827',
      textDark: '#F9FAFB',
      textSecondary: '#6B7280',
      textSecondaryDark: '#9CA3AF',
    },
    gradients: {
      primary: {
        type: 'linear',
        direction: '135deg',
        colors: ['#059669', '#10B981', '#34D399'],
        stops: [0, 50, 100],
      },
      secondary: {
        type: 'linear',
        direction: '45deg',
        colors: ['#F59E0B', '#FBBF24', '#FCD34D'],
        stops: [0, 50, 100],
      },
      hero: {
        type: 'radial',
        colors: ['#059669', '#047857', '#065F46'],
        stops: [0, 70, 100],
      },
      card: {
        type: 'linear',
        direction: '180deg',
        colors: ['rgba(255,255,255,0.9)', 'rgba(249,250,251,0.8)'],
        stops: [0, 100],
      },
      button: {
        type: 'linear',
        direction: '135deg',
        colors: ['#059669', '#10B981'],
        stops: [0, 100],
      },
    },
    fonts: {
      heading: {
        family: 'Inter',
        weights: [600, 700, 800],
        fallbacks: ['system-ui', 'sans-serif'],
      },
      body: {
        family: 'Inter',
        weights: [400, 500, 600],
        fallbacks: ['system-ui', 'sans-serif'],
      },
      arabic: {
        family: 'Noto Naskh Arabic',
        weights: [400, 600, 700],
        fallbacks: ['serif'],
      },
    },
    borderRadius: 'md',
    shadows: 'soft',
  },
  {
    id: 'islamic-sapphire',
    name: 'Islamic Sapphire',
    description: 'Deep blue with silver accents inspired by Islamic architecture',
    category: 'islamic',
    colors: {
      primary: '#1E40AF',
      primaryDark: '#1E3A8A',
      secondary: '#64748B',
      secondaryDark: '#475569',
      accent: '#3B82F6',
      accentDark: '#2563EB',
      background: '#FFFFFF',
      backgroundDark: '#0F172A',
      surface: '#F8FAFC',
      surfaceDark: '#334155',
      text: '#0F172A',
      textDark: '#F8FAFC',
      textSecondary: '#64748B',
      textSecondaryDark: '#94A3B8',
    },
    gradients: {
      primary: {
        type: 'linear',
        direction: '135deg',
        colors: ['#1E40AF', '#3B82F6', '#60A5FA'],
        stops: [0, 50, 100],
      },
      secondary: {
        type: 'linear',
        direction: '45deg',
        colors: ['#64748B', '#94A3B8', '#CBD5E1'],
        stops: [0, 50, 100],
      },
      hero: {
        type: 'conic',
        colors: ['#1E40AF', '#3B82F6', '#1E40AF'],
        stops: [0, 50, 100],
      },
      card: {
        type: 'linear',
        direction: '180deg',
        colors: ['rgba(248,250,252,0.9)', 'rgba(241,245,249,0.8)'],
        stops: [0, 100],
      },
      button: {
        type: 'linear',
        direction: '135deg',
        colors: ['#1E40AF', '#3B82F6'],
        stops: [0, 100],
      },
    },
    fonts: {
      heading: {
        family: 'Inter',
        weights: [600, 700, 800],
        fallbacks: ['system-ui', 'sans-serif'],
      },
      body: {
        family: 'Inter',
        weights: [400, 500, 600],
        fallbacks: ['system-ui', 'sans-serif'],
      },
      arabic: {
        family: 'Noto Naskh Arabic',
        weights: [400, 600, 700],
        fallbacks: ['serif'],
      },
    },
    borderRadius: 'lg',
    shadows: 'medium',
  },
  // Modern Themes
  {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    description: 'Contemporary gradient design with vibrant colors',
    category: 'modern',
    colors: {
      primary: '#8B5CF6',
      primaryDark: '#7C3AED',
      secondary: '#EC4899',
      secondaryDark: '#DB2777',
      accent: '#06B6D4',
      accentDark: '#0891B2',
      background: '#FFFFFF',
      backgroundDark: '#111827',
      surface: '#F9FAFB',
      surfaceDark: '#1F2937',
      text: '#111827',
      textDark: '#F9FAFB',
      textSecondary: '#6B7280',
      textSecondaryDark: '#9CA3AF',
    },
    gradients: {
      primary: {
        type: 'linear',
        direction: '135deg',
        colors: ['#8B5CF6', '#A78BFA', '#C4B5FD'],
        stops: [0, 50, 100],
      },
      secondary: {
        type: 'linear',
        direction: '45deg',
        colors: ['#EC4899', '#F472B6', '#F9A8D4'],
        stops: [0, 50, 100],
      },
      hero: {
        type: 'linear',
        direction: '135deg',
        colors: ['#8B5CF6', '#EC4899', '#06B6D4'],
        stops: [0, 50, 100],
      },
      card: {
        type: 'linear',
        direction: '180deg',
        colors: ['rgba(255,255,255,0.95)', 'rgba(249,250,251,0.9)'],
        stops: [0, 100],
      },
      button: {
        type: 'linear',
        direction: '135deg',
        colors: ['#8B5CF6', '#EC4899'],
        stops: [0, 100],
      },
    },
    fonts: {
      heading: {
        family: 'Inter',
        weights: [600, 700, 800],
        fallbacks: ['system-ui', 'sans-serif'],
      },
      body: {
        family: 'Inter',
        weights: [400, 500, 600],
        fallbacks: ['system-ui', 'sans-serif'],
      },
    },
    borderRadius: 'xl',
    shadows: 'strong',
  },
  {
    id: 'modern-neon',
    name: 'Modern Neon',
    description: 'Futuristic neon colors with dark theme',
    category: 'modern',
    colors: {
      primary: '#00F5FF',
      primaryDark: '#00D9FF',
      secondary: '#FF1493',
      secondaryDark: '#FF0080',
      accent: '#ADFF2F',
      accentDark: '#9AFF00',
      background: '#000000',
      backgroundDark: '#000000',
      surface: '#111111',
      surfaceDark: '#111111',
      text: '#FFFFFF',
      textDark: '#FFFFFF',
      textSecondary: '#CCCCCC',
      textSecondaryDark: '#CCCCCC',
    },
    gradients: {
      primary: {
        type: 'linear',
        direction: '135deg',
        colors: ['#00F5FF', '#0080FF', '#4169E1'],
        stops: [0, 50, 100],
      },
      secondary: {
        type: 'linear',
        direction: '45deg',
        colors: ['#FF1493', '#FF6347', '#FFB6C1'],
        stops: [0, 50, 100],
      },
      hero: {
        type: 'radial',
        colors: ['rgba(0,245,255,0.3)', 'rgba(255,20,147,0.2)', 'rgba(0,0,0,0.8)'],
        stops: [0, 50, 100],
      },
      card: {
        type: 'linear',
        direction: '180deg',
        colors: ['rgba(17,17,17,0.9)', 'rgba(0,0,0,0.8)'],
        stops: [0, 100],
      },
      button: {
        type: 'linear',
        direction: '135deg',
        colors: ['#00F5FF', '#FF1493'],
        stops: [0, 100],
      },
    },
    fonts: {
      heading: {
        family: 'Inter',
        weights: [600, 700, 800],
        fallbacks: ['system-ui', 'sans-serif'],
      },
      body: {
        family: 'Inter',
        weights: [400, 500, 600],
        fallbacks: ['system-ui', 'sans-serif'],
      },
    },
    borderRadius: 'sm',
    shadows: 'strong',
  },
  // Classic Themes
  {
    id: 'classic-royal',
    name: 'Classic Royal',
    description: 'Timeless royal purple and gold combination',
    category: 'classic',
    colors: {
      primary: '#6B46C1',
      primaryDark: '#553C9A',
      secondary: '#D97706',
      secondaryDark: '#B45309',
      accent: '#DC2626',
      accentDark: '#B91C1C',
      background: '#FFFBEB',
      backgroundDark: '#1C1917',
      surface: '#FEF3C7',
      surfaceDark: '#292524',
      text: '#1C1917',
      textDark: '#FFFBEB',
      textSecondary: '#78716C',
      textSecondaryDark: '#A8A29E',
    },
    gradients: {
      primary: {
        type: 'linear',
        direction: '135deg',
        colors: ['#6B46C1', '#8B5CF6', '#A855F7'],
        stops: [0, 50, 100],
      },
      secondary: {
        type: 'linear',
        direction: '45deg',
        colors: ['#D97706', '#F59E0B', '#FBBF24'],
        stops: [0, 50, 100],
      },
      hero: {
        type: 'linear',
        direction: '135deg',
        colors: ['#6B46C1', '#D97706', '#DC2626'],
        stops: [0, 60, 100],
      },
      card: {
        type: 'linear',
        direction: '180deg',
        colors: ['rgba(255,251,235,0.95)', 'rgba(254,243,199,0.9)'],
        stops: [0, 100],
      },
      button: {
        type: 'linear',
        direction: '135deg',
        colors: ['#6B46C1', '#8B5CF6'],
        stops: [0, 100],
      },
    },
    fonts: {
      heading: {
        family: 'Playfair Display',
        weights: [600, 700, 800],
        fallbacks: ['serif'],
      },
      body: {
        family: 'Inter',
        weights: [400, 500, 600],
        fallbacks: ['system-ui', 'sans-serif'],
      },
    },
    borderRadius: 'md',
    shadows: 'medium',
  },
  // Nature Themes
  {
    id: 'nature-forest',
    name: 'Nature Forest',
    description: 'Earth tones inspired by forest landscapes',
    category: 'nature',
    colors: {
      primary: '#059669',
      primaryDark: '#047857',
      secondary: '#92400E',
      secondaryDark: '#78350F',
      accent: '#DC2626',
      accentDark: '#B91C1C',
      background: '#F7F5F0',
      backgroundDark: '#1C1B16',
      surface: '#ECFDF5',
      surfaceDark: '#14532D',
      text: '#1C1B16',
      textDark: '#F7F5F0',
      textSecondary: '#6B7280',
      textSecondaryDark: '#9CA3AF',
    },
    gradients: {
      primary: {
        type: 'linear',
        direction: '135deg',
        colors: ['#059669', '#10B981', '#34D399'],
        stops: [0, 50, 100],
      },
      secondary: {
        type: 'linear',
        direction: '45deg',
        colors: ['#92400E', '#D97706', '#F59E0B'],
        stops: [0, 50, 100],
      },
      hero: {
        type: 'radial',
        colors: ['#059669', '#047857', '#065F46'],
        stops: [0, 70, 100],
      },
      card: {
        type: 'linear',
        direction: '180deg',
        colors: ['rgba(247,245,240,0.95)', 'rgba(236,253,245,0.9)'],
        stops: [0, 100],
      },
      button: {
        type: 'linear',
        direction: '135deg',
        colors: ['#059669', '#10B981'],
        stops: [0, 100],
      },
    },
    fonts: {
      heading: {
        family: 'Inter',
        weights: [600, 700, 800],
        fallbacks: ['system-ui', 'sans-serif'],
      },
      body: {
        family: 'Inter',
        weights: [400, 500, 600],
        fallbacks: ['system-ui', 'sans-serif'],
      },
    },
    borderRadius: 'lg',
    shadows: 'soft',
  },
  {
    id: 'nature-ocean',
    name: 'Nature Ocean',
    description: 'Calming blues and teals inspired by ocean waves',
    category: 'nature',
    colors: {
      primary: '#0891B2',
      primaryDark: '#0E7490',
      secondary: '#06B6D4',
      secondaryDark: '#0891B2',
      accent: '#10B981',
      accentDark: '#059669',
      background: '#F0F9FF',
      backgroundDark: '#0C1420',
      surface: '#E0F7FA',
      surfaceDark: '#164E63',
      text: '#0C1420',
      textDark: '#F0F9FF',
      textSecondary: '#64748B',
      textSecondaryDark: '#94A3B8',
    },
    gradients: {
      primary: {
        type: 'linear',
        direction: '135deg',
        colors: ['#0891B2', '#06B6D4', '#22D3EE'],
        stops: [0, 50, 100],
      },
      secondary: {
        type: 'linear',
        direction: '45deg',
        colors: ['#06B6D4', '#22D3EE', '#67E8F9'],
        stops: [0, 50, 100],
      },
      hero: {
        type: 'radial',
        colors: ['#0891B2', '#06B6D4', '#0E7490'],
        stops: [0, 60, 100],
      },
      card: {
        type: 'linear',
        direction: '180deg',
        colors: ['rgba(240,249,255,0.95)', 'rgba(224,247,250,0.9)'],
        stops: [0, 100],
      },
      button: {
        type: 'linear',
        direction: '135deg',
        colors: ['#0891B2', '#06B6D4'],
        stops: [0, 100],
      },
    },
    fonts: {
      heading: {
        family: 'Inter',
        weights: [600, 700, 800],
        fallbacks: ['system-ui', 'sans-serif'],
      },
      body: {
        family: 'Inter',
        weights: [400, 500, 600],
        fallbacks: ['system-ui', 'sans-serif'],
      },
    },
    borderRadius: 'xl',
    shadows: 'soft',
  },
  // Vibrant Themes
  {
    id: 'vibrant-sunset',
    name: 'Vibrant Sunset',
    description: 'Warm sunset colors with orange and pink gradients',
    category: 'vibrant',
    colors: {
      primary: '#EA580C',
      primaryDark: '#C2410C',
      secondary: '#EC4899',
      secondaryDark: '#DB2777',
      accent: '#F59E0B',
      accentDark: '#D97706',
      background: '#FFFBEB',
      backgroundDark: '#1C1917',
      surface: '#FEF3C7',
      surfaceDark: '#292524',
      text: '#1C1917',
      textDark: '#FFFBEB',
      textSecondary: '#78716C',
      textSecondaryDark: '#A8A29E',
    },
    gradients: {
      primary: {
        type: 'linear',
        direction: '135deg',
        colors: ['#EA580C', '#F97316', '#FB923C'],
        stops: [0, 50, 100],
      },
      secondary: {
        type: 'linear',
        direction: '45deg',
        colors: ['#EC4899', '#F472B6', '#F9A8D4'],
        stops: [0, 50, 100],
      },
      hero: {
        type: 'linear',
        direction: '135deg',
        colors: ['#EA580C', '#EC4899', '#F59E0B'],
        stops: [0, 50, 100],
      },
      card: {
        type: 'linear',
        direction: '180deg',
        colors: ['rgba(255,251,235,0.95)', 'rgba(254,243,199,0.9)'],
        stops: [0, 100],
      },
      button: {
        type: 'linear',
        direction: '135deg',
        colors: ['#EA580C', '#EC4899'],
        stops: [0, 100],
      },
    },
    fonts: {
      heading: {
        family: 'Inter',
        weights: [600, 700, 800],
        fallbacks: ['system-ui', 'sans-serif'],
      },
      body: {
        family: 'Inter',
        weights: [400, 500, 600],
        fallbacks: ['system-ui', 'sans-serif'],
      },
    },
    borderRadius: 'lg',
    shadows: 'strong',
  },
  // Minimal Themes
  {
    id: 'minimal-monochrome',
    name: 'Minimal Monochrome',
    description: 'Clean monochrome design with subtle gradients',
    category: 'minimal',
    colors: {
      primary: '#374151',
      primaryDark: '#1F2937',
      secondary: '#6B7280',
      secondaryDark: '#4B5563',
      accent: '#111827',
      accentDark: '#000000',
      background: '#FFFFFF',
      backgroundDark: '#111827',
      surface: '#F9FAFB',
      surfaceDark: '#1F2937',
      text: '#111827',
      textDark: '#F9FAFB',
      textSecondary: '#6B7280',
      textSecondaryDark: '#9CA3AF',
    },
    gradients: {
      primary: {
        type: 'linear',
        direction: '135deg',
        colors: ['#374151', '#4B5563', '#6B7280'],
        stops: [0, 50, 100],
      },
      secondary: {
        type: 'linear',
        direction: '45deg',
        colors: ['#6B7280', '#9CA3AF', '#D1D5DB'],
        stops: [0, 50, 100],
      },
      hero: {
        type: 'linear',
        direction: '180deg',
        colors: ['rgba(55,65,81,0.1)', 'rgba(107,114,128,0.05)'],
        stops: [0, 100],
      },
      card: {
        type: 'linear',
        direction: '180deg',
        colors: ['rgba(255,255,255,0.95)', 'rgba(249,250,251,0.9)'],
        stops: [0, 100],
      },
      button: {
        type: 'linear',
        direction: '135deg',
        colors: ['#374151', '#4B5563'],
        stops: [0, 100],
      },
    },
    fonts: {
      heading: {
        family: 'Inter',
        weights: [600, 700, 800],
        fallbacks: ['system-ui', 'sans-serif'],
      },
      body: {
        family: 'Inter',
        weights: [400, 500, 600],
        fallbacks: ['system-ui', 'sans-serif'],
      },
    },
    borderRadius: 'sm',
    shadows: 'none',
  },
  // Dark Theme
  {
    id: 'dark-purple',
    name: 'Dark Purple',
    description: 'Elegant dark theme with purple accents',
    category: 'dark',
    colors: {
      primary: '#8B5CF6',
      primaryDark: '#7C3AED',
      secondary: '#A78BFA',
      secondaryDark: '#8B5CF6',
      accent: '#EC4899',
      accentDark: '#DB2777',
      background: '#0F0F23',
      backgroundDark: '#0F0F23',
      surface: '#1E1B4B',
      surfaceDark: '#1E1B4B',
      text: '#F8FAFC',
      textDark: '#F8FAFC',
      textSecondary: '#A5B4FC',
      textSecondaryDark: '#A5B4FC',
    },
    gradients: {
      primary: {
        type: 'linear',
        direction: '135deg',
        colors: ['#8B5CF6', '#A78BFA', '#C4B5FD'],
        stops: [0, 50, 100],
      },
      secondary: {
        type: 'linear',
        direction: '45deg',
        colors: ['#A78BFA', '#C4B5FD', '#DDD6FE'],
        stops: [0, 50, 100],
      },
      hero: {
        type: 'radial',
        colors: ['rgba(139,92,246,0.3)', 'rgba(30,27,75,0.8)', 'rgba(15,15,35,1)'],
        stops: [0, 50, 100],
      },
      card: {
        type: 'linear',
        direction: '180deg',
        colors: ['rgba(30,27,75,0.9)', 'rgba(15,15,35,0.8)'],
        stops: [0, 100],
      },
      button: {
        type: 'linear',
        direction: '135deg',
        colors: ['#8B5CF6', '#EC4899'],
        stops: [0, 100],
      },
    },
    fonts: {
      heading: {
        family: 'Inter',
        weights: [600, 700, 800],
        fallbacks: ['system-ui', 'sans-serif'],
      },
      body: {
        family: 'Inter',
        weights: [400, 500, 600],
        fallbacks: ['system-ui', 'sans-serif'],
      },
    },
    borderRadius: 'lg',
    shadows: 'strong',
  },
];

// Theme application functions
export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  
  // Apply CSS custom properties
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  // Apply font families
  root.style.setProperty('--font-heading', theme.fonts.heading.family);
  root.style.setProperty('--font-body', theme.fonts.body.family);
  if (theme.fonts.arabic) {
    root.style.setProperty('--font-arabic', theme.fonts.arabic.family);
  }
  
  // Apply border radius
  const radiusValue = {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  }[theme.borderRadius];
  root.style.setProperty('--border-radius', radiusValue);
  
  // Apply shadows
  const shadowValue = {
    none: 'none',
    soft: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    strong: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }[theme.shadows];
  root.style.setProperty('--shadow', shadowValue);
  
  // Store current theme
  localStorage.setItem('selectedTheme', theme.id);
};

export const getThemeById = (id: string): Theme | undefined => {
  return THEME_PRESETS.find(theme => theme.id === id);
};

export const getThemesByCategory = (category: Theme['category']): Theme[] => {
  return THEME_PRESETS.filter(theme => theme.category === category);
};

export const getCurrentTheme = (): Theme => {
  const savedThemeId = localStorage.getItem('selectedTheme');
  return getThemeById(savedThemeId || 'islamic-emerald') || THEME_PRESETS[0];
};

export const createCustomTheme = (
  baseTheme: Theme,
  customizations: Partial<Theme>
): Theme => {
  return {
    ...baseTheme,
    ...customizations,
    id: `custom-${Date.now()}`,
    category: 'custom',
    colors: {
      ...baseTheme.colors,
      ...customizations.colors,
    },
    gradients: {
      ...baseTheme.gradients,
      ...customizations.gradients,
    },
    fonts: {
      ...baseTheme.fonts,
      ...customizations.fonts,
    },
  };
};

export const saveCustomTheme = (theme: Theme): void => {
  const customThemes = getCustomThemes();
  const updatedThemes = [...customThemes, theme];
  localStorage.setItem('customThemes', JSON.stringify(updatedThemes));
};

export const getCustomThemes = (): Theme[] => {
  const saved = localStorage.getItem('customThemes');
  return saved ? JSON.parse(saved) : [];
};

export const deleteCustomTheme = (themeId: string): void => {
  const customThemes = getCustomThemes();
  const filtered = customThemes.filter(theme => theme.id !== themeId);
  localStorage.setItem('customThemes', JSON.stringify(filtered));
};

export const getAllThemes = (): Theme[] => {
  return [...THEME_PRESETS, ...getCustomThemes()];
};