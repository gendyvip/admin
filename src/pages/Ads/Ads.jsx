import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconEdit, IconTrash, IconEye, IconRefresh } from "@tabler/icons-react";
import advertiseService from "../../api/advertise";

// Status badge configuration
const getStatusBadge = (status) => {
  const statusConfig = {
    accepted: { variant: "default", className: "bg-green-100 text-green-800" },
    waiting: { variant: "secondary", className: "bg-yellow-100 text-yellow-800" },
    rejected: { variant: "outline", className: "bg-red-100 text-red-800" },
  };
  
  const config = statusConfig[status] || statusConfig.waiting;
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};



export default function Ads() {
  const [adRequests, setAdRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    waiting: 0,
    rejected: 0
  });

  // Fetch advertisement requests
  const fetchAdRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await advertiseService.getAdvertisementRequests();
      
      if (response.success) {
        setAdRequests(response.data.adRequests);
        
        // Calculate stats
        const total = response.data.total;
        const accepted = response.data.adRequests.filter(req => req.status === 'accepted').length;
        const waiting = response.data.adRequests.filter(req => req.status === 'waiting').length;
        const rejected = response.data.adRequests.filter(req => req.status === 'rejected').length;
        
        setStats({ total, accepted, waiting, rejected });
      } else {
        setError(response.message || 'Failed to fetch data');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdRequests();
  }, []);

  if (loading) {
    return (
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading advertisement requests...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchAdRequests} variant="outline">
                <IconRefresh className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Advertisement Requests</CardTitle>
              <CardDescription>
                Manage advertisement requests from users
              </CardDescription>
            </div>
            <Button onClick={fetchAdRequests} variant="outline" size="sm">
              <IconRefresh className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-sm text-gray-600">Total Requests</h3>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-sm text-gray-600">Accepted</h3>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-sm text-gray-600">Waiting</h3>
                <p className="text-2xl font-bold text-yellow-600">{stats.waiting}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-sm text-gray-600">Rejected</h3>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
            </div>

            {/* Requests Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium max-w-xs">
                            {request.fullName.length > 20 ? (
                              <div className="truncate" title={request.fullName}>
                                {request.fullName.substring(0, 20)}...
                              </div>
                            ) : (
                              <div>{request.fullName}</div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">ID: {request.id.slice(0, 8)}...</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm max-w-xs">
                            {request.email.length > 25 ? (
                              <div className="truncate" title={request.email}>
                                {request.email.substring(0, 25)}...
                              </div>
                            ) : (
                              <div>{request.email}</div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{request.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {request.content.length > 20 ? (
                            <div className="truncate" title={request.content}>
                              {request.content.substring(0, 20)}...
                            </div>
                          ) : (
                            <div>{request.content}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" title="View Details">
                            <IconEye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" title="Edit">
                            <IconEdit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" title="Delete">
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
