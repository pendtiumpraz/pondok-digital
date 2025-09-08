'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  ServerIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Pondok Digital',
      siteUrl: 'https://pondok-digital.com',
      adminEmail: 'admin@pondok-digital.com',
      timezone: 'Asia/Jakarta',
      language: 'id',
      maintenanceMode: false,
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireSpecialChar: true,
      requireNumber: true,
      maxLoginAttempts: 5,
      ipWhitelist: '',
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'noreply@pondok-digital.com',
      smtpPassword: '********',
      emailFrom: 'Pondok Digital <noreply@pondok-digital.com>',
      enableEmailNotifications: true,
    },
    billing: {
      currency: 'IDR',
      taxRate: 11,
      trialDays: 14,
      enableAutoRenewal: true,
      sendInvoiceEmail: true,
      paymentGateway: 'midtrans',
    },
    notifications: {
      newUserRegistration: true,
      newSubscription: true,
      paymentReceived: true,
      systemErrors: true,
      dailyReport: false,
      weeklyReport: true,
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      backupRetention: 30,
      backupLocation: '/backups',
      lastBackup: '2024-01-15 02:00:00',
    }
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSave = async (section: string) => {
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleTestEmail = async () => {
    // Simulate sending test email
    alert('Test email sent to ' + settings.email.emailFrom);
  };

  const handleBackupNow = async () => {
    // Simulate backup
    alert('Backup started. This may take a few minutes.');
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-2">Configure system-wide settings and preferences</p>
          </div>
          {saveStatus === 'saved' && (
            <Badge variant="success" className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4" />
              Settings saved successfully
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
              <h2 className="text-lg font-semibold">General Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, siteName: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={settings.general.siteUrl}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, siteUrl: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={settings.general.adminEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, adminEmail: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={settings.general.timezone}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, timezone: e.target.value }
                    })}
                  >
                    <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                    <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                    <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  <p className="text-sm text-gray-600">Enable to show maintenance page to users</p>
                </div>
                <Switch
                  id="maintenance"
                  checked={settings.general.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    general: { ...settings.general, maintenanceMode: checked }
                  })}
                />
              </div>

              <Button onClick={() => handleSave('general')} className="w-full">
                Save General Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheckIcon className="w-6 h-6 text-gray-600" />
              <h2 className="text-lg font-semibold">Security Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                  <Switch
                    id="twoFactor"
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: { ...settings.security, twoFactorAuth: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="specialChar">Require Special Characters in Password</Label>
                  <Switch
                    id="specialChar"
                    checked={settings.security.requireSpecialChar}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: { ...settings.security, requireSpecialChar: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="requireNumber">Require Numbers in Password</Label>
                  <Switch
                    id="requireNumber"
                    checked={settings.security.requireNumber}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: { ...settings.security, requireNumber: checked }
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ipWhitelist">IP Whitelist (comma separated)</Label>
                <Textarea
                  id="ipWhitelist"
                  placeholder="192.168.1.1, 10.0.0.1"
                  value={settings.security.ipWhitelist}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, ipWhitelist: e.target.value }
                  })}
                />
              </div>

              <Button onClick={() => handleSave('security')} className="w-full">
                Save Security Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <EnvelopeIcon className="w-6 h-6 text-gray-600" />
              <h2 className="text-lg font-semibold">Email Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.email.smtpHost}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtpHost: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtpPort: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={settings.email.smtpUser}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtpUser: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtpPassword: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="emailFrom">From Email</Label>
                <Input
                  id="emailFrom"
                  value={settings.email.emailFrom}
                  onChange={(e) => setSettings({
                    ...settings,
                    email: { ...settings.email, emailFrom: e.target.value }
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="enableEmail">Enable Email Notifications</Label>
                  <p className="text-sm text-gray-600">Send system emails to users</p>
                </div>
                <Switch
                  id="enableEmail"
                  checked={settings.email.enableEmailNotifications}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    email: { ...settings.email, enableEmailNotifications: checked }
                  })}
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={() => handleSave('email')} className="flex-1">
                  Save Email Settings
                </Button>
                <Button onClick={handleTestEmail} variant="outline">
                  Send Test Email
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <CurrencyDollarIcon className="w-6 h-6 text-gray-600" />
              <h2 className="text-lg font-semibold">Billing Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={settings.billing.currency}
                    onChange={(e) => setSettings({
                      ...settings,
                      billing: { ...settings.billing, currency: e.target.value }
                    })}
                  >
                    <option value="IDR">IDR - Indonesian Rupiah</option>
                    <option value="USD">USD - US Dollar</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={settings.billing.taxRate}
                    onChange={(e) => setSettings({
                      ...settings,
                      billing: { ...settings.billing, taxRate: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trialDays">Trial Period (days)</Label>
                  <Input
                    id="trialDays"
                    type="number"
                    value={settings.billing.trialDays}
                    onChange={(e) => setSettings({
                      ...settings,
                      billing: { ...settings.billing, trialDays: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="paymentGateway">Payment Gateway</Label>
                  <select
                    id="paymentGateway"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={settings.billing.paymentGateway}
                    onChange={(e) => setSettings({
                      ...settings,
                      billing: { ...settings.billing, paymentGateway: e.target.value }
                    })}
                  >
                    <option value="midtrans">Midtrans</option>
                    <option value="tripay">Tripay</option>
                    <option value="xendit">Xendit</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="autoRenewal">Enable Auto-Renewal</Label>
                  <Switch
                    id="autoRenewal"
                    checked={settings.billing.enableAutoRenewal}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      billing: { ...settings.billing, enableAutoRenewal: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="invoiceEmail">Send Invoice Emails</Label>
                  <Switch
                    id="invoiceEmail"
                    checked={settings.billing.sendInvoiceEmail}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      billing: { ...settings.billing, sendInvoiceEmail: checked }
                    })}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('billing')} className="w-full">
                Save Billing Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <BellIcon className="w-6 h-6 text-gray-600" />
              <h2 className="text-lg font-semibold">Notification Settings</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Choose which notifications to receive</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label htmlFor="newUser">New User Registration</Label>
                    <p className="text-sm text-gray-600">Get notified when a new user registers</p>
                  </div>
                  <Switch
                    id="newUser"
                    checked={settings.notifications.newUserRegistration}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, newUserRegistration: checked }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label htmlFor="newSub">New Subscription</Label>
                    <p className="text-sm text-gray-600">Get notified for new subscriptions</p>
                  </div>
                  <Switch
                    id="newSub"
                    checked={settings.notifications.newSubscription}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, newSubscription: checked }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label htmlFor="payment">Payment Received</Label>
                    <p className="text-sm text-gray-600">Get notified when payments are received</p>
                  </div>
                  <Switch
                    id="payment"
                    checked={settings.notifications.paymentReceived}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, paymentReceived: checked }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label htmlFor="errors">System Errors</Label>
                    <p className="text-sm text-gray-600">Get notified about system errors</p>
                  </div>
                  <Switch
                    id="errors"
                    checked={settings.notifications.systemErrors}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, systemErrors: checked }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label htmlFor="weekly">Weekly Report</Label>
                    <p className="text-sm text-gray-600">Receive weekly summary reports</p>
                  </div>
                  <Switch
                    id="weekly"
                    checked={settings.notifications.weeklyReport}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, weeklyReport: checked }
                    })}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('notifications')} className="w-full">
                Save Notification Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <ServerIcon className="w-6 h-6 text-gray-600" />
              <h2 className="text-lg font-semibold">Backup Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Last Backup</span>
                </div>
                <p className="text-sm text-blue-800">{settings.backup.lastBackup}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="backupFreq">Backup Frequency</Label>
                  <select
                    id="backupFreq"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={settings.backup.backupFrequency}
                    onChange={(e) => setSettings({
                      ...settings,
                      backup: { ...settings.backup, backupFrequency: e.target.value }
                    })}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="retention">Retention Period (days)</Label>
                  <Input
                    id="retention"
                    type="number"
                    value={settings.backup.backupRetention}
                    onChange={(e) => setSettings({
                      ...settings,
                      backup: { ...settings.backup, backupRetention: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="backupLocation">Backup Location</Label>
                <Input
                  id="backupLocation"
                  value={settings.backup.backupLocation}
                  onChange={(e) => setSettings({
                    ...settings,
                    backup: { ...settings.backup, backupLocation: e.target.value }
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="autoBackup">Automatic Backup</Label>
                  <p className="text-sm text-gray-600">Enable automatic scheduled backups</p>
                </div>
                <Switch
                  id="autoBackup"
                  checked={settings.backup.autoBackup}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    backup: { ...settings.backup, autoBackup: checked }
                  })}
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={() => handleSave('backup')} className="flex-1">
                  Save Backup Settings
                </Button>
                <Button onClick={handleBackupNow} variant="outline">
                  Backup Now
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}