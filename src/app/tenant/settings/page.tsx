'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  BuildingOfficeIcon,
  UserIcon,
  PaintBrushIcon,
  BellIcon,
  ShieldCheckIcon,
  KeyIcon,
  GlobeAltIcon,
  CogIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

interface TenantSettings {
  // Organization Settings
  organizationName: string;
  industry: string;
  website: string;
  description: string;
  
  // Branding
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  customDomain: string;
  
  // Admin User
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  
  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  slackWebhook: string;
  
  // Security
  twoFactorEnabled: boolean;
  ssoEnabled: boolean;
  sessionTimeout: number;
  passwordPolicy: 'basic' | 'strict' | 'enterprise';
  
  // API
  apiKeysEnabled: boolean;
  webhooksEnabled: boolean;
  rateLimitPerHour: number;
  
  // General
  timezone: string;
  language: string;
  dateFormat: string;
}

const TenantSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('organization');
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState<TenantSettings>({
    organizationName: 'TechCorp Solutions',
    industry: 'Technology',
    website: 'https://techcorp.com',
    description: 'Leading technology solutions provider',
    primaryColor: '#6366f1',
    secondaryColor: '#10b981',
    logoUrl: '',
    faviconUrl: '',
    customDomain: 'techcorp.yoursaas.com',
    adminName: 'John Doe',
    adminEmail: 'john@techcorp.com',
    adminPhone: '+1 (555) 123-4567',
    emailNotifications: true,
    smsNotifications: false,
    slackWebhook: '',
    twoFactorEnabled: true,
    ssoEnabled: false,
    sessionTimeout: 60,
    passwordPolicy: 'strict',
    apiKeysEnabled: true,
    webhooksEnabled: true,
    rateLimitPerHour: 1000,
    timezone: 'America/New_York',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
  });

  const [apiKey] = useState('sk_test_' + 'xxxxxxxxxxxxxxxxxxxx');

  const colorOptions = [
    '#6366f1', // Indigo
    '#059669', // Emerald
    '#dc2626', // Red
    '#7c3aed', // Purple
    '#ea580c', // Orange
    '#0891b2', // Cyan
    '#be123c', // Rose
    '#374151', // Gray
  ];

  const tabs = [
    { id: 'organization', label: 'Organization', icon: BuildingOfficeIcon },
    { id: 'branding', label: 'Branding', icon: PaintBrushIcon },
    { id: 'admin', label: 'Admin User', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'api', label: 'API & Integrations', icon: KeyIcon },
    { id: 'general', label: 'General', icon: CogIcon },
    { id: 'danger', label: 'Danger Zone', icon: ExclamationTriangleIcon },
  ];

  const updateSettings = (field: keyof TenantSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving settings:', settings);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tenant Settings</h1>
              <p className="text-gray-600 mt-1">Manage your organization settings and preferences</p>
            </div>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-8">
              {/* Organization Tab */}
              {activeTab === 'organization' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Organization Information</h2>
                    <p className="text-gray-600">Update your organization's basic information</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="orgName" className="text-base font-semibold">Organization Name</Label>
                      <Input
                        id="orgName"
                        value={settings.organizationName}
                        onChange={(e) => updateSettings('organizationName', e.target.value)}
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="industry" className="text-base font-semibold">Industry</Label>
                      <Input
                        id="industry"
                        value={settings.industry}
                        onChange={(e) => updateSettings('industry', e.target.value)}
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="website" className="text-base font-semibold">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={settings.website}
                        onChange={(e) => updateSettings('website', e.target.value)}
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="customDomain" className="text-base font-semibold">Custom Domain</Label>
                      <Input
                        id="customDomain"
                        value={settings.customDomain}
                        onChange={(e) => updateSettings('customDomain', e.target.value)}
                        className="mt-2 h-12"
                      />
                      <p className="text-sm text-gray-500 mt-1">Your custom domain for accessing the platform</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-base font-semibold">Description</Label>
                    <textarea
                      id="description"
                      value={settings.description}
                      onChange={(e) => updateSettings('description', e.target.value)}
                      rows={4}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </motion.div>
              )}

              {/* Branding Tab */}
              {activeTab === 'branding' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Branding & Appearance</h2>
                    <p className="text-gray-600">Customize your platform's look and feel</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <Label className="text-base font-semibold">Primary Color</Label>
                        <div className="grid grid-cols-4 gap-3 mt-3">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              onClick={() => updateSettings('primaryColor', color)}
                              className={`w-12 h-12 rounded-xl border-4 transition-all ${
                                settings.primaryColor === color
                                  ? 'border-gray-800 scale-110'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <Input
                          value={settings.primaryColor}
                          onChange={(e) => updateSettings('primaryColor', e.target.value)}
                          className="mt-3 h-10 font-mono"
                          placeholder="#6366f1"
                        />
                      </div>

                      <div>
                        <Label className="text-base font-semibold">Secondary Color</Label>
                        <div className="grid grid-cols-4 gap-3 mt-3">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              onClick={() => updateSettings('secondaryColor', color)}
                              className={`w-12 h-12 rounded-xl border-4 transition-all ${
                                settings.secondaryColor === color
                                  ? 'border-gray-800 scale-110'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <Input
                          value={settings.secondaryColor}
                          onChange={(e) => updateSettings('secondaryColor', e.target.value)}
                          className="mt-3 h-10 font-mono"
                          placeholder="#10b981"
                        />
                      </div>

                      <div>
                        <Label htmlFor="logo" className="text-base font-semibold">Logo URL</Label>
                        <Input
                          id="logo"
                          value={settings.logoUrl}
                          onChange={(e) => updateSettings('logoUrl', e.target.value)}
                          className="mt-2 h-12"
                          placeholder="https://example.com/logo.png"
                        />
                      </div>

                      <div>
                        <Label htmlFor="favicon" className="text-base font-semibold">Favicon URL</Label>
                        <Input
                          id="favicon"
                          value={settings.faviconUrl}
                          onChange={(e) => updateSettings('faviconUrl', e.target.value)}
                          className="mt-2 h-12"
                          placeholder="https://example.com/favicon.ico"
                        />
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="space-y-6">
                      <div>
                        <Label className="text-base font-semibold">Preview</Label>
                        <div className="mt-3 bg-gray-100 p-6 rounded-xl">
                          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div 
                              className="h-16 flex items-center px-6"
                              style={{ backgroundColor: settings.primaryColor }}
                            >
                              <div className="flex items-center gap-3">
                                {settings.logoUrl ? (
                                  <img src={settings.logoUrl} alt="Logo" className="w-8 h-8" />
                                ) : (
                                  <div className="w-8 h-8 bg-white/20 rounded-lg" />
                                )}
                                <span className="text-white font-semibold">
                                  {settings.organizationName}
                                </span>
                              </div>
                            </div>
                            <div className="p-6">
                              <Button 
                                style={{ backgroundColor: settings.secondaryColor }}
                                className="text-white mb-4"
                              >
                                Sample Button
                              </Button>
                              <p className="text-gray-600">
                                This is how your platform will look with the selected colors.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Admin User Tab */}
              {activeTab === 'admin' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin User Settings</h2>
                    <p className="text-gray-600">Manage the primary administrator account</p>
                  </div>

                  <div className="max-w-md space-y-6">
                    <div>
                      <Label htmlFor="adminName" className="text-base font-semibold">Full Name</Label>
                      <Input
                        id="adminName"
                        value={settings.adminName}
                        onChange={(e) => updateSettings('adminName', e.target.value)}
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="adminEmail" className="text-base font-semibold">Email Address</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={settings.adminEmail}
                        onChange={(e) => updateSettings('adminEmail', e.target.value)}
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="adminPhone" className="text-base font-semibold">Phone Number</Label>
                      <Input
                        id="adminPhone"
                        type="tel"
                        value={settings.adminPhone}
                        onChange={(e) => updateSettings('adminPhone', e.target.value)}
                        className="mt-2 h-12"
                      />
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <Button variant="outline" className="w-full">
                        Change Password
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Settings</h2>
                    <p className="text-gray-600">Configure security policies and authentication</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-gray-600 text-sm">Add an extra layer of security to your account</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {settings.twoFactorEnabled && (
                          <Badge variant="success">Enabled</Badge>
                        )}
                        <button
                          onClick={() => updateSettings('twoFactorEnabled', !settings.twoFactorEnabled)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.twoFactorEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              settings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">Single Sign-On (SSO)</h3>
                        <p className="text-gray-600 text-sm">Enable SSO integration with your identity provider</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {settings.ssoEnabled && (
                          <Badge variant="success">Enabled</Badge>
                        )}
                        <button
                          onClick={() => updateSettings('ssoEnabled', !settings.ssoEnabled)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.ssoEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              settings.ssoEnabled ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="sessionTimeout" className="text-base font-semibold">Session Timeout (minutes)</Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          value={settings.sessionTimeout}
                          onChange={(e) => updateSettings('sessionTimeout', parseInt(e.target.value))}
                          className="mt-2 h-12"
                        />
                      </div>

                      <div>
                        <Label className="text-base font-semibold">Password Policy</Label>
                        <select
                          value={settings.passwordPolicy}
                          onChange={(e) => updateSettings('passwordPolicy', e.target.value)}
                          className="mt-2 w-full h-12 border border-gray-300 rounded-md px-3"
                        >
                          <option value="basic">Basic</option>
                          <option value="strict">Strict</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* API Tab */}
              {activeTab === 'api' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">API & Integrations</h2>
                    <p className="text-gray-600">Configure API access and third-party integrations</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="font-semibold text-gray-900">API Access</h4>
                            <p className="text-gray-600 text-sm">Enable API access for your organization</p>
                          </div>
                          <button
                            onClick={() => updateSettings('apiKeysEnabled', !settings.apiKeysEnabled)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              settings.apiKeysEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                settings.apiKeysEnabled ? 'translate-x-6' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        </div>

                        {settings.apiKeysEnabled && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                              <Label className="text-base font-semibold">API Key</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowApiKey(!showApiKey)}
                              >
                                {showApiKey ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                              </Button>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                value={showApiKey ? apiKey : '••••••••••••••••••••••••••••••••'}
                                readOnly
                                className="font-mono"
                              />
                              <Button variant="outline">
                                Regenerate
                              </Button>
                            </div>
                          </div>
                        )}

                        <div>
                          <Label htmlFor="rateLimit" className="text-base font-semibold">Rate Limit (requests per hour)</Label>
                          <Input
                            id="rateLimit"
                            type="number"
                            value={settings.rateLimitPerHour}
                            onChange={(e) => updateSettings('rateLimitPerHour', parseInt(e.target.value))}
                            className="mt-2 h-12"
                            disabled={!settings.apiKeysEnabled}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhooks</h3>
                      
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-900">Webhook Support</h4>
                          <p className="text-gray-600 text-sm">Enable webhooks for real-time notifications</p>
                        </div>
                        <button
                          onClick={() => updateSettings('webhooksEnabled', !settings.webhooksEnabled)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.webhooksEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              settings.webhooksEnabled ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Danger Zone Tab */}
              {activeTab === 'danger' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Danger Zone</h2>
                    <p className="text-gray-600">Irreversible and destructive actions</p>
                  </div>

                  <div className="space-y-6">
                    <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50">
                      <div className="flex items-start gap-4">
                        <ExclamationTriangleIcon className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-red-900 mb-2">Delete Organization</h3>
                          <p className="text-red-700 mb-4">
                            Permanently delete your organization and all associated data. This action cannot be undone.
                          </p>
                          <ul className="text-red-700 text-sm mb-4 space-y-1">
                            <li>• All user data will be permanently deleted</li>
                            <li>• All settings and configurations will be lost</li>
                            <li>• Custom domain will be released</li>
                            <li>• Active subscriptions will be cancelled</li>
                          </ul>
                          <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Delete Organization
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="border-2 border-orange-200 rounded-lg p-6 bg-orange-50">
                      <div className="flex items-start gap-4">
                        <ExclamationTriangleIcon className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-orange-900 mb-2">Reset All Settings</h3>
                          <p className="text-orange-700 mb-4">
                            Reset all settings to default values. This will not delete your data but will revert all configurations.
                          </p>
                          <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                            Reset Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* General Tab */}
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">General Settings</h2>
                    <p className="text-gray-600">Configure general platform preferences</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="timezone" className="text-base font-semibold">Timezone</Label>
                      <select
                        id="timezone"
                        value={settings.timezone}
                        onChange={(e) => updateSettings('timezone', e.target.value)}
                        className="mt-2 w-full h-12 border border-gray-300 rounded-md px-3"
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="language" className="text-base font-semibold">Language</Label>
                      <select
                        id="language"
                        value={settings.language}
                        onChange={(e) => updateSettings('language', e.target.value)}
                        className="mt-2 w-full h-12 border border-gray-300 rounded-md px-3"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="dateFormat" className="text-base font-semibold">Date Format</Label>
                      <select
                        id="dateFormat"
                        value={settings.dateFormat}
                        onChange={(e) => updateSettings('dateFormat', e.target.value)}
                        className="mt-2 w-full h-12 border border-gray-300 rounded-md px-3"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Settings</h2>
                    <p className="text-gray-600">Configure how you receive notifications</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                        <p className="text-gray-600 text-sm">Receive important updates via email</p>
                      </div>
                      <button
                        onClick={() => updateSettings('emailNotifications', !settings.emailNotifications)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.emailNotifications ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">SMS Notifications</h3>
                        <p className="text-gray-600 text-sm">Receive urgent alerts via SMS</p>
                      </div>
                      <button
                        onClick={() => updateSettings('smsNotifications', !settings.smsNotifications)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.smsNotifications ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            settings.smsNotifications ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <Label htmlFor="slackWebhook" className="text-base font-semibold">Slack Webhook URL</Label>
                      <Input
                        id="slackWebhook"
                        value={settings.slackWebhook}
                        onChange={(e) => updateSettings('slackWebhook', e.target.value)}
                        className="mt-2 h-12"
                        placeholder="https://hooks.slack.com/services/..."
                      />
                      <p className="text-sm text-gray-500 mt-1">Send notifications to your Slack channel</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantSettingsPage;