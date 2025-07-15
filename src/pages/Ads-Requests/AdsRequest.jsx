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
import adsCreationService from "@/api/ads-creation";
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
      setAdForm((prev) => ({ ...prev, [name]: files[0] }));
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

  if (loading) {
    return (
      <div className="px-4 lg:px-6">
        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 border rounded-lg bg-gray-100 animate-pulse flex flex-col gap-2"
            >
              <div className="h-4 w-1/3 bg-gray-300 rounded mb-2" />
              <div className="h-8 w-1/2 bg-gray-400 rounded" />
            </div>
          ))}
        </div>
        {/* Table Skeleton */}
        <div className="border rounded-lg overflow-x-auto animate-pulse mb-4">
          <table className="min-w-full">
            <thead>
              <tr>
                {[...Array(5)].map((_, i) => (
                  <th key={i} className="px-4 py-2">
                    <div className="h-4 w-20 bg-gray-300 rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, row) => (
                <tr key={row}>
                  {/* اسم */}
                  <td className="px-4 py-4">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </td>
                  {/* تواصل */}
                  <td className="px-4 py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </td>
                  {/* محتوى */}
                  <td className="px-4 py-4">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                  </td>
                  {/* حالة */}
                  <td className="px-4 py-4">
                    <div className="h-4 w-16 bg-gray-300 rounded" />
                  </td>
                  {/* أكشن */}
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-300 rounded" />
                      <div className="h-8 w-8 bg-gray-300 rounded" />
                      <div className="h-8 w-8 bg-gray-300 rounded" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Skeleton */}
        <div className="flex justify-center mt-6 gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-8 bg-gray-300 rounded" />
          ))}
          <div className="h-8 w-16 bg-blue-700 rounded" />
        </div>
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
                            disabled={updatingStatus?.requestId === request.id}
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
                            disabled={updatingStatus?.requestId === request.id}
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
                            disabled={updatingStatus?.requestId === request.id}
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

      {/* Create Ad Modal */}
      <Dialog
        open={createAdModalOpen}
        onOpenChange={() => setCreateAdModalOpen(false)}
      >
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Create Advertisement</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new advertisement
            </DialogDescription>
          </DialogHeader>
          {adForm && (
            <form onSubmit={handleCreateAd} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <Input
                  name="title"
                  value={adForm.title}
                  onChange={handleAdFormChange}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Company Name</label>
                <Input
                  name="companyName"
                  value={adForm.companyName}
                  onChange={handleAdFormChange}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Image Alt</label>
                <Input
                  name="imageAlt"
                  value={adForm.imageAlt}
                  onChange={handleAdFormChange}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Status</label>
                <Select
                  value={adForm.status ? "true" : "false"}
                  onValueChange={(val) =>
                    setAdForm((prev) => ({ ...prev, status: val === "true" }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block font-semibold mb-1">Start Date</label>
                  <DatePicker
                    value={
                      adForm.startDate ? new Date(adForm.startDate) : undefined
                    }
                    onChange={(date) =>
                      setAdForm((prev) => ({
                        ...prev,
                        startDate: date ? date.toISOString().slice(0, 10) : "",
                      }))
                    }
                    label={null}
                    placeholder="Select start date"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-semibold mb-1">End Date</label>
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
              <div>
                <label className="block font-semibold mb-1">
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
              <div>
                <label className="block font-semibold mb-1">Image</label>
                <Input
                  type="file"
                  name="image"
                  accept="image/*"
                  ref={imageInputRef}
                  onChange={handleAdFormChange}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateAdModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default">
                  Create
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
