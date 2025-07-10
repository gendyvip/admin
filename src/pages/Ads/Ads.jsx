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
import { IconTrash, IconEye, IconRefresh } from "@tabler/icons-react";
import AdsModalView from "./AdsModalView";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import useAdsRequestStore from "../../store/useAds-Request";

// Status badge configuration
const getStatusBadge = (status) => {
  const statusConfig = {
    accepted: { variant: "default", className: "bg-green-100 text-green-800" },
    waiting: {
      variant: "secondary",
      className: "bg-yellow-100 text-yellow-800",
    },
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
  // Zustand store
  const {
    adRequests,
    stats,
    pagination,
    loading,
    error,
    fetchAdRequests,
    fetchStatusCounts,
    refreshData,
    clearError,
    updateRequestStatus,
    deleteRequest,
  } = useAdsRequestStore();

  // Local state for UI
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // فتح المودال
  const handleViewRequest = (request) => {
    setSelectedRequest(request.id);
  };

  // غلق المودال
  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  // تحديث الحالة (accept/reject)
  const handleStatusUpdate = async (requestId, status) => {
    try {
      setUpdatingStatus({ requestId, status });
      await updateRequestStatus(requestId, status);
      setSelectedRequest(null); // أغلق المودال بعد العملية
      setForceUpdate(f => f + 1); // إجبار إعادة الرسم بعد التحديث
    } catch (error) {
      // error handling
    } finally {
      setUpdatingStatus(null);
    }
  };

  // حذف الطلب
  const handleDelete = async (requestId) => {
    try {
      setUpdatingStatus({ requestId, status: "delete" });
      await deleteRequest(requestId);
      setSelectedRequest(null); // أغلق المودال ويحدث البيانات تلقائيًا
      clearError(); // صفّر رسالة الخطأ بعد الحذف الناجح
      setForceUpdate(f => f + 1); // إجبار إعادة الرسم بعد الحذف
    } catch (error) {
      // يمكنك هنا فقط عرض رسالة خطأ إذا أردت
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Filtered requests (status filter only applies to current page data)
  const filteredRequests = adRequests.filter((req) => {
    return statusFilter === "all" ? true : req.status === statusFilter;
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchAdRequests(1, "status");
    fetchStatusCounts();
  }, [fetchAdRequests, fetchStatusCounts]);

  // When refreshing, reload current page only (do not reset page or filters)
  const handleRefresh = () => {
    refreshData(pagination.page, "status");
  };

  // When search or filter changes, reset to page 1
  useEffect(() => {
    if (search !== "") {
      fetchAdRequests(1, "status");
    }
  }, [search, fetchAdRequests]);

  useEffect(() => {
    if (selectedRequest && !adRequests.find(r => r.id === selectedRequest)) {
      setSelectedRequest(null);
    }
  }, [adRequests, selectedRequest]);

  const handlePageChange = (newPage) => {
    fetchAdRequests(newPage, "status");
  };

  if (loading) {
    return (
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">
                Loading advertisement requests...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !error.toLowerCase().includes("deleted")) {
    return (
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline">
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
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Advertisement Requests</CardTitle>
              <CardDescription>
                Manage advertisement requests from users
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
              <Input
                type="text"
                placeholder="Search by name, email, or phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <IconRefresh className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Summary Cards */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="p-4 border rounded-lg animate-pulse h-20 bg-gray-100" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4" key={forceUpdate}>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-sm text-gray-600">
                    Total Requests
                  </h3>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-sm text-gray-600">
                    Accepted
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.accepted}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-sm text-gray-600">Waiting</h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.waiting}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-sm text-gray-600">
                    Rejected
                  </h3>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.rejected}
                  </p>
                </div>
              </div>
            )}

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
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium max-w-xs">
                            {request.fullName.length > 20 ? (
                              <div
                                className="truncate"
                                title={request.fullName}
                              >
                                {request.fullName.substring(0, 20)}...
                              </div>
                            ) : (
                              <div>{request.fullName}</div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {request.id.slice(0, 8)}...
                          </div>
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
                          <div className="text-sm text-gray-500">
                            {request.phone}
                          </div>
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
                          <Button
                            size="sm"
                            variant="outline"
                            title="View Details"
                            onClick={() => handleViewRequest(request)}
                          >
                            <IconEye className="h-4 w-4" />
                          </Button>
                          {request.status !== "accepted" &&
                            updatingStatus?.requestId !== request.id && (
                              <Button
                                className="bg-green-800 hover:bg-green-900 hover:text-white text-white"
                                size="sm"
                                variant="outline"
                                title="Accept"
                                onClick={() =>
                                  handleStatusUpdate(request.id, "accepted")
                                }
                                disabled={
                                  updatingStatus?.requestId === request.id
                                }
                              >
                                {updatingStatus?.requestId === request.id &&
                                updatingStatus?.status === "accepted"
                                  ? "Updating..."
                                  : "Accept"}
                              </Button>
                            )}
                          {request.status !== "rejected" &&
                            updatingStatus?.requestId !== request.id && (
                              <Button
                                className="bg-red-500 hover:bg-red-700 hover:text-white text-white"
                                size="sm"
                                variant="outline"
                                title="Reject"
                                onClick={() =>
                                  handleStatusUpdate(request.id, "rejected")
                                }
                                disabled={
                                  updatingStatus?.requestId === request.id
                                }
                              >
                                {updatingStatus?.requestId === request.id &&
                                updatingStatus?.status === "rejected"
                                  ? "Updating..."
                                  : "Reject"}
                              </Button>
                            )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            title="Delete"
                            onClick={() => handleDelete(request.id)}
                            disabled={updatingStatus?.requestId === request.id}
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        pagination.page > 1 &&
                        handlePageChange(pagination.page - 1)
                      }
                      aria-disabled={pagination.page === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={pagination.page === i + 1}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        pagination.page < pagination.totalPages &&
                        handlePageChange(pagination.page + 1)
                      }
                      aria-disabled={pagination.page === pagination.totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal for viewing request details */}
      <AdsModalView
        isOpen={!!selectedRequest}
        onClose={handleCloseModal}
        request={adRequests.find(r => r.id === selectedRequest) || null}
        onAccept={(id) => handleStatusUpdate(id, "accepted")}
        onReject={(id) => handleStatusUpdate(id, "rejected")}
        onDelete={handleDelete}
        updatingStatus={updatingStatus}
      />
    </div>
  );
}
