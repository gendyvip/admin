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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRef } from "react";
import DatePicker from "@/components/ui/date-picker";
import adsCreationService, {
  adsCreationService as namedAdsCreationService,
} from "@/api/ads-creation";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "sonner";

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

export default function AdsRequest() {
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
  const [createAdModalOpen, setCreateAdModalOpen] = useState(false);
  const [adForm, setAdForm] = useState(null);
  const imageInputRef = useRef();
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Target position options for the multi-select
  const targetPositionOptions = [
    { value: "pharmacyDetails", label: "Pharmacy Details" },
    { value: "dealDetails", label: "Deal Details" },
    { value: "homePage", label: "Home Page" },
    { value: "allDeals", label: "All Deals" },
    { value: "allPharmcies", label: "All Pharmcies" },
  ];

  // Function to get label from value
  const getLabelFromValue = (value) => {
    if (!value) return "No position";
    const option = targetPositionOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  // Function to check if request has advertisement
  const hasAdvertisement = (request) => {
    return request.advertisementId || request.advertisement;
  };

  // Function to get advertisement status
  const getAdvertisementStatus = (request) => {
    if (request.advertisement) {
      return request.advertisement.status ? "Active" : "Inactive";
    }
    return "Created";
  };

  // فتح المودال
  const handleViewRequest = (request) => {
    toast.info(`Viewing request: "${request.title}"`);
    setSelectedRequest(request.id);
  };

  // غلق المودال
  const handleCloseModal = () => {
    toast.info("Closing request details");
    setSelectedRequest(null);
  };

  // تحديث الحالة (accept/reject)
  const handleStatusUpdate = async (requestId, status) => {
    try {
      const statusText = status === "accepted" ? "accepting" : "rejecting";
      toast.loading(
        `${statusText.charAt(0).toUpperCase() + statusText.slice(1)} request...`
      );
      setUpdatingStatus({ requestId, status });
      await updateRequestStatus(requestId, status);
      setSelectedRequest(null); // أغلق المودال بعد العملية
      setForceUpdate((f) => f + 1); // إجبار إعادة الرسم بعد التحديث
      toast.success(`Request ${status} successfully`);
    } catch (error) {
      toast.error(`Failed to ${status} request: ${error.message}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // حذف الطلب
  const handleDelete = async (requestId) => {
    try {
      toast.loading("Deleting request...");
      setUpdatingStatus({ requestId, status: "delete" });
      await deleteRequest(requestId);
      setSelectedRequest(null); // أغلق المودال ويحدث البيانات تلقائيًا
      clearError(); // صفّر رسالة الخطأ بعد الحذف الناجح
      setForceUpdate((f) => f + 1); // إجبار إعادة الرسم بعد الحذف
      toast.success("Request deleted successfully");
    } catch (error) {
      toast.error(`Failed to delete request: ${error.message}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Open create ad modal with request data
  const handleOpenCreateAd = (request) => {
    // Check if this request already has an advertisement
    if (hasAdvertisement(request)) {
      toast.error(
        "An advertisement already exists for this request. Please check the advertisements list."
      );
      return;
    }

    toast.info(`Creating advertisement from request: "${request.title}"`);
    setAdForm({
      title: request.title || "",
      companyName: request.companyName || "",
      companyUrl: request.companyUrl || "",
      imageAlt: request.imageAlt || "",
      status: true,
      startDate: "",
      endDate: "",
      targetPosition: [],
      image: null,
    });
    setSelectedRequestId(request.id);
    setCreateAdModalOpen(true);
  };

  // Handle form field changes
  const handleAdFormChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === "file") {
      const file = files[0];
      setAdForm((prev) => ({ ...prev, [name]: file }));

      // Create preview for image files
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else if (type === "checkbox") {
      setAdForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setAdForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit create ad
  const handleCreateAd = async (e) => {
    e.preventDefault();
    if (!selectedRequestId) return;

    try {
      const formData = {
        ...adForm,
        targetPosition: adForm.targetPosition, // Send as array directly
      };

      // Log the form data for debugging
      console.log("Form data being sent:", formData);
      console.log("Selected request ID:", selectedRequestId);

      toast.loading("Creating advertisement...");

      await adsCreationService.createAdWithRequestId(
        selectedRequestId,
        formData
      );

      toast.dismiss(); // Dismiss loading toast
      toast.success("Advertisement created successfully");

      setCreateAdModalOpen(false);
      setAdForm(null);
      setSelectedRequestId(null);
      setImagePreview(null);

      // Refresh requests or ads if needed
      refreshData(pagination.page, "status");
    } catch (error) {
      console.error("Error in handleCreateAd:", error);

      // Dismiss loading toast first
      toast.dismiss();

      // Handle specific error cases
      if (error.message.includes("already exists")) {
        toast.error(
          "An advertisement already exists for this request. Please check the advertisements list."
        );
      } else {
        toast.error(`Failed to create advertisement: ${error.message}`);
      }
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
    toast.loading("Refreshing data...");
    refreshData(pagination.page, "status")
      .then(() => {
        toast.success("Data refreshed successfully");
      })
      .catch((error) => {
        toast.error(`Failed to refresh: ${error.message}`);
      });
  };

  // When search or filter changes, reset to page 1
  useEffect(() => {
    if (search !== "") {
      fetchAdRequests(1, "status");
    }
  }, [search, fetchAdRequests]);

  useEffect(() => {
    if (selectedRequest && !adRequests.find((r) => r.id === selectedRequest)) {
      setSelectedRequest(null);
    }
  }, [adRequests, selectedRequest]);

  const handlePageChange = (newPage) => {
    fetchAdRequests(newPage, "status");
  };

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
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-4 border rounded-lg animate-pulse h-20 bg-gray-100"
                  />
                ))}
              </div>
            ) : (
              <div
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
                key={forceUpdate}
              >
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
                  <h3 className="font-semibold text-sm text-gray-600">
                    Waiting
                  </h3>
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
                    <TableHead>Create Ad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    // Skeleton rows (like AdsCreation.jsx)
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-center">
                            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mx-auto"></div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-400"
                      >
                        No requests found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => (
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
                            <Button
                              className={`${
                                request.status === "accepted"
                                  ? "bg-green-800 hover:bg-green-900 hover:text-white text-white  "
                                  : "bg-green-800 hover:bg-green-900 hover:text-white text-white"
                              }`}
                              size="sm"
                              variant="outline"
                              title={
                                request.status === "accepted"
                                  ? "Already Accepted"
                                  : "Accept"
                              }
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
                                : request.status === "accepted"
                                ? "Accept"
                                : "Accept"}
                            </Button>
                            <Button
                              className={`${
                                request.status === "rejected"
                                  ? "bg-red-600 text-white"
                                  : "bg-red-500 hover:bg-red-700 hover:text-white text-white"
                              }`}
                              size="sm"
                              variant="outline"
                              title={
                                request.status === "rejected"
                                  ? "Already Rejected"
                                  : "Reject"
                              }
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
                                : request.status === "rejected"
                                ? "Reject"
                                : "Reject"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              title="Delete"
                              onClick={() => handleDelete(request.id)}
                              disabled={
                                updatingStatus?.requestId === request.id
                              }
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {hasAdvertisement(request) ? (
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  getAdvertisementStatus(request) === "Active"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {getAdvertisementStatus(request)}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                title="View Advertisement"
                                onClick={() => {
                                  toast.info(
                                    "Redirecting to advertisements list..."
                                  );
                                  // You can add navigation to ads list here
                                }}
                              >
                                View Ad
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="default"
                              title="Create Ad"
                              onClick={() => handleOpenCreateAd(request)}
                            >
                              Create Ad
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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

      {/* Create Ad Modal */}
      <Dialog
        open={createAdModalOpen}
        onOpenChange={() => setCreateAdModalOpen(false)}
      >
        <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create Advertisement
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-base">
              Fill in the details below to create a new advertisement campaign
            </DialogDescription>
          </DialogHeader>
          {adForm && (
            <form onSubmit={handleCreateAd} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      Title
                    </label>
                    <Input
                      name="title"
                      value={adForm.title}
                      onChange={handleAdFormChange}
                      className="h-11"
                      placeholder="Enter advertisement title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Company Name
                    </label>
                    <Input
                      name="companyName"
                      value={adForm.companyName}
                      onChange={handleAdFormChange}
                      className="h-11"
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    Company URL
                  </label>
                  <Input
                    name="companyUrl"
                    value={adForm.companyUrl}
                    onChange={handleAdFormChange}
                    placeholder="https://example.com"
                    type="url"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Image Alt Text
                  </label>
                  <Input
                    name="imageAlt"
                    value={adForm.imageAlt}
                    onChange={handleAdFormChange}
                    className="h-11"
                    placeholder="Enter image alt text for accessibility"
                  />
                </div>
              </div>

              {/* Campaign Settings Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Campaign Settings
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Status
                    </label>
                    <Select
                      value={adForm.status ? "true" : "false"}
                      onValueChange={(val) =>
                        setAdForm((prev) => ({
                          ...prev,
                          status: val === "true",
                        }))
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Target Position
                    </label>
                    <MultiSelect
                      options={targetPositionOptions}
                      selected={adForm.targetPosition}
                      onChange={(selectedPositions) =>
                        setAdForm((prev) => ({
                          ...prev,
                          targetPosition: selectedPositions,
                        }))
                      }
                      placeholder="Select target positions..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Start Date
                    </label>
                    <DatePicker
                      value={
                        adForm.startDate
                          ? new Date(adForm.startDate)
                          : undefined
                      }
                      onChange={(date) =>
                        setAdForm((prev) => ({
                          ...prev,
                          startDate: date
                            ? date.toISOString().slice(0, 10)
                            : "",
                        }))
                      }
                      label={null}
                      placeholder="Select start date"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      End Date
                    </label>
                    <DatePicker
                      value={
                        adForm.endDate ? new Date(adForm.endDate) : undefined
                      }
                      onChange={(date) =>
                        setAdForm((prev) => ({
                          ...prev,
                          endDate: date ? date.toISOString().slice(0, 10) : "",
                        }))
                      }
                      label={null}
                      placeholder="Select end date"
                    />
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Media</h3>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Advertisement Image
                  </label>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-4">
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setAdForm((prev) => ({ ...prev, image: null }));
                            if (imageInputRef.current) {
                              imageInputRef.current.value = "";
                            }
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                          title="Remove image"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Image preview - Click the X button to remove
                      </p>
                    </div>
                  )}

                  {/* Upload Area */}
                  {!imagePreview && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Input
                        type="file"
                        name="image"
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={handleAdFormChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-medium text-zinc-900 hover:text-zinc-800">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateAdModalOpen(false)}
                  className="h-11 px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  className="h-11 px-6 bg-zinc-900 hover:bg-zinc-800"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Create Advertisement
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal for viewing request details */}
      <AdsModalView
        isOpen={!!selectedRequest}
        onClose={handleCloseModal}
        request={adRequests.find((r) => r.id === selectedRequest) || null}
        onAccept={(id) => handleStatusUpdate(id, "accepted")}
        onReject={(id) => handleStatusUpdate(id, "rejected")}
        onDelete={handleDelete}
        updatingStatus={updatingStatus}
      />
    </div>
  );
}
