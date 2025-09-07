'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ThemeSelector from './ThemeSelector';
import { Theme, getCurrentTheme, applyTheme } from '@/lib/theme-presets';
import { generateGradient } from '@/lib/gradient-generator';

/**
 * Example component showing how to use the theme system
 * This demonstrates theme application, gradient usage, and theme-aware components
 */
export const ExampleThemeUsage: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getCurrentTheme());
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme System Demo</CardTitle>
          <CardDescription>
            This example shows how to use the comprehensive theme system with gradient presets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Theme selector toggle */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Current Theme: {currentTheme.name}</h3>
              <Button
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                style={{ background: generateGradient(currentTheme.gradients.button) }}
                className="text-white"
              >
                {showThemeSelector ? 'Hide' : 'Show'} Theme Selector
              </Button>
            </div>

            {/* Theme info display */}
            <Card className="border-2" style={{ borderColor: currentTheme.colors.primary }}>
              <CardHeader
                style={{ 
                  background: generateGradient(currentTheme.gradients.primary),
                  color: 'white'
                }}
              >
                <CardTitle>Theme Information</CardTitle>
              </CardHeader>
              <CardContent className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Details</h4>
                    <p><strong>Name:</strong> {currentTheme.name}</p>
                    <p><strong>Category:</strong> {currentTheme.category}</p>
                    <p><strong>Description:</strong> {currentTheme.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Colors</h4>
                    <div className="flex space-x-2 mb-2">
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: currentTheme.colors.primary }}
                        title="Primary"
                      />
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: currentTheme.colors.secondary }}
                        title="Secondary"
                      />
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: currentTheme.colors.accent }}
                        title="Accent"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sample components with theme */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Primary gradient card */}
              <Card>
                <div 
                  className="h-24 rounded-t-lg"
                  style={{ background: generateGradient(currentTheme.gradients.primary) }}
                />
                <CardContent className="mt-4">
                  <h4 className="font-semibold">Primary Gradient</h4>
                  <p className="text-sm text-gray-600">
                    {currentTheme.gradients.primary.type} gradient with {currentTheme.gradients.primary.colors.length} colors
                  </p>
                </CardContent>
              </Card>

              {/* Secondary gradient card */}
              <Card>
                <div 
                  className="h-24 rounded-t-lg"
                  style={{ background: generateGradient(currentTheme.gradients.secondary) }}
                />
                <CardContent className="mt-4">
                  <h4 className="font-semibold">Secondary Gradient</h4>
                  <p className="text-sm text-gray-600">
                    {currentTheme.gradients.secondary.type} gradient with {currentTheme.gradients.secondary.colors.length} colors
                  </p>
                </CardContent>
              </Card>

              {/* Hero gradient card */}
              <Card>
                <div 
                  className="h-24 rounded-t-lg"
                  style={{ background: generateGradient(currentTheme.gradients.hero) }}
                />
                <CardContent className="mt-4">
                  <h4 className="font-semibold">Hero Gradient</h4>
                  <p className="text-sm text-gray-600">
                    {currentTheme.gradients.hero.type} gradient with {currentTheme.gradients.hero.colors.length} colors
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sample buttons */}
            <div className="space-y-2">
              <h4 className="font-semibold">Sample Buttons</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  style={{ background: generateGradient(currentTheme.gradients.button) }}
                  className="text-white"
                >
                  Gradient Button
                </Button>
                <Button
                  variant="outline"
                  style={{ 
                    borderColor: currentTheme.colors.primary,
                    color: currentTheme.colors.primary
                  }}
                >
                  Outlined Button
                </Button>
                <Button
                  style={{ backgroundColor: currentTheme.colors.secondary }}
                  className="text-white"
                >
                  Secondary Button
                </Button>
              </div>
            </div>

            {/* CSS Variables display */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Applied CSS Variables</CardTitle>
                <CardDescription>
                  These variables are automatically applied to the document root when a theme is selected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
                  <div>
                    <h5 className="font-semibold mb-2">Colors</h5>
                    <div className="space-y-1">
                      <div>--color-primary: {currentTheme.colors.primary}</div>
                      <div>--color-secondary: {currentTheme.colors.secondary}</div>
                      <div>--color-accent: {currentTheme.colors.accent}</div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Gradients</h5>
                    <div className="space-y-1">
                      <div>--gradient-primary: {generateGradient(currentTheme.gradients.primary)}</div>
                      <div className="truncate">--gradient-secondary: {generateGradient(currentTheme.gradients.secondary)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theme selector */}
            {showThemeSelector && (
              <Card>
                <CardHeader>
                  <CardTitle>Theme Selector</CardTitle>
                  <CardDescription>
                    Choose from predefined themes or create custom ones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ThemeSelector
                    onThemeChange={handleThemeChange}
                    showCategories={true}
                    showCustomThemes={true}
                    allowCustomCreation={true}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExampleThemeUsage;