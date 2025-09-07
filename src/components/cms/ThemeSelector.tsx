'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Theme,
  THEME_PRESETS,
  applyTheme,
  getCurrentTheme,
  createCustomTheme,
  saveCustomTheme,
  getCustomThemes,
  deleteCustomTheme,
  getAllThemes,
  GradientConfig,
  ThemeColors,
} from '@/lib/theme-presets';
import {
  generateGradient,
  generateRandomGradient,
  GradientManager,
} from '@/lib/gradient-generator';

interface ThemeSelectorProps {
  className?: string;
  onThemeChange?: (theme: Theme) => void;
  showCategories?: boolean;
  showCustomThemes?: boolean;
  allowCustomCreation?: boolean;
}

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => (
  <div className="flex flex-col space-y-2">
    <Label className="text-sm font-medium">{label}</Label>
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded border cursor-pointer"
      />
      <Input
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 font-mono text-sm"
        placeholder="#000000"
      />
    </div>
  </div>
);

interface GradientPreviewProps {
  gradient: GradientConfig;
  className?: string;
}

const GradientPreview: React.FC<GradientPreviewProps> = ({ gradient, className }) => (
  <div
    className={cn('w-full h-20 rounded-md border', className)}
    style={{ background: generateGradient(gradient) }}
  />
);

interface ThemeCardProps {
  theme: Theme;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  showPreview?: boolean;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ 
  theme, 
  isSelected, 
  onSelect, 
  onDelete, 
  showPreview = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-lg',
        isSelected && 'ring-2 ring-primary-500 ring-offset-2'
      )}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">{theme.name}</CardTitle>
            <CardDescription className="text-xs mt-1">
              {theme.description}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {theme.category}
            </Badge>
            {theme.category === 'custom' && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                ×
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      {showPreview && (
        <CardContent className="pt-0">
          {/* Color palette preview */}
          <div className="flex space-x-1 mb-3">
            <div
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <div
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: theme.colors.secondary }}
            />
            <div
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: theme.colors.accent }}
            />
          </div>
          
          {/* Gradient previews */}
          <div className="space-y-2">
            <GradientPreview gradient={theme.gradients.primary} className="h-4" />
            <GradientPreview gradient={theme.gradients.secondary} className="h-4" />
          </div>
          
          {/* Sample text preview */}
          <div 
            className="mt-3 p-3 rounded text-sm"
            style={{ 
              color: theme.colors.text,
              backgroundColor: theme.colors.surface,
            }}
          >
            <div className="font-semibold">Sample Heading</div>
            <div className="text-xs opacity-75">Sample body text content</div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

interface CustomThemeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  baseTheme?: Theme;
  onSave: (theme: Theme) => void;
}

const CustomThemeEditor: React.FC<CustomThemeEditorProps> = ({
  isOpen,
  onClose,
  baseTheme,
  onSave,
}) => {
  const [customTheme, setCustomTheme] = useState<Partial<Theme>>(
    baseTheme || {
      name: '',
      description: '',
      category: 'custom',
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
          colors: ['#059669', '#10B981'],
        },
        secondary: {
          type: 'linear',
          direction: '45deg',
          colors: ['#F59E0B', '#FBBF24'],
        },
        hero: {
          type: 'linear',
          direction: '135deg',
          colors: ['#059669', '#10B981'],
        },
        card: {
          type: 'linear',
          direction: '180deg',
          colors: ['rgba(255,255,255,0.9)', 'rgba(249,250,251,0.8)'],
        },
        button: {
          type: 'linear',
          direction: '135deg',
          colors: ['#059669', '#10B981'],
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
      borderRadius: 'md',
      shadows: 'soft',
    }
  );

  const updateColors = (key: keyof ThemeColors, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors!,
        [key]: value,
      },
    }));
  };

  const updateGradient = (key: keyof Theme['gradients'], gradient: Partial<GradientConfig>) => {
    setCustomTheme(prev => ({
      ...prev,
      gradients: {
        ...prev.gradients!,
        [key]: {
          ...prev.gradients![key],
          ...gradient,
        },
      },
    }));
  };

  const generateRandomColors = () => {
    const randomGradient = generateRandomGradient();
    const [primary, secondary] = randomGradient.colors;
    
    setCustomTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors!,
        primary,
        secondary,
        accent: randomGradient.colors[2] || primary,
      },
      gradients: {
        ...prev.gradients!,
        primary: randomGradient,
        secondary: {
          ...randomGradient,
          colors: [secondary, primary],
        },
      },
    }));
  };

  const handleSave = () => {
    if (!customTheme.name) return;
    
    const theme = createCustomTheme(THEME_PRESETS[0], customTheme);
    onSave(theme);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Theme</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Theme Settings */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="theme-name">Theme Name</Label>
                <Input
                  id="theme-name"
                  value={customTheme.name || ''}
                  onChange={(e) => setCustomTheme(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Custom Theme"
                />
              </div>
              
              <div>
                <Label htmlFor="theme-description">Description</Label>
                <Textarea
                  id="theme-description"
                  value={customTheme.description || ''}
                  onChange={(e) => setCustomTheme(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="A beautiful custom theme..."
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <Button onClick={generateRandomColors} variant="outline" size="sm">
                  Generate Random Colors
                </Button>
              </div>
            </div>

            {/* Color Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold">Colors</h3>
              <div className="grid grid-cols-2 gap-4">
                <ColorPicker
                  label="Primary"
                  color={customTheme.colors?.primary || '#059669'}
                  onChange={(color) => updateColors('primary', color)}
                />
                <ColorPicker
                  label="Secondary"
                  color={customTheme.colors?.secondary || '#F59E0B'}
                  onChange={(color) => updateColors('secondary', color)}
                />
                <ColorPicker
                  label="Accent"
                  color={customTheme.colors?.accent || '#10B981'}
                  onChange={(color) => updateColors('accent', color)}
                />
                <ColorPicker
                  label="Background"
                  color={customTheme.colors?.background || '#FFFFFF'}
                  onChange={(color) => updateColors('background', color)}
                />
              </div>
            </div>

            {/* Gradient Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold">Gradients</h3>
              <div className="space-y-4">
                {Object.entries(customTheme.gradients || {}).map(([key, gradient]) => (
                  <div key={key} className="space-y-2">
                    <Label className="capitalize">{key} Gradient</Label>
                    <div className="flex space-x-2">
                      <Select
                        value={gradient.type}
                        onValueChange={(value) =>
                          updateGradient(key as keyof Theme['gradients'], { type: value as 'linear' | 'radial' | 'conic' })
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linear">Linear</SelectItem>
                          <SelectItem value="radial">Radial</SelectItem>
                          <SelectItem value="conic">Conic</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {gradient.type === 'linear' && (
                        <Input
                          value={gradient.direction || '135deg'}
                          onChange={(e) => updateGradient(key as keyof Theme['gradients'], { direction: e.target.value })}
                          placeholder="135deg"
                          className="w-20"
                        />
                      )}
                    </div>
                    <GradientPreview gradient={gradient} />
                  </div>
                ))}
              </div>
            </div>

            {/* Style Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold">Style Options</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Border Radius</Label>
                  <Select
                    value={customTheme.borderRadius}
                    onValueChange={(value) =>
                      setCustomTheme(prev => ({ ...prev, borderRadius: value as Theme['borderRadius'] }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Shadows</Label>
                  <Select
                    value={customTheme.shadows}
                    onValueChange={(value) =>
                      setCustomTheme(prev => ({ ...prev, shadows: value as Theme['shadows'] }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="soft">Soft</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="strong">Strong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-4">
            <h3 className="font-semibold">Live Preview</h3>
            <div className="border rounded-lg p-4 space-y-4">
              {/* Color palette */}
              <div className="flex space-x-2">
                {customTheme.colors && Object.entries(customTheme.colors).map(([key, color]) => (
                  <div key={key} className="text-center">
                    <div
                      className="w-8 h-8 rounded border mx-auto"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                ))}
              </div>

              {/* Gradient previews */}
              <div className="space-y-2">
                {customTheme.gradients && Object.entries(customTheme.gradients).map(([key, gradient]) => (
                  <div key={key}>
                    <Label className="text-xs capitalize">{key}</Label>
                    <GradientPreview gradient={gradient} className="h-6" />
                  </div>
                ))}
              </div>

              {/* Sample components */}
              <div className="space-y-3">
                <div
                  className="p-4 rounded"
                  style={{
                    backgroundColor: customTheme.colors?.surface,
                    color: customTheme.colors?.text,
                  }}
                >
                  <h4 className="font-semibold mb-2">Sample Card</h4>
                  <p className="text-sm opacity-75">This is how your content will look with the selected theme.</p>
                </div>

                <div
                  className="p-3 rounded text-white text-center font-medium"
                  style={{ background: generateGradient(customTheme.gradients?.button || customTheme.gradients?.primary!) }}
                >
                  Sample Button
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!customTheme.name}>
            Save Theme
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  className,
  onThemeChange,
  showCategories = true,
  showCustomThemes = true,
  allowCustomCreation = true,
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => getCurrentTheme());
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Theme['category'] | 'all'>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | undefined>();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (showCustomThemes) {
      setCustomThemes(getCustomThemes());
    }
  }, [showCustomThemes]);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
  }, []);

  const allThemes = [...THEME_PRESETS, ...customThemes];
  
  const filteredThemes = selectedCategory === 'all' 
    ? allThemes 
    : allThemes.filter(theme => theme.category === selectedCategory);

  const categories: Array<{ value: Theme['category'] | 'all'; label: string }> = [
    { value: 'all', label: 'All Themes' },
    { value: 'islamic', label: 'Islamic' },
    { value: 'modern', label: 'Modern' },
    { value: 'classic', label: 'Classic' },
    { value: 'nature', label: 'Nature' },
    { value: 'vibrant', label: 'Vibrant' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'dark', label: 'Dark' },
    ...(showCustomThemes ? [{ value: 'custom' as const, label: 'Custom' }] : []),
  ];

  const handleThemeSelect = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    onThemeChange?.(theme);
  }, [onThemeChange]);

  const handleCustomThemeSave = useCallback((theme: Theme) => {
    saveCustomTheme(theme);
    setCustomThemes(getCustomThemes());
    handleThemeSelect(theme);
  }, [handleThemeSelect]);

  const handleThemeDelete = useCallback((themeId: string) => {
    deleteCustomTheme(themeId);
    setCustomThemes(getCustomThemes());
  }, []);

  const handleCreateCustomTheme = () => {
    setEditingTheme(undefined);
    setIsEditorOpen(true);
  };

  const handleEditTheme = (theme: Theme) => {
    setEditingTheme(theme);
    setIsEditorOpen(true);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Theme Selector</h2>
          <p className="text-gray-600">Choose a theme to customize the appearance of your CMS</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="dark-mode" className="text-sm">
              Dark Mode
            </Label>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={(checked) => {
                setIsDarkMode(checked);
                localStorage.setItem('darkMode', checked.toString());
                document.documentElement.classList.toggle('dark', checked);
              }}
            />
          </div>
          
          {/* Create Custom Theme Button */}
          {allowCustomCreation && (
            <Button onClick={handleCreateCustomTheme}>
              Create Custom Theme
            </Button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      {showCategories && (
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            {categories.map((category) => (
              <TabsTrigger key={category.value} value={category.value} className="text-xs">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredThemes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isSelected={currentTheme.id === theme.id}
            onSelect={() => handleThemeSelect(theme)}
            onDelete={theme.category === 'custom' ? () => handleThemeDelete(theme.id) : undefined}
            showPreview={true}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredThemes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No themes found in this category.</p>
          {allowCustomCreation && (
            <Button onClick={handleCreateCustomTheme} variant="outline">
              Create Your First Custom Theme
            </Button>
          )}
        </div>
      )}

      {/* Custom Theme Editor */}
      <CustomThemeEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        baseTheme={editingTheme}
        onSave={handleCustomThemeSave}
      />
    </div>
  );
};

export default ThemeSelector;