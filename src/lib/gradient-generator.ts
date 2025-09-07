import { GradientConfig } from './theme-presets';

export interface GradientOptions {
  type: 'linear' | 'radial' | 'conic';
  direction?: string;
  colors: string[];
  stops?: number[];
  opacity?: number;
  blend?: boolean;
}

export interface AnimatedGradientOptions extends GradientOptions {
  duration?: string;
  timing?: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  iterations?: number | 'infinite';
}

/**
 * Generate CSS gradient string from configuration
 */
export const generateGradient = (config: GradientConfig): string => {
  const { type, direction = '135deg', colors, stops } = config;
  
  let gradientColors: string[];
  
  if (stops && stops.length === colors.length) {
    gradientColors = colors.map((color, index) => `${color} ${stops[index]}%`);
  } else {
    gradientColors = colors;
  }
  
  switch (type) {
    case 'linear':
      return `linear-gradient(${direction}, ${gradientColors.join(', ')})`;
    case 'radial':
      return `radial-gradient(circle, ${gradientColors.join(', ')})`;
    case 'conic':
      return `conic-gradient(from 0deg, ${gradientColors.join(', ')})`;
    default:
      return `linear-gradient(${direction}, ${gradientColors.join(', ')})`;
  }
};

/**
 * Generate multiple gradient variations
 */
export const generateGradientVariations = (
  baseColors: string[],
  type: 'linear' | 'radial' | 'conic' = 'linear'
): GradientConfig[] => {
  const directions = ['45deg', '90deg', '135deg', '180deg', '225deg', '270deg'];
  const variations: GradientConfig[] = [];
  
  directions.forEach(direction => {
    variations.push({
      type,
      direction: type === 'linear' ? direction : undefined,
      colors: baseColors,
    });
  });
  
  return variations;
};

/**
 * Create animated gradient CSS
 */
export const generateAnimatedGradient = (
  options: AnimatedGradientOptions
): { css: string; keyframes: string } => {
  const {
    type = 'linear',
    colors,
    duration = '3s',
    timing = 'ease-in-out',
    direction = 'alternate',
    iterations = 'infinite',
  } = options;
  
  const animationName = `gradient-${Math.random().toString(36).substr(2, 9)}`;
  
  // Generate keyframes for color animation
  const colorSteps = colors.length;
  const stepPercentage = 100 / (colorSteps - 1);
  
  let keyframes = `@keyframes ${animationName} {\n`;
  
  colors.forEach((color, index) => {
    const percentage = index * stepPercentage;
    const nextColor = colors[(index + 1) % colors.length];
    const gradientConfig: GradientConfig = {
      type,
      direction: '135deg',
      colors: [color, nextColor],
    };
    keyframes += `  ${percentage}% {\n`;
    keyframes += `    background: ${generateGradient(gradientConfig)};\n`;
    keyframes += `  }\n`;
  });
  
  keyframes += '}';
  
  const css = `
    background: ${generateGradient({ type, colors, direction: '135deg' })};
    animation: ${animationName} ${duration} ${timing} ${iterations} ${direction};
    background-size: 400% 400%;
  `;
  
  return { css, keyframes };
};

/**
 * Generate mesh gradient (multiple overlapping gradients)
 */
export const generateMeshGradient = (
  gradients: GradientConfig[],
  blendMode: string = 'multiply'
): string => {
  const gradientStrings = gradients.map(generateGradient);
  return gradientStrings.join(', ');
};

/**
 * Create CSS custom properties for gradients
 */
export const generateGradientVariables = (
  gradients: Record<string, GradientConfig>
): Record<string, string> => {
  const variables: Record<string, string> = {};
  
  Object.entries(gradients).forEach(([name, config]) => {
    variables[`--gradient-${name}`] = generateGradient(config);
  });
  
  return variables;
};

/**
 * Apply gradient variables to document root
 */
export const applyGradientVariables = (
  variables: Record<string, string>
): void => {
  const root = document.documentElement;
  
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

/**
 * Generate complementary colors for gradients
 */
export const generateComplementaryColors = (baseColor: string): string[] => {
  // Simple color manipulation - in production, you might want to use a color library
  const colors = [baseColor];
  
  // Generate variations by adjusting HSL values
  const variations = [
    adjustColorBrightness(baseColor, 20),
    adjustColorBrightness(baseColor, -20),
    adjustColorSaturation(baseColor, 20),
    adjustColorSaturation(baseColor, -20),
  ];
  
  return [...colors, ...variations];
};

/**
 * Adjust color brightness
 */
export const adjustColorBrightness = (color: string, percent: number): string => {
  // Simple brightness adjustment - this is a basic implementation
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
};

/**
 * Adjust color saturation
 */
export const adjustColorSaturation = (color: string, percent: number): string => {
  // Basic saturation adjustment - simplified implementation
  return color; // Placeholder - implement proper HSL conversion
};

/**
 * Convert hex to RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Convert RGB to hex
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * Generate random gradient
 */
export const generateRandomGradient = (
  type: 'linear' | 'radial' | 'conic' = 'linear',
  colorCount: number = 3
): GradientConfig => {
  const colors = [];
  const directions = ['45deg', '90deg', '135deg', '180deg', '225deg', '270deg'];
  
  for (let i = 0; i < colorCount; i++) {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 50 + Math.floor(Math.random() * 50);
    const lightness = 40 + Math.floor(Math.random() * 40);
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  
  return {
    type,
    direction: type === 'linear' ? directions[Math.floor(Math.random() * directions.length)] : undefined,
    colors,
  };
};

/**
 * Blend two colors
 */
export const blendColors = (color1: string, color2: string, ratio: number = 0.5): string => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return color1;
  
  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);
  
  return rgbToHex(r, g, b);
};

/**
 * Generate gradient from image colors (placeholder for future implementation)
 */
export const generateGradientFromImage = async (
  imageUrl: string
): Promise<GradientConfig> => {
  // Placeholder implementation
  // In production, you would extract dominant colors from the image
  return generateRandomGradient();
};

/**
 * Export all gradients as CSS variables
 */
export const exportGradientCSS = (
  gradients: Record<string, GradientConfig>
): string => {
  let css = ':root {\n';
  
  Object.entries(gradients).forEach(([name, config]) => {
    css += `  --gradient-${name}: ${generateGradient(config)};\n`;
  });
  
  css += '}\n';
  
  return css;
};

/**
 * Utility class for gradient management
 */
export class GradientManager {
  private gradients: Map<string, GradientConfig> = new Map();
  
  add(name: string, gradient: GradientConfig): void {
    this.gradients.set(name, gradient);
  }
  
  get(name: string): GradientConfig | undefined {
    return this.gradients.get(name);
  }
  
  remove(name: string): boolean {
    return this.gradients.delete(name);
  }
  
  list(): string[] {
    return Array.from(this.gradients.keys());
  }
  
  generateCSS(): string {
    const gradientObject: Record<string, GradientConfig> = {};
    this.gradients.forEach((gradient, name) => {
      gradientObject[name] = gradient;
    });
    return exportGradientCSS(gradientObject);
  }
  
  applyToElement(element: HTMLElement, gradientName: string): void {
    const gradient = this.get(gradientName);
    if (gradient) {
      element.style.background = generateGradient(gradient);
    }
  }
}

// Predefined gradient presets
export const GRADIENT_PRESETS = {
  // Islamic gradients
  islamicGreen: {
    type: 'linear' as const,
    direction: '135deg',
    colors: ['#059669', '#10B981', '#34D399'],
  },
  islamicGold: {
    type: 'linear' as const,
    direction: '45deg',
    colors: ['#F59E0B', '#FBBF24', '#FCD34D'],
  },
  islamicSapphire: {
    type: 'radial' as const,
    colors: ['#1E40AF', '#3B82F6', '#60A5FA'],
  },
  
  // Modern gradients
  modernVibrant: {
    type: 'linear' as const,
    direction: '135deg',
    colors: ['#8B5CF6', '#EC4899', '#06B6D4'],
  },
  modernNeon: {
    type: 'conic' as const,
    colors: ['#00F5FF', '#FF1493', '#ADFF2F', '#00F5FF'],
  },
  
  // Nature gradients
  forestGreen: {
    type: 'linear' as const,
    direction: '180deg',
    colors: ['#059669', '#047857', '#065F46'],
  },
  oceanBlue: {
    type: 'radial' as const,
    colors: ['#0891B2', '#06B6D4', '#22D3EE'],
  },
  
  // Sunset gradients
  warmSunset: {
    type: 'linear' as const,
    direction: '135deg',
    colors: ['#EA580C', '#EC4899', '#F59E0B'],
  },
  
  // Minimal gradients
  subtleGray: {
    type: 'linear' as const,
    direction: '180deg',
    colors: ['rgba(55,65,81,0.1)', 'rgba(107,114,128,0.05)'],
  },
};

export default {
  generateGradient,
  generateGradientVariations,
  generateAnimatedGradient,
  generateMeshGradient,
  generateGradientVariables,
  applyGradientVariables,
  generateRandomGradient,
  GradientManager,
  GRADIENT_PRESETS,
};