# Comprehensive Theme System Documentation

This theme system provides a powerful, flexible way to manage visual themes for the CMS with gradient presets, custom color schemes, and dynamic theme switching.

## Overview

The theme system consists of three main components:

1. **Theme Presets** (`src/lib/theme-presets.ts`) - Predefined themes with colors, gradients, and styling
2. **Gradient Generator** (`src/lib/gradient-generator.ts`) - Utilities for creating and managing CSS gradients
3. **Theme Selector** (`src/components/cms/ThemeSelector.tsx`) - React component for theme selection and customization

## Files Created

### Core Files

- `src/lib/theme-presets.ts` - Theme definitions and management functions
- `src/lib/gradient-generator.ts` - Gradient generation and manipulation utilities
- `src/lib/theme-types.ts` - Extended TypeScript types for advanced theming
- `src/components/cms/ThemeSelector.tsx` - Theme selector UI component
- `src/components/cms/example-theme-usage.tsx` - Usage example and demo

## Features

### ✨ Predefined Themes (10+ themes included)

#### Islamic Themes
- **Islamic Emerald** - Traditional green with golden accents
- **Islamic Sapphire** - Deep blue with silver accents

#### Modern Themes
- **Modern Gradient** - Contemporary vibrant colors
- **Modern Neon** - Futuristic neon colors with dark theme

#### Classic Themes
- **Classic Royal** - Royal purple and gold combination

#### Nature Themes
- **Nature Forest** - Earth tones inspired by forests
- **Nature Ocean** - Calming blues and teals

#### Other Categories
- **Vibrant Sunset** - Warm sunset colors
- **Minimal Monochrome** - Clean monochrome design
- **Dark Purple** - Elegant dark theme with purple accents

### 🎨 Theme Features

Each theme includes:
- **Primary, Secondary, and Accent Colors** with light/dark variants
- **5 Gradient Types**: Primary, Secondary, Hero, Card, and Button gradients
- **Typography Settings** with font families, weights, and fallbacks
- **Border Radius and Shadow** configurations
- **Light/Dark Mode** support

### 🌈 Gradient System

Advanced gradient features:
- **Linear, Radial, and Conic** gradient types
- **Custom direction and color stops**
- **Animated gradients** with keyframe support
- **Mesh gradients** for complex effects
- **CSS variable export** for easy styling

### 🛠 Custom Theme Creation

- **Visual theme editor** with live preview
- **Color picker integration**
- **Gradient customization**
- **Random color generation**
- **Theme import/export**
- **Custom theme persistence**

## Usage

### Basic Theme Application

```typescript
import { applyTheme, getThemeById } from '@/lib/theme-presets';

// Apply a predefined theme
const islamicTheme = getThemeById('islamic-emerald');
if (islamicTheme) {
  applyTheme(islamicTheme);
}
```

### Using the Theme Selector Component

```tsx
import ThemeSelector from '@/components/cms/ThemeSelector';

export function MyComponent() {
  const handleThemeChange = (theme) => {
    console.log('Theme changed to:', theme.name);
  };

  return (
    <ThemeSelector
      onThemeChange={handleThemeChange}
      showCategories={true}
      showCustomThemes={true}
      allowCustomCreation={true}
    />
  );
}
```

### Generating Gradients

```typescript
import { generateGradient, generateRandomGradient } from '@/lib/gradient-generator';

// Generate a linear gradient
const gradient = generateGradient({
  type: 'linear',
  direction: '135deg',
  colors: ['#059669', '#10B981', '#34D399'],
  stops: [0, 50, 100]
});

// Use in CSS
element.style.background = gradient;

// Generate random gradient
const randomGradient = generateRandomGradient('linear', 3);
```

### Creating Custom Themes

```typescript
import { createCustomTheme, saveCustomTheme } from '@/lib/theme-presets';

const customTheme = createCustomTheme(baseTheme, {
  name: 'My Custom Theme',
  description: 'A beautiful custom theme',
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#45B7D1'
  },
  gradients: {
    primary: {
      type: 'linear',
      direction: '135deg',
      colors: ['#FF6B6B', '#4ECDC4']
    }
  }
});

saveCustomTheme(customTheme);
```

### Using CSS Variables

When a theme is applied, CSS custom properties are automatically set:

```css
/* Available CSS variables */
:root {
  --color-primary: #059669;
  --color-secondary: #F59E0B;
  --color-accent: #10B981;
  --gradient-primary: linear-gradient(135deg, #059669, #10B981, #34D399);
  --gradient-secondary: linear-gradient(45deg, #F59E0B, #FBBF24, #FCD34D);
  --font-heading: Inter;
  --font-body: Inter;
  --border-radius: 0.375rem;
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
```

Use them in your components:

```tsx
<div 
  style={{ 
    background: 'var(--gradient-primary)',
    color: 'var(--color-text)',
    borderRadius: 'var(--border-radius)'
  }}
>
  Themed content
</div>
```

### Advanced Gradient Features

```typescript
import { 
  generateAnimatedGradient, 
  generateMeshGradient,
  GradientManager 
} from '@/lib/gradient-generator';

// Animated gradient
const { css, keyframes } = generateAnimatedGradient({
  type: 'linear',
  colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
  duration: '3s',
  direction: 'alternate'
});

// Gradient manager for complex scenarios
const manager = new GradientManager();
manager.add('hero', heroGradient);
manager.add('card', cardGradient);

const cssOutput = manager.generateCSS();
```

## Component Props

### ThemeSelector Props

```typescript
interface ThemeSelectorProps {
  className?: string;
  onThemeChange?: (theme: Theme) => void;
  showCategories?: boolean;        // Default: true
  showCustomThemes?: boolean;      // Default: true
  allowCustomCreation?: boolean;   // Default: true
}
```

## Theme Structure

```typescript
interface Theme {
  id: string;
  name: string;
  description: string;
  category: 'islamic' | 'modern' | 'classic' | 'nature' | 'vibrant' | 'minimal' | 'dark' | 'custom';
  colors: {
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
  };
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
```

## Best Practices

### 1. Theme Consistency
- Use semantic color names (primary, secondary, accent)
- Maintain consistent contrast ratios
- Test themes in both light and dark modes

### 2. Performance
- Themes are cached in localStorage
- CSS variables are applied efficiently
- Gradients use hardware acceleration when possible

### 3. Accessibility
- High contrast options available
- Color blind friendly palettes
- Reduced motion support

### 4. Customization
- Start with a base theme and modify
- Use the theme editor for visual feedback
- Export/import themes for sharing

## Integration with Existing Components

The theme system integrates seamlessly with your existing UI components:

```tsx
// Button with theme colors
<Button 
  style={{ background: 'var(--gradient-primary)' }}
  className="text-white"
>
  Themed Button
</Button>

// Card with theme surface colors
<Card style={{ backgroundColor: 'var(--color-surface)' }}>
  <CardContent style={{ color: 'var(--color-text)' }}>
    Themed content
  </CardContent>
</Card>
```

## Advanced Features

### Plugin System
Extend themes with custom plugins:

```typescript
import { ThemePlugin } from '@/lib/theme-types';

const customPlugin: ThemePlugin = {
  id: 'my-plugin',
  name: 'Custom Components',
  version: '1.0.0',
  hooks: {
    afterThemeChange: (theme) => {
      // Custom logic after theme change
    }
  }
};
```

### Color Harmony Generation
Generate color palettes based on color theory:

```typescript
import { generateComplementaryColors } from '@/lib/gradient-generator';

const palette = generateComplementaryColors('#059669');
// Returns: ['#059669', '#066356', '#088c70', '#0ca678', '#10b981']
```

## Troubleshooting

### Common Issues

1. **Theme not applying**: Check if `applyTheme()` is called after theme selection
2. **CSS variables not working**: Ensure the theme has been applied to document root
3. **Gradients not displaying**: Verify gradient syntax and browser support
4. **Custom themes not persisting**: Check localStorage permissions and quota

### Browser Support

- Modern browsers with CSS custom properties support
- Gradient support for advanced features
- Fallback colors for older browsers

## Examples

See `src/components/cms/example-theme-usage.tsx` for a complete working example that demonstrates:

- Theme selection and application
- Gradient usage in components
- CSS variable integration
- Custom theme creation
- Theme information display

## Contributing

To add new themes:

1. Add theme definition to `THEME_PRESETS` in `theme-presets.ts`
2. Include all required properties (colors, gradients, fonts)
3. Test in both light and dark modes
4. Add appropriate category classification

For new gradient types:
1. Extend `GradientConfig` type
2. Update `generateGradient()` function
3. Add examples and documentation

---

This theme system provides everything needed for a comprehensive, flexible theming solution for your CMS. The combination of predefined themes, custom creation tools, and advanced gradient features makes it suitable for any design requirement.