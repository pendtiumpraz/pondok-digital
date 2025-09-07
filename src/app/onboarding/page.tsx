'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  BuildingOfficeIcon,
  UserIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SparklesIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  Cog6ToothIcon,
  UsersIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface OnboardingData {
  // Step 1: Organization Info
  organizationName: string;
  organizationType: string;
  industry: string;
  size: string;
  
  // Step 2: Admin User
  adminName: string;
  adminEmail: string;
  adminWhatsapp: string;
  
  // Step 3: Plan Selection
  plan: string;
  billingCycle: 'monthly' | 'annual';
  addOns: string[];
  
  // Step 4: Customization
  subdomain: string;
  primaryColor: string;
  logoUrl: string;
}

interface ValidationErrors {
  organizationName?: string;
  organizationType?: string;
  industry?: string;
  size?: string;
  adminName?: string;
  adminEmail?: string;
  adminWhatsapp?: string;
  subdomain?: string;
}

const OnboardingPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [data, setData] = useState<OnboardingData>({
    organizationName: '',
    organizationType: '',
    industry: '',
    size: '',
    adminName: '',
    adminEmail: '',
    adminWhatsapp: '',
    plan: 'pro',
    billingCycle: 'monthly',
    addOns: [],
    subdomain: '',
    primaryColor: '#6366f1',
    logoUrl: '',
  });

  const totalSteps = 4;

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      features: ['Up to 5 users', 'Basic features', '10GB storage'],
      color: 'from-blue-500 to-indigo-600',
      icon: SparklesIcon,
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 79,
      features: ['Up to 25 users', 'Advanced features', '100GB storage'],
      color: 'from-emerald-500 to-green-600',
      icon: BuildingOfficeIcon,
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      features: ['Unlimited users', 'All features', 'Unlimited storage'],
      color: 'from-purple-500 to-pink-600',
      icon: ShieldCheckIcon,
    },
  ];

  const organizationTypes = [
    'Technology Company',
    'Healthcare',
    'Education',
    'Finance',
    'E-commerce',
    'Manufacturing',
    'Non-profit',
    'Government',
    'Other',
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-1000 employees',
    '1000+ employees',
  ];

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

  const updateData = (field: keyof OnboardingData, value: string | string[]) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when field is updated
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateWhatsApp = (phone: string): boolean => {
    // Indonesian phone number validation
    // Should start with +62 or 08 and be 10-15 digits total
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const indonesianRegex = /^(\+62|62|08)[\d]{8,12}$/;
    return indonesianRegex.test(cleanPhone);
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    switch (currentStep) {
      case 1:
        if (!data.organizationName.trim()) {
          newErrors.organizationName = 'Organization name is required';
          isValid = false;
        }
        if (!data.organizationType) {
          newErrors.organizationType = 'Organization type is required';
          isValid = false;
        }
        if (!data.industry.trim()) {
          newErrors.industry = 'Industry is required';
          isValid = false;
        }
        if (!data.size) {
          newErrors.size = 'Company size is required';
          isValid = false;
        }
        break;
      case 2:
        if (!data.adminName.trim()) {
          newErrors.adminName = 'Full name is required';
          isValid = false;
        }
        if (!data.adminEmail.trim()) {
          newErrors.adminEmail = 'Email address is required';
          isValid = false;
        } else if (!validateEmail(data.adminEmail)) {
          newErrors.adminEmail = 'Please enter a valid email address';
          isValid = false;
        }
        if (!data.adminWhatsapp.trim()) {
          newErrors.adminWhatsapp = 'WhatsApp number is required';
          isValid = false;
        } else if (!validateWhatsApp(data.adminWhatsapp)) {
          newErrors.adminWhatsapp = 'Please enter a valid Indonesian WhatsApp number (e.g., +6281234567890 or 081234567890)';
          isValid = false;
        }
        break;
      case 4:
        if (!data.subdomain.trim()) {
          newErrors.subdomain = 'Subdomain is required';
          isValid = false;
        } else if (!/^[a-z0-9-]+$/.test(data.subdomain)) {
          newErrors.subdomain = 'Subdomain can only contain lowercase letters, numbers, and hyphens';
          isValid = false;
        }
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/onboarding/create-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create trial account');
      }

      const result = await response.json();
      
      // Redirect to tenant dashboard
      if (result.tenantSlug) {
        router.push(`/yayasan/${result.tenantSlug}/dashboard`);
      } else {
        // Fallback redirect if slug is not provided
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error creating trial:', error);
      setErrors({ 
        adminEmail: error instanceof Error ? error.message : 'Failed to create trial account. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome to Your SaaS Journey</h1>
            </motion.div>
            
            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Steps */}
          <Card className="p-8 shadow-2xl border-0">
            <AnimatePresence mode="wait">
              {/* Step 1: Organization Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <BuildingOfficeIcon className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your organization</h2>
                    <p className="text-gray-600">Help us customize your experience</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="orgName" className="text-base font-semibold">Organization Name *</Label>
                      <Input
                        id="orgName"
                        placeholder="Enter your organization name"
                        value={data.organizationName}
                        onChange={(e) => updateData('organizationName', e.target.value)}
                        className={`mt-2 h-12 ${errors.organizationName ? 'border-red-500' : ''}`}
                      />
                      {errors.organizationName && (
                        <p className="text-red-500 text-sm mt-1">{errors.organizationName}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-semibold">Organization Type *</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {organizationTypes.slice(0, 6).map((type) => (
                          <button
                            key={type}
                            onClick={() => updateData('organizationType', type)}
                            className={`p-3 text-sm rounded-lg border-2 transition-all ${
                              data.organizationType === type
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : errors.organizationType
                                ? 'border-red-300 hover:border-red-400'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      {errors.organizationType && (
                        <p className="text-red-500 text-sm mt-1">{errors.organizationType}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-semibold">Industry *</Label>
                      <Input
                        placeholder="e.g., Software Development"
                        value={data.industry}
                        onChange={(e) => updateData('industry', e.target.value)}
                        className={`mt-2 h-12 ${errors.industry ? 'border-red-500' : ''}`}
                      />
                      {errors.industry && (
                        <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-semibold">Company Size *</Label>
                      <div className="space-y-2 mt-2">
                        {companySizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => updateData('size', size)}
                            className={`w-full p-3 text-sm rounded-lg border-2 transition-all text-left ${
                              data.size === size
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : errors.size
                                ? 'border-red-300 hover:border-red-400'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      {errors.size && (
                        <p className="text-red-500 text-sm mt-1">{errors.size}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Admin User */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <UserIcon className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Create admin account</h2>
                    <p className="text-gray-600">Set up the main administrator account for your 14-day free trial</p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Free 14-day trial included!</strong> Our sales team will contact you via WhatsApp to help with onboarding and setup.
                      </p>
                    </div>
                  </div>

                  <div className="max-w-md mx-auto space-y-6">
                    <div>
                      <Label htmlFor="adminName" className="text-base font-semibold">Full Name *</Label>
                      <Input
                        id="adminName"
                        placeholder="Enter your full name"
                        value={data.adminName}
                        onChange={(e) => updateData('adminName', e.target.value)}
                        className={`mt-2 h-12 ${errors.adminName ? 'border-red-500' : ''}`}
                      />
                      {errors.adminName && (
                        <p className="text-red-500 text-sm mt-1">{errors.adminName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="adminEmail" className="text-base font-semibold">Email Address *</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="admin@yourcompany.com"
                        value={data.adminEmail}
                        onChange={(e) => updateData('adminEmail', e.target.value)}
                        className={`mt-2 h-12 ${errors.adminEmail ? 'border-red-500' : ''}`}
                      />
                      {errors.adminEmail && (
                        <p className="text-red-500 text-sm mt-1">{errors.adminEmail}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="adminWhatsapp" className="text-base font-semibold">WhatsApp Number *</Label>
                      <Input
                        id="adminWhatsapp"
                        type="tel"
                        placeholder="+6281234567890 or 081234567890"
                        value={data.adminWhatsapp}
                        onChange={(e) => updateData('adminWhatsapp', e.target.value)}
                        className={`mt-2 h-12 ${errors.adminWhatsapp ? 'border-red-500' : ''}`}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Indonesian WhatsApp number for onboarding support
                      </p>
                      {errors.adminWhatsapp && (
                        <p className="text-red-500 text-sm mt-1">{errors.adminWhatsapp}</p>
                      )}
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>What happens next?</strong><br/>
                        1. Your 14-day free trial starts immediately<br/>
                        2. Our sales team will WhatsApp you within 24 hours<br/>
                        3. We'll help you set up and customize your system<br/>
                        4. No payment required until trial ends
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Plan Selection */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <CreditCardIcon className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your plan</h2>
                    <p className="text-gray-600">Select the plan that best fits your needs</p>
                  </div>

                  {/* Billing Toggle */}
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <span className={`font-medium ${data.billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                      Monthly
                    </span>
                    <button
                      onClick={() => updateData('billingCycle', data.billingCycle === 'monthly' ? 'annual' : 'monthly')}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        data.billingCycle === 'annual' ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                          data.billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${data.billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
                        Annual
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Save 17%
                      </span>
                    </div>
                  </div>

                  {/* Plans */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => updateData('plan', plan.id)}
                        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                          data.plan === plan.id
                            ? 'border-indigo-500 bg-indigo-50 scale-105'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                              Most Popular
                            </div>
                          </div>
                        )}
                        
                        <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center mb-4`}>
                          <plan.icon className="w-6 h-6 text-white" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <div className="text-3xl font-bold text-gray-900 mb-4">
                          ${data.billingCycle === 'annual' ? Math.round(plan.price * 0.83) : plan.price}
                          <span className="text-lg text-gray-600">/month</span>
                        </div>
                        
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-gray-600">
                              <CheckCircleIcon className="w-4 h-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Customization */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <PaintBrushIcon className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize your workspace</h2>
                    <p className="text-gray-600">Make it yours with branding and customization</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="subdomain" className="text-base font-semibold">Subdomain *</Label>
                        <div className="mt-2 flex">
                          <Input
                            id="subdomain"
                            placeholder="yourcompany"
                            value={data.subdomain}
                            onChange={(e) => updateData('subdomain', e.target.value.toLowerCase())}
                            className={`h-12 rounded-r-none ${errors.subdomain ? 'border-red-500' : ''}`}
                          />
                          <div className="bg-gray-100 border border-l-0 border-gray-300 px-4 flex items-center rounded-r-md text-gray-600">
                            .pondokdigital.com
                          </div>
                        </div>
                        {errors.subdomain && (
                          <p className="text-red-500 text-sm mt-1">{errors.subdomain}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-base font-semibold">Primary Color *</Label>
                        <div className="grid grid-cols-4 gap-3 mt-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              onClick={() => updateData('primaryColor', color)}
                              className={`w-12 h-12 rounded-xl border-4 transition-all ${
                                data.primaryColor === color
                                  ? 'border-gray-800 scale-110'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="logo" className="text-base font-semibold">Logo URL (Optional)</Label>
                        <Input
                          id="logo"
                          placeholder="https://yourcompany.com/logo.png"
                          value={data.logoUrl}
                          onChange={(e) => updateData('logoUrl', e.target.value)}
                          className="mt-2 h-12"
                        />
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div 
                          className="h-16 flex items-center px-6"
                          style={{ backgroundColor: data.primaryColor }}
                        >
                          <div className="flex items-center gap-3">
                            {data.logoUrl ? (
                              <img src={data.logoUrl} alt="Logo" className="w-8 h-8" />
                            ) : (
                              <div className="w-8 h-8 bg-white/20 rounded-lg" />
                            )}
                            <span className="text-white font-semibold">
                              {data.organizationName || 'Your Company'}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-2">Your custom URL:</div>
                            <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                              https://{data.subdomain || 'yourcompany'}.pondokdigital.com
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}


              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-center space-y-8"
                >
                  <div className="mb-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircleIcon className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Free Trial!</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      Review your information and start your 14-day free trial. No payment required!
                    </p>
                  </div>

                  <div className="max-w-2xl mx-auto">
                    <Card className="p-6 text-left">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Details</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Organization:</span>
                          <div>{data.organizationName}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Plan:</span>
                          <div className="capitalize">{data.plan}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Admin Email:</span>
                          <div>{data.adminEmail}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">WhatsApp:</span>
                          <div>{data.adminWhatsapp}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Workspace URL:</span>
                          <div className="font-mono">https://{data.subdomain}.pondokdigital.com</div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Your 14-day free trial starts immediately</li>
                        <li>• Our sales team will contact you via WhatsApp within 24 hours</li>
                        <li>• We'll help you set up and customize your system</li>
                        <li>• No payment required until your trial period ends</li>
                        <li>• Cancel anytime during the trial with no charges</li>
                      </ul>
                    </div>
                    
                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-4 text-lg disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Creating Your Trial...
                        </>
                      ) : (
                        <>
                          Start My Free Trial
                          <ArrowRightIcon className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                    
                    <p className="text-sm text-gray-600">
                      By starting your trial, you agree to receive WhatsApp messages from our sales team for onboarding support.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            {currentStep < 4 && (
              <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Previous
                </Button>
                
                <Button
                  onClick={nextStep}
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center gap-2 disabled:opacity-50"
                >
                  {currentStep === 3 ? 'Review & Start Trial' : 'Next Step'}
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </div>
            )}
          </Card>

          {/* Trust Indicators */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span>Secure & Trusted</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>14-Day Free Trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5" />
                  <span>Dedicated Support</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;