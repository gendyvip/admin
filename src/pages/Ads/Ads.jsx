import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconEdit, IconTrash, IconEye } from "@tabler/icons-react";

// Static data for ads
const adsData = [
  {
    id: 1,
    title: "Summer Sale Campaign",
    description: "Get 50% off on all summer items",
    status: "active",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    budget: 5000,
    impressions: 12500,
    clicks: 850,
    ctr: 6.8,
    spend: 3200,
  },
  {
    id: 2,
    title: "New Product Launch",
    description: "Introducing our latest smartphone model",
    status: "pending",
    startDate: "2024-07-15",
    endDate: "2024-09-15",
    budget: 8000,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    spend: 0,
  },
  {
    id: 3,
    title: "Holiday Special",
    description: "Christmas and New Year promotions",
    status: "paused",
    startDate: "2024-12-01",
    endDate: "2025-01-15",
    budget: 12000,
    impressions: 8900,
    clicks: 567,
    ctr: 6.4,
    spend: 4500,
  },
  {
    id: 4,
    title: "Back to School",
    description: "School supplies and electronics sale",
    status: "active",
    startDate: "2024-08-20",
    endDate: "2024-09-30",
    budget: 6000,
    impressions: 15600,
    clicks: 1200,
    ctr: 7.7,
    spend: 4800,
  },
  {
    id: 5,
    title: "Black Friday Deals",
    description: "Huge discounts on electronics and fashion",
    status: "scheduled",
    startDate: "2024-11-25",
    endDate: "2024-11-30",
    budget: 15000,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    spend: 0,
  },
];

const getStatusBadge = (status) => {
  const statusConfig = {
    active: { variant: "default", className: "bg-green-100 text-green-800" },
    pending: { variant: "secondary", className: "bg-yellow-100 text-yellow-800" },
    paused: { variant: "outline", className: "bg-gray-100 text-gray-800" },
    scheduled: { variant: "secondary", className: "bg-blue-100 text-blue-800" },
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

export default function Ads() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Advertisements Management</CardTitle>
          <CardDescription>
            Manage your advertising campaigns and track their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-sm text-gray-600">Total Campaigns</h3>
                <p className="text-2xl font-bold">{adsData.length}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-sm text-gray-600">Active Campaigns</h3>
                <p className="text-2xl font-bold text-green-600">
                  {adsData.filter(ad => ad.status === 'active').length}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-sm text-gray-600">Total Budget</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(adsData.reduce((sum, ad) => sum + ad.budget, 0))}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-sm text-gray-600">Total Spend</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(adsData.reduce((sum, ad) => sum + ad.spend, 0))}
                </p>
              </div>
            </div>

            {/* Ads Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Impressions</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>Spend</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adsData.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ad.title}</div>
                          <div className="text-sm text-gray-500">{ad.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(ad.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(ad.startDate).toLocaleDateString()}</div>
                          <div className="text-gray-500">to {new Date(ad.endDate).toLocaleDateString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(ad.budget)}</TableCell>
                      <TableCell>{formatNumber(ad.impressions)}</TableCell>
                      <TableCell>{formatNumber(ad.clicks)}</TableCell>
                      <TableCell>{ad.ctr}%</TableCell>
                      <TableCell>{formatCurrency(ad.spend)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <IconEye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <IconEdit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
