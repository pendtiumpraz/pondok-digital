'use client';

import { useState } from 'react';
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
  adminPhone: string;
  
  // Step 3: Plan Selection
  plan: string;
  billingCycle: 'monthly' | 'annual';
  addOns: string[];
  
  // Step 4: Customization
  subdomain: string;
  primaryColor: string;
  logoUrl: string;
  
  // Step 5: Payment
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
}

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    organizationName: '',
    organizationType: '',
    industry: '',
    size: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    plan: 'pro',
    billingCycle: 'monthly',
    addOns: [],
    subdomain: '',
    primaryColor: '#6366f1',
    logoUrl: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
  });

  const totalSteps = 6;

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
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle final submission
    console.log('Onboarding completed:', data);
    // Redirect to dashboard or show success message
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
                        className="mt-2 h-12"
                      />
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
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold">Industry *</Label>
                      <Input
                        placeholder="e.g., Software Development"
                        value={data.industry}
                        onChange={(e) => updateData('industry', e.target.value)}
                        className="mt-2 h-12"
                      />
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
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
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
                    <p className="text-gray-600">Set up the main administrator account</p>
                  </div>

                  <div className="max-w-md mx-auto space-y-6">
                    <div>
                      <Label htmlFor="adminName" className="text-base font-semibold">Full Name *</Label>
                      <Input
                        id="adminName"
                        placeholder="Enter your full name"
                        value={data.adminName}
                        onChange={(e) => updateData('adminName', e.target.value)}
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="adminEmail" className="text-base font-semibold">Email Address *</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="admin@yourcompany.com"
                        value={data.adminEmail}
                        onChange={(e) => updateData('adminEmail', e.target.value)}
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="adminPhone" className="text-base font-semibold">Phone Number</Label>
                      <Input
                        id="adminPhone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={data.adminPhone}
                        onChange={(e) => updateData('adminPhone', e.target.value)}
                        className="mt-2 h-12"
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> This will be the primary administrator account. 
                        You can add more team members later from your dashboard.
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
                            onChange={(e) => updateData('subdomain', e.target.value)}
                            className="h-12 rounded-r-none"
                          />
                          <div className="bg-gray-100 border border-l-0 border-gray-300 px-4 flex items-center rounded-r-md text-gray-600">
                            .yoursaas.com
                          </div>
                        </div>
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
                              https://{data.subdomain || 'yourcompany'}.yoursaas.com
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Payment */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <CreditCardIcon className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Information</h2>
                    <p className="text-gray-600">Secure payment processing with 256-bit encryption</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="cardNumber" className="text-base font-semibold">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={data.cardNumber}
                          onChange={(e) => updateData('cardNumber', e.target.value)}
                          className="mt-2 h-12"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry" className="text-base font-semibold">Expiry Date *</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={data.expiryDate}
                            onChange={(e) => updateData('expiryDate', e.target.value)}
                            className="mt-2 h-12"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv" className="text-base font-semibold">CVV *</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={data.cvv}
                            onChange={(e) => updateData('cvv', e.target.value)}
                            className="mt-2 h-12"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="billing" className="text-base font-semibold">Billing Address *</Label>
                        <Input
                          id="billing"
                          placeholder="123 Main St, City, State 12345"
                          value={data.billingAddress}
                          onChange={(e) => updateData('billingAddress', e.target.value)}
                          className="mt-2 h-12"
                        />
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                      <div className="space-y-4">
                        {(() => {
                          const selectedPlan = plans.find(p => p.id === data.plan)!;
                          const monthlyPrice = data.billingCycle === 'annual' 
                            ? Math.round(selectedPlan.price * 0.83) 
                            : selectedPlan.price;
                          const totalPrice = data.billingCycle === 'annual' 
                            ? monthlyPrice * 12 
                            : monthlyPrice;

                          return (
                            <>
                              <div className="flex justify-between">
                                <span>{selectedPlan.name} Plan</span>
                                <span>${monthlyPrice}/month</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Billing Cycle</span>
                                <span className="capitalize">{data.billingCycle}</span>
                              </div>
                              {data.billingCycle === 'annual' && (
                                <div className="flex justify-between text-green-600">
                                  <span>Annual Discount</span>
                                  <span>-${Math.round(selectedPlan.price * 12 * 0.17)}</span>
                                </div>
                              )}
                              <hr />
                              <div className="flex justify-between font-semibold text-lg">
                                <span>Total {data.billingCycle === 'annual' ? '(Annual)' : '(Monthly)'}</span>
                                <span>${totalPrice}</span>
                              </div>
                              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                                <p className="text-sm text-blue-800">
                                  <strong>14-day free trial</strong><br />
                                  You won't be charged until your trial ends. Cancel anytime.
                                </p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Confirmation */}
              {currentStep === 6 && (
                <motion.div
                  key="step6"
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">You're All Set!</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      Your account has been created successfully. We're setting up your workspace now.
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
                          <span className="font-medium text-gray-700">Workspace URL:</span>
                          <div className="font-mono">https://{data.subdomain}.yoursaas.com</div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg"
                    >
                      Access Your Dashboard
                      <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </Button>
                    
                    <p className="text-sm text-gray-600">
                      A confirmation email has been sent to {data.adminEmail}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            {currentStep < 6 && (
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
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center gap-2"
                >
                  Next Step
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </div>
            )}
          </Card>

          {/* Trust Indicators */}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span>256-bit SSL Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>PCI Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5" />
                  <span>Trusted by 2,500+ Companies</span>
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