import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards({ data }) {
  // Fallbacks for loading or missing data
  const totalRevenue = data?.revenue?.byPlan?.total ?? 0;
  const totalSubscriptions = data?.totalSubscriptions ?? 0;
  const activeSubscriptions = data?.activeSubscriptions ?? 0;
  const monthlySubscriptions = data?.monthlySubscriptions ?? 0;
  const yearlySubscriptions = data?.yearlySubscriptions ?? 0;
  const regularSubscriptions = data?.regularSubscriptions ?? 0;
  const premiumSubscriptions = data?.premiumSubscriptions ?? 0;
  const walletPayments = data?.walletPayments ?? 0;
  const visaPayments = data?.visaPayments ?? 0;

  // Prices
  const monthlyRegularPrice = 50;
  const monthlyPremiumPrice = 100;
  const yearlyRegularPrice = 200;
  const yearlyPremiumPrice = 400;

  // Quantities from API
  const monthlyRegularCount = data?.monthly_regular ?? 0;
  const monthlyPremiumCount = data?.monthly_premium ?? 0;
  const yearlyRegularCount = data?.yearly_regular ?? 0;
  const yearlyPremiumCount = data?.yearly_premium ?? 0;

  // Revenue calculations
  const monthlyRegularRevenue = monthlyRegularCount * monthlyRegularPrice;
  const monthlyPremiumRevenue = monthlyPremiumCount * monthlyPremiumPrice;
  const yearlyRegularRevenue = yearlyRegularCount * yearlyRegularPrice;
  const yearlyPremiumRevenue = yearlyPremiumCount * yearlyPremiumPrice;

  // For Regular/Premium breakdown from API response
  const monthlyRegular = data?.monthly_regular ?? 0;
  const monthlyPremium = data?.monthly_premium ?? 0;
  const yearlyRegular = data?.yearly_regular ?? 0;
  const yearlyPremium = data?.yearly_premium ?? 0;

  // Main numbers for Regular vs Premium
  const regularTotal = monthlyRegular + yearlyRegular;
  const premiumTotal = monthlyPremium + yearlyPremium;

  const revenueByStatusActive = data?.revenue?.byStatus?.active ?? 0;
  const revenueByStatusInactive = data?.revenue?.byStatus?.inactive ?? 0;

  // Calculate percentages for active/inactive revenue
  const totalStatusRevenue = revenueByStatusActive + revenueByStatusInactive;
  const activePercent = totalStatusRevenue ? Math.round((revenueByStatusActive / totalStatusRevenue) * 100) : 0;
  const inactivePercent = totalStatusRevenue ? Math.round((revenueByStatusInactive / totalStatusRevenue) * 100) : 0;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Subscriptions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalSubscriptions}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {/* Example: +12.5% */}
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Active: {activeSubscriptions} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Wallet: {walletPayments} - Visa: {visaPayments}
          </div>
          <div className="text-muted-foreground">
            Monthly: {monthlySubscriptions} - Yearly: {yearlySubscriptions}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Regular vs Premium</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {regularTotal} / {premiumTotal}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Regular / Premium
          </div>
          <div className="text-muted-foreground">
            Monthly Regular: {monthlyRegular} - Yearly Regular: {yearlyRegular} 
          </div>
          <div className="text-muted-foreground">
          Monthly Premium: {monthlyPremium} - Yearly Premium: {yearlyPremium}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalRevenue.toLocaleString()} EGP
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {/* Example: +10% */}
              +10%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Revenue by Plan
          </div>
          <div className="text-muted-foreground">
            Monthly Regular: {monthlyRegularRevenue} EGP - Yearly Regular: {yearlyRegularRevenue} EGP 
          </div>
          <div className="text-muted-foreground">
          Monthly Premium: {monthlyPremiumRevenue} EGP - Yearly Premium: {yearlyPremiumRevenue} EGP
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active vs Inactive</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {revenueByStatusActive} EGP  / {revenueByStatusInactive} EGP
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {/* Example: +3% */}
              +3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-semibold">
            Active: {activePercent}% | Inactive: {inactivePercent}%
          </div>
          <div className="text-muted-foreground">
            Revenue split by active/inactive subscriptions
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
