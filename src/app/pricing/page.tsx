'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PublicLayout from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CheckIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  SparklesIcon,
  CloudIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UsersIcon,
  CogIcon,
  GlobeAltIcon,
  StarIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [userCount, setUserCount] = useState(10);
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small teams getting started',
      icon: SparklesIcon,
      color: 'from-blue-500 to-indigo-600',
      pricing: {
        monthly: 29,
        annual: 290, // 2 months free
      },
      features: [
        'Up to 5 team members',
        'Basic dashboard',
        '10GB storage',
        'Email support',
        'Basic analytics',
        'Standard templates',
        'Mobile app access',
        'API access (100 calls/day)',
      ],
      limitations: [
        'Limited customization',
        'No white-labeling',
        'Basic reporting only',
        'No priority support',
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'Most popular for growing businesses',
      icon: ChartBarIcon,
      color: 'from-emerald-500 to-green-600',
      pricing: {
        monthly: 79,
        annual: 790, // 2 months free
      },
      features: [
        'Up to 25 team members',
        'Advanced dashboard',
        '100GB storage',
        'Priority email & chat support',
        'Advanced analytics & reporting',
        'Custom templates',
        'Mobile app access',
        'API access (1,000 calls/day)',
        'Custom integrations',
        'Role-based permissions',
        'Data export',
        'Audit logs',
      ],
      limitations: [
        'Limited white-labeling',
        'Standard SLA',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations with advanced needs',
      icon: ShieldCheckIcon,
      color: 'from-purple-500 to-pink-600',
      pricing: {
        monthly: 199,
        annual: 1990, // 2 months free
      },
      features: [
        'Unlimited team members',
        'Enterprise dashboard',
        'Unlimited storage',
        '24/7 phone & chat support',
        'Enterprise analytics',
        'Fully custom templates',
        'Mobile app access',
        'Unlimited API access',
        'Custom integrations',
        'Advanced permissions',
        'Data export',
        'Full audit logs',
        'Complete white-labeling',
        'Custom domain',
        'SSO integration',
        'Advanced security',
        'SLA guarantee',
        'Dedicated account manager',
      ],
      limitations: [],
      popular: false,
    },
  ];

  const addOns = [
    {
      name: 'Additional Users',
      description: 'Extra team members beyond plan limit',
      pricing: { monthly: 5, annual: 50 },
      unit: 'per user/month',
    },
    {
      name: 'Extra Storage',
      description: 'Additional storage beyond plan limit',
      pricing: { monthly: 10, annual: 100 },
      unit: 'per 100GB/month',
    },
    {
      name: 'Premium Support',
      description: '24/7 priority support with dedicated agent',
      pricing: { monthly: 29, annual: 290 },
      unit: 'per month',
    },
    {
      name: 'Advanced Security',
      description: 'Enhanced security features and compliance',
      pricing: { monthly: 49, annual: 490 },
      unit: 'per month',
    },
  ];

  const faq = [
    {
      question: 'How does the pricing work?',
      answer: 'Our pricing is based on the plan you choose and the number of users. Each plan includes a base number of users, and you can add more as needed. Annual plans save you 2 months compared to monthly billing.',
    },
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.',
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'Your data is safely stored for 30 days after cancellation. You can export all your data during this period. After 30 days, data is permanently deleted.',
    },
    {
      question: 'Do you offer custom enterprise plans?',
      answer: 'Yes! For large organizations with specific needs, we offer custom enterprise plans with tailored features, pricing, and support.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! All plans come with a 14-day free trial. No credit card required to start.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for enterprise customers. All payments are processed securely.',
    },
  ];

  const calculatePrice = (plan: typeof plans[0]) => {
    const basePrice = plan.pricing[billingCycle];
    return billingCycle === 'annual' ? basePrice / 12 : basePrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    const monthlyTotal = plan.pricing.monthly * 12;
    const annualPrice = plan.pricing.annual;
    return monthlyTotal - annualPrice;
  };

  return (
    <PublicLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
                Simple, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Transparent</span> Pricing
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Choose the perfect plan for your business. Start with a free trial and scale as you grow.
              </p>
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={`text-lg font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                  className={`relative w-16 h-8 rounded-full transition-colors ${
                    billingCycle === 'annual' ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      billingCycle === 'annual' ? 'translate-x-9' : 'translate-x-1'
                    }`}
                  />
                </button>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
                    Annual
                  </span>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
                    Save 2 months
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Pricing Cards */}
            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        <StarIcon className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <Card className={`p-8 h-full relative overflow-hidden ${
                    plan.popular ? 'border-2 border-emerald-200 shadow-2xl scale-105' : 'border border-gray-200 shadow-lg'
                  }`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.color} opacity-10 rounded-full -mr-16 -mt-16`} />
                    
                    <div className="relative">
                      {/* Header */}
                      <div className="text-center mb-8">
                        <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                          <plan.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <p className="text-gray-600">{plan.description}</p>
                      </div>

                      {/* Pricing */}
                      <div className="text-center mb-8">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-5xl font-bold text-gray-900">
                            ${calculatePrice(plan).toFixed(0)}
                          </span>
                          <span className="text-lg text-gray-600">/month</span>
                        </div>
                        {billingCycle === 'annual' && (
                          <div className="text-green-600 text-sm font-medium mt-2">
                            Save ${getSavings(plan)} per year
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <div className="mb-8">
                        <Link href="/onboarding">
                          <Button
                            className={`w-full py-3 text-lg font-semibold ${
                              plan.popular
                                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
                                : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black'
                            } text-white`}
                          >
                            Start Free Trial
                            <ArrowRightIcon className="w-5 h-5 ml-2" />
                          </Button>
                        </Link>
                      </div>

                      {/* Features */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 text-lg">What's included:</h4>
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-3">
                              <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {plan.limitations.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <h5 className="font-medium text-gray-700 mb-3">Limitations:</h5>
                            <ul className="space-y-2">
                              {plan.limitations.map((limitation, limIndex) => (
                                <li key={limIndex} className="flex items-start gap-3">
                                  <XMarkIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-500 text-sm">{limitation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Enterprise CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-16"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white max-w-4xl mx-auto">
                <h3 className="text-3xl font-bold mb-4">Need something more custom?</h3>
                <p className="text-xl text-purple-100 mb-8">
                  Contact our sales team for custom enterprise solutions with tailored pricing, features, and support.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button className="bg-white text-purple-700 hover:bg-gray-100 font-semibold px-8 py-3">
                      Contact Sales
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button className="bg-purple-700/20 text-white border-2 border-white/20 hover:bg-purple-700/30 font-semibold px-8 py-3">
                      Schedule Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Add-ons Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Enhance Your Plan with <span className="text-indigo-600">Add-ons</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Customize your plan with additional features and services to meet your specific needs.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {addOns.map((addon, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{addon.name}</h3>
                        <p className="text-gray-600">{addon.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-2xl font-bold text-gray-900">
                          ${addon.pricing[billingCycle]}
                        </div>
                        <div className="text-sm text-gray-600">{addon.unit}</div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Add to Plan
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Calculator */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Pricing <span className="text-indigo-600">Calculator</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Customize your plan and see exactly what you'll pay with our interactive calculator.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <Card className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Calculator Controls */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-4">
                        Select Plan
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {plans.map((plan) => (
                          <button
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${
                              selectedPlan === plan.id
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <plan.icon className="w-8 h-8 mx-auto mb-2" />
                            <div className="font-semibold text-sm">{plan.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-4">
                        Team Size: {userCount} users
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={userCount}
                        onChange={(e) => setUserCount(parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>1 user</span>
                        <span>100+ users</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-4">
                        Billing Cycle
                      </label>
                      <div className="flex gap-4">
                        {['monthly', 'annual'].map((cycle) => (
                          <button
                            key={cycle}
                            onClick={() => setBillingCycle(cycle as 'monthly' | 'annual')}
                            className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
                              billingCycle === cycle
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-semibold capitalize">{cycle}</div>
                            {cycle === 'annual' && (
                              <div className="text-sm text-green-600">Save 17%</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Pricing Summary</h3>
                    
                    {(() => {
                      const selectedPlanData = plans.find(p => p.id === selectedPlan)!;
                      const basePrice = calculatePrice(selectedPlanData);
                      const extraUsers = Math.max(0, userCount - (selectedPlan === 'starter' ? 5 : selectedPlan === 'pro' ? 25 : 1000));
                      const extraUserCost = extraUsers * (billingCycle === 'annual' ? 4.17 : 5);
                      const totalMonthly = basePrice + extraUserCost;
                      const totalAnnual = totalMonthly * 12;

                      return (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-3 border-b border-indigo-200">
                            <span className="text-gray-700">Base Plan ({selectedPlanData.name})</span>
                            <span className="font-semibold">${basePrice.toFixed(2)}/mo</span>
                          </div>
                          
                          {extraUsers > 0 && (
                            <div className="flex justify-between items-center py-3 border-b border-indigo-200">
                              <span className="text-gray-700">{extraUsers} extra users</span>
                              <span className="font-semibold">${extraUserCost.toFixed(2)}/mo</span>
                            </div>
                          )}

                          <div className="flex justify-between items-center py-4 border-t-2 border-indigo-300">
                            <span className="text-xl font-bold text-gray-900">Total</span>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-indigo-600">
                                ${totalMonthly.toFixed(2)}/mo
                              </div>
                              {billingCycle === 'annual' && (
                                <div className="text-sm text-gray-600">
                                  ${totalAnnual.toFixed(2)} billed annually
                                </div>
                              )}
                            </div>
                          </div>

                          <Link href="/onboarding">
                            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3">
                              Start Free Trial
                              <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Frequently Asked <span className="text-indigo-600">Questions</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Got questions? We've got answers. If you can't find what you're looking for, contact our support team.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {faq.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <QuestionMarkCircleIcon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-3">{item.question}</h3>
                          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses already using our platform to scale and grow their operations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/onboarding">
                  <Button className="bg-white text-indigo-700 hover:bg-gray-100 font-bold px-10 py-4 text-lg">
                    Start Free Trial
                    <ArrowRightIcon className="w-6 h-6 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:bg-white/20 font-bold px-10 py-4 text-lg">
                    Contact Sales
                  </Button>
                </Link>
              </div>

              <div className="mt-8 text-purple-200 text-sm">
                No credit card required • 14-day free trial • Cancel anytime
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default PricingPage;