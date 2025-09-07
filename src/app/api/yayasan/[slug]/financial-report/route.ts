import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const year = new Date().getFullYear(); // 2025
    const startDate = new Date(year, 0, 1); // January 1, 2025
    const endDate = new Date(year, 11, 31, 23, 59, 59); // December 31, 2025

    // Get tenant
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Yayasan not found' }, { status: 404 });
    }

    // Get all donations for current year
    const donations = await prisma.donation.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get all transactions (income and expenses)
    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    // Get all payments
    const payments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: 'SUCCESS',
      },
    });

    // Calculate monthly cashflow
    const monthlyData = [];
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);
      
      // Filter data for this month
      const monthDonations = donations.filter(d => {
        const date = new Date(d.createdAt);
        return date >= monthStart && date <= monthEnd;
      });
      
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.createdAt);
        return date >= monthStart && date <= monthEnd;
      });

      const monthPayments = payments.filter(p => {
        const date = new Date(p.createdAt);
        return date >= monthStart && date <= monthEnd;
      });

      // Calculate totals
      const donationIncome = monthDonations.reduce((sum, d) => sum + Number(d.amount), 0);
      const paymentIncome = monthPayments.reduce((sum, p) => sum + Number(p.amount), 0);
      
      const income = monthTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + Number(t.amount), 0) + donationIncome + paymentIncome;
      
      const expense = monthTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      monthlyData.push({
        month: month + 1,
        monthName: new Date(year, month).toLocaleString('id-ID', { month: 'long' }),
        income,
        expense,
        netCashflow: income - expense,
        donations: donationIncome,
        nonDonations: income - donationIncome,
      });
    }

    // Get donation campaigns for programs
    const campaigns = await prisma.donationCampaign.findMany({
      where: {
        startDate: {
          gte: startDate,
        },
        endDate: {
          lte: endDate,
        },
      },
    });

    // Get donations for each campaign
    const donationsByCampaign: Record<string, any[]> = {};
    for (const campaign of campaigns) {
      const campaignDonations = donations.filter(d => d.campaignId === campaign.id);
      donationsByCampaign[campaign.id] = campaignDonations;
    }

    // Calculate program statistics
    const programs = campaigns.map(campaign => {
      const campaignDonations = donationsByCampaign[campaign.id] || [];
      const collected = campaignDonations.reduce((sum, d) => sum + Number(d.amount), 0);
      const target = Number(campaign.targetAmount);
      
      return {
        id: campaign.id,
        name: campaign.title,
        target,
        collected,
        percentage: target > 0 ? Math.round((collected / target) * 100) : 0,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        status: campaign.status === 'ACTIVE' ? 'active' : 'completed',
        category: campaign.categoryId,
      };
    });

    // Calculate yearly totals
    const yearlyTotals = {
      totalIncome: monthlyData.reduce((sum, m) => sum + m.income, 0),
      totalExpense: monthlyData.reduce((sum, m) => sum + m.expense, 0),
      totalDonations: monthlyData.reduce((sum, m) => sum + m.donations, 0),
      totalNonDonations: monthlyData.reduce((sum, m) => sum + m.nonDonations, 0),
      netCashflow: monthlyData.reduce((sum, m) => sum + m.netCashflow, 0),
    };

    // Calculate income sources breakdown
    const incomeBreakdown = {
      donations: yearlyTotals.totalDonations,
      studentPayments: payments
        .filter(p => p.paymentType === 'SPP' || p.paymentType === 'REGISTRATION')
        .reduce((sum, p) => sum + Number(p.amount), 0),
      otherIncome: transactions
        .filter(t => t.type === 'INCOME' && t.category?.name !== 'Donation')
        .reduce((sum, t) => sum + Number(t.amount), 0),
    };

    // Calculate expense breakdown by category
    const expenseCategories: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'EXPENSE')
      .forEach(t => {
        const category = t.category?.name || 'Lainnya';
        if (!expenseCategories[category]) {
          expenseCategories[category] = 0;
        }
        expenseCategories[category] += Number(t.amount);
      });

    // Get recent donations
    const recentDonations = await prisma.donation.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Get campaign titles for recent donations
    const campaignIds = [...new Set(recentDonations.map(d => d.campaignId).filter(Boolean))];
    const campaignTitles: Record<string, string> = {};
    if (campaignIds.length > 0) {
      const campaignsForDonations = await prisma.donationCampaign.findMany({
        where: { id: { in: campaignIds as string[] } },
        select: { id: true, title: true },
      });
      campaignsForDonations.forEach(c => {
        campaignTitles[c.id] = c.title;
      });
    }

    return NextResponse.json({
      year,
      monthlyData,
      yearlyTotals,
      programs,
      incomeBreakdown,
      expenseCategories,
      recentDonations: recentDonations.map(d => ({
        id: d.id,
        donorName: d.donorName,
        amount: Number(d.amount),
        campaign: d.campaignId ? campaignTitles[d.campaignId] || 'Donasi Umum' : 'Donasi Umum',
        date: d.createdAt,
        message: d.message,
      })),
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error('Error fetching financial report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch financial report' },
      { status: 500 }
    );
  }
}