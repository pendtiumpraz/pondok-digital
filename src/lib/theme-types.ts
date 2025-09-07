// Extended TypeScript types for the theme system

export type ColorScheme = 'light' | 'dark' | 'auto';

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsv';

export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950?: string;
}

export interface ExtendedThemeColors {
  // Primary colors
  primary: ColorPalette;
  secondary: ColorPalette;
  accent: ColorPalette;
  
  // Semantic colors
  success: ColorPalette;
  warning: ColorPalette;
  error: ColorPalette;
  info: ColorPalette;
  
  // Neutral colors
  gray: ColorPalette;
  
  // Background colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  
  // Text colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    disabled: string;
  };
  
  // Border colors
  border: {
    light: string;
    medium: string;
    strong: string;
    focus: string;
  };
  
  // Surface colors
  surface: {
    base: string;
    raised: string;
    overlay: string;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface ThemeTypography {
  fontSizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  lineHeights: {
    tight: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
  fontWeights: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  letterSpacings: {
    tight: string;
    normal: string;
    wide: string;
  };
}

export interface ThemeBorders {
  radius: {
    none: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  width: {
    thin: string;
    medium: string;
    thick: string;
  };
}

export interface ThemeShadows {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
}

export interface ThemeAnimations {
  durations: {
    fast: string;
    normal: string;
    slow: string;
  };
  easings: {
    linear: string;
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}

export interface ExtendedTheme {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  author?: string;
  
  // Color system
  colors: ExtendedThemeColors;
  
  // Design tokens
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borders: ThemeBorders;
  shadows: ThemeShadows;
  animations: ThemeAnimations;
  
  // Component-specific theming
  components?: {
    button?: ComponentTheme;
    card?: ComponentTheme;
    modal?: ComponentTheme;
    form?: ComponentTheme;
    navigation?: ComponentTheme;
  };
  
  // Gradient system
  gradients: Record<string, GradientDefinition>;
  
  // Dark mode variants
  darkMode: {
    colors: Partial<ExtendedThemeColors>;
    components?: Record<string, ComponentTheme>;
  };
  
  // Responsive breakpoints
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  
  // Accessibility settings
  accessibility: {
    focusRingWidth: string;
    focusRingColor: string;
    highContrast: boolean;
    reducedMotion: boolean;
  };
}

export interface ComponentTheme {
  base: Record<string, any>;
  variants?: Record<string, Record<string, any>>;
  sizes?: Record<string, Record<string, any>>;
  states?: {
    hover?: Record<string, any>;
    active?: Record<string, any>;
    disabled?: Record<string, any>;
    focus?: Record<string, any>;
  };
}

export interface GradientDefinition {
  type: 'linear' | 'radial' | 'conic' | 'mesh';
  direction?: string | number;
  colors: Array<{
    color: string;
    position?: number;
    opacity?: number;
  }>;
  animation?: {
    duration: string;
    direction: 'normal' | 'reverse' | 'alternate';
    iterationCount: number | 'infinite';
    timingFunction: string;
  };
}

export interface ThemePreset {
  theme: ExtendedTheme;
  preview: {
    colors: string[];
    gradient: GradientDefinition;
    screenshot?: string;
  };
  tags: string[];
  featured: boolean;
  downloadCount: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeConfiguration {
  currentTheme: string;
  colorScheme: ColorScheme;
  customThemes: string[];
  preferences: {
    autoSwitchDarkMode: boolean;
    respectSystemPreferences: boolean;
    animations: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
  };
}

export interface ThemeContextValue {
  currentTheme: ExtendedTheme;
  availableThemes: ExtendedTheme[];
  colorScheme: ColorScheme;
  setTheme: (themeId: string) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  createCustomTheme: (theme: Partial<ExtendedTheme>) => string;
  updateTheme: (themeId: string, updates: Partial<ExtendedTheme>) => void;
  deleteCustomTheme: (themeId: string) => void;
  exportTheme: (themeId: string) => string;
  importTheme: (themeData: string) => string;
  resetToDefault: () => void;
}

// Utility types for theme validation
export type ThemeValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
};

export type ThemeExportFormat = 'json' | 'css' | 'scss' | 'tailwind';

export interface ThemeExportOptions {
  format: ThemeExportFormat;
  includeComponents: boolean;
  includeDarkMode: boolean;
  minify: boolean;
  addComments: boolean;
}

export interface ColorConversionOptions {
  inputFormat: ColorFormat;
  outputFormat: ColorFormat;
  alpha?: number;
}

export interface ThemeGenerationOptions {
  baseColor: string;
  colorCount: number;
  saturationRange: [number, number];
  lightnessRange: [number, number];
  contrastRatio: number;
  colorHarmony: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic';
}

// Component-specific theme types
export interface ButtonTheme extends ComponentTheme {
  variants: {
    primary: Record<string, any>;
    secondary: Record<string, any>;
    outline: Record<string, any>;
    ghost: Record<string, any>;
    link: Record<string, any>;
  };
  sizes: {
    xs: Record<string, any>;
    sm: Record<string, any>;
    md: Record<string, any>;
    lg: Record<string, any>;
    xl: Record<string, any>;
  };
}

export interface CardTheme extends ComponentTheme {
  variants: {
    default: Record<string, any>;
    elevated: Record<string, any>;
    outlined: Record<string, any>;
    filled: Record<string, any>;
  };
}

export interface FormTheme extends ComponentTheme {
  input: ComponentTheme;
  label: ComponentTheme;
  helpText: ComponentTheme;
  errorText: ComponentTheme;
  fieldset: ComponentTheme;
}

// Theme event types
export type ThemeEventType = 
  | 'theme-changed'
  | 'color-scheme-changed'
  | 'custom-theme-created'
  | 'custom-theme-updated'
  | 'custom-theme-deleted'
  | 'theme-exported'
  | 'theme-imported';

export interface ThemeEvent {
  type: ThemeEventType;
  themeId?: string;
  timestamp: Date;
  data?: any;
}

// Theme plugin system types
export interface ThemePlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  hooks: {
    beforeThemeChange?: (oldTheme: ExtendedTheme, newTheme: ExtendedTheme) => ExtendedTheme | void;
    afterThemeChange?: (theme: ExtendedTheme) => void;
    beforeColorSchemeChange?: (oldScheme: ColorScheme, newScheme: ColorScheme) => ColorScheme | void;
    afterColorSchemeChange?: (scheme: ColorScheme) => void;
  };
  components?: Record<string, ComponentTheme>;
  utilities?: Record<string, Function>;
}

export type ThemePluginRegistry = Map<string, ThemePlugin>;

// Advanced gradient types
export interface MeshGradient extends GradientDefinition {
  type: 'mesh';
  points: Array<{
    x: number;
    y: number;
    color: string;
    radius: number;
  }>;
  blendMode: string;
}

export interface AnimatedGradient extends GradientDefinition {
  keyframes: Array<{
    offset: number;
    colors: string[];
  }>;
  animation: {
    duration: string;
    direction: 'normal' | 'reverse' | 'alternate';
    iterationCount: number | 'infinite';
    timingFunction: string;
    playState: 'running' | 'paused';
  };
}

export default ExtendedTheme;