import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IconRefresh, IconPlus, IconEye } from "@tabler/icons-react";
import { IconTrash } from "@tabler/icons-react";
import useAdsCreationStore from "../../store/useAdsCreation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import adsCreationService from "@/api/ads-creation";
import DatePicker from "@/components/ui/date-picker";
import { MultiSelect } from "@/components/ui/multi-select";

export default function AdsCreation() {
  const { ads, loading, error, pagination, stats, fetchAds, clearError } =
    useAdsCreationStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [targetPositionFilter, setTargetPositionFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAd, setSelectedAd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingAdId, setUpdatingAdId] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [dateModalAd, setDateModalAd] = useState(null);
  const [newDates, setNewDates] = useState({ startDate: null, endDate: null });
  const [deleteModalAd, setDeleteModalAd] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  // Fetch ads on component mount
  useEffect(() => {
    const status = statusFilter === "all" ? "" : statusFilter;
    fetchAds({
      page: currentPage,
      search: searchTerm,
      status,
      targetPosition: targetPositionFilter.join(","),
    });
  }, [currentPage, searchTerm, statusFilter, targetPositionFilter]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.dismiss(); // Dismiss any loading toasts first
      toast.error(error);
    }
  }, [error]);

  // Show success toast when data is loaded successfully
  useEffect(() => {
    if (ads.length > 0 && !loading && !error) {
      toast.dismiss(); // Dismiss any loading toasts first
      toast.success(`Loaded ${ads.length} advertisements successfully`);
    }
  }, [ads.length, loading, error]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    if (searchValue.length > 2 || searchValue.length === 0) {
      toast.loading(`Searching for "${searchValue}"...`);
    }
    setSearchTerm(searchValue);
  };

  const handleStatusFilterChange = (value) => {
    const filterText =
      value === "all" ? "All Status" : value === "true" ? "Active" : "Inactive";
    toast.loading(`Filtering by ${filterText}...`);
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleTargetPositionFilterChange = (selectedPositions) => {
    const filterText =
      selectedPositions.length === 0
        ? "All Positions"
        : selectedPositions.length === 1
        ? getLabelFromValue(selectedPositions[0])
        : `${selectedPositions.length} positions`;
    toast.loading(`Filtering by ${filterText}...`);
    setTargetPositionFilter(selectedPositions);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      toast.loading(`Loading page ${newPage}...`);
      setCurrentPage(newPage);
    } else {
      toast.error("Invalid page number");
    }
  };

  const handleRefresh = () => {
    const status = statusFilter === "all" ? "" : statusFilter;
    toast.loading("Refreshing advertisements...");
    fetchAds({
      page: currentPage,
      search: searchTerm,
      status,
      targetPosition: targetPositionFilter.join(","),
    })
      .then(() => {
        toast.success("Advertisements refreshed successfully");
      })
      .catch((error) => {
        toast.error(`Failed to refresh: ${error.message}`);
      });
  };

  const handleRowClick = (ad) => {
    toast.info(`Viewing details for "${ad.title}"`);
    setSelectedAd(ad);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    toast.info("Closing advertisement details");
    setIsModalOpen(false);
    setSelectedAd(null);
  };

  const getStatusBadge = (status) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Inactive</Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Skeleton loading component
  const AdSkeleton = () => (
    <TableRow>
      <TableCell>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-5 w-5 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2 justify-center">
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </TableCell>
    </TableRow>
  );

  // Update ad status handler
  const handleUpdateStatus = async (adId, status, extra = {}) => {
    setUpdatingAdId(adId);
    const statusText = status ? "activated" : "deactivated";
    toast.loading(`Updating advertisement status to ${statusText}...`);

    try {
      console.log("Updating ad status:", { adId, status, extra });
      await adsCreationService.updateAdStatus(adId, status, extra);
      toast.success(`Advertisement ${statusText} successfully`);
      fetchAds({
        page: currentPage,
        search: searchTerm,
        status: statusFilter === "all" ? "" : statusFilter,
        targetPosition: targetPositionFilter.join(","),
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`Failed to ${statusText} advertisement: ${error.message}`);
    } finally {
      setUpdatingAdId(null);
    }
  };

  // Delete ad handler (modal version)
  const handleDeleteAd = async () => {
    if (!deleteModalAd) return;
    setUpdatingAdId(deleteModalAd.id);
    toast.loading("Deleting advertisement...");
    try {
      await adsCreationService.deleteAd(deleteModalAd.id);
      toast.success("Advertisement deleted successfully");
      fetchAds({
        page: currentPage,
        search: searchTerm,
        status: statusFilter === "all" ? "" : statusFilter,
        targetPosition: targetPositionFilter.join(","),
      });
    } catch (error) {
      toast.error(`Failed to delete advertisement: ${error.message}`);
    } finally {
      setUpdatingAdId(null);
      setShowDeleteModal(false);
      setDeleteModalAd(null);
    }
  };

  // Handle Active button click: always open date modal
  const handleActiveClick = (ad) => {
    toast.info("Please set new dates to activate this advertisement.");
    setDateModalAd(ad);
    setNewDates({ startDate: null, endDate: null });
    setShowDateModal(true);
  };

  // Confirm new dates modal
  const handleConfirmDates = async () => {
    if (!dateModalAd) return;
    if (!newDates.startDate || !newDates.endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }
    setShowDateModal(false);
    toast.loading("Updating advertisement with new dates...");

    try {
      await handleUpdateStatus(dateModalAd.id, true, {
        startDate: newDates.startDate.toISOString().slice(0, 10),
        endDate: newDates.endDate.toISOString().slice(0, 10),
      });
      toast.success("Advertisement updated with new dates successfully");
    } catch (error) {
      toast.error(`Failed to update advertisement dates: ${error.message}`);
    } finally {
      setDateModalAd(null);
      setNewDates({ startDate: null, endDate: null });
    }
  };

  // Error state
  if (error) {
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
    <div className="px-4 lg:px-6 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Ads
              </p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Active Ads
              </p>
              <p className="text-3xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Inactive Ads
              </p>
              <p className="text-3xl font-bold text-red-600">
                {stats.inactive}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ads Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Advertisements Management</CardTitle>
              <CardDescription>
                Manage your application advertisements
              </CardDescription>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <IconRefresh className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                placeholder="Search by title or company name..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <MultiSelect
              options={targetPositionOptions}
              selected={targetPositionFilter}
              onChange={handleTargetPositionFilterChange}
              placeholder="All Positions"
              className="w-full sm:w-48"
            />
          </div>

          {/* Ads Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title & Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Show skeleton loading
                  Array.from({ length: 5 }).map((_, index) => (
                    <AdSkeleton key={index} />
                  ))
                ) : ads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        No advertisements found
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  ads.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {ad.title?.replace(/"/g, "")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {ad.companyName?.replace(/"/g, "")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {ad.targetPosition &&
                          Array.isArray(ad.targetPosition) ? (
                            ad.targetPosition.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {ad.targetPosition.map((position, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {getLabelFromValue(
                                      position.replace(/"/g, "")
                                    )}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">
                                No position
                              </span>
                            )
                          ) : ad.targetPosition ? (
                            // Fallback for string format (backward compatibility)
                            <Badge variant="outline" className="text-xs">
                              {getLabelFromValue(
                                ad.targetPosition.replace(/"/g, "")
                              )}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">
                              No position
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(ad.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(ad.startDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(ad.endDate)}</div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          title="View Details"
                          onClick={() => handleRowClick(ad)}
                        >
                          <IconEye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-700 hover:bg-green-800 hover:text-white text-white "
                            onClick={() => handleActiveClick(ad)}
                            disabled={
                              ad.status === true ||
                              updatingAdId === ad.id ||
                              loading
                            }
                          >
                            Active
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-600 text-white hover:bg-red-700 hover:text-white"
                            disabled={
                              ad.status === false ||
                              updatingAdId === ad.id ||
                              loading
                            }
                            onClick={() => handleUpdateStatus(ad.id, false)}
                          >
                            Inactive
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-gray-100 text-red-600 hover:bg-red-100 border border-red-200"
                            title="Delete Advertisement"
                            disabled={updatingAdId === ad.id || loading}
                            onClick={() => {
                              setDeleteModalAd(ad);
                              setShowDeleteModal(true);
                            }}
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-end mt-4">
              <div className="text-sm text-muted-foreground mr-4">
                Showing page {pagination.page} of {pagination.totalPages} |
                Total ads: {pagination.total}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1 mx-2">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <Button
                    key={page}
                    variant={page === pagination.page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    disabled={loading}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loading}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ad Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Advertisement Details</DialogTitle>
            <DialogDescription>
              Full details of the selected advertisement
            </DialogDescription>
          </DialogHeader>
          {selectedAd && (
            <div className="space-y-6">
              {/* Advertisement ID */}
              <div className="flex justify-between items-center max-md:flex-col max-md:items-start max-md:gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Advertisement ID:
                  </span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {selectedAd.id}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  {getStatusBadge(selectedAd.status)}
                </div>
              </div>

              <div className="border-t pt-6">
                {/* Advertisement Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Advertisement Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">
                        Title
                      </label>
                      <p className="text-sm bg-gray-50 p-3 rounded-md">
                        {selectedAd.title}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">
                        Company Name
                      </label>
                      <p className="text-sm bg-gray-50 p-3 rounded-md">
                        {selectedAd.companyName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">
                        Target Positions
                      </label>
                      <div className="bg-gray-50 p-3 rounded-md">
                        {selectedAd.targetPosition &&
                        Array.isArray(selectedAd.targetPosition) ? (
                          selectedAd.targetPosition.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {selectedAd.targetPosition.map(
                                (position, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {getLabelFromValue(
                                      position.replace(/"/g, "")
                                    )}
                                  </Badge>
                                )
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              No position
                            </span>
                          )
                        ) : selectedAd.targetPosition ? (
                          // Fallback for string format (backward compatibility)
                          <Badge variant="secondary" className="text-xs">
                            {getLabelFromValue(
                              selectedAd.targetPosition.replace(/"/g, "")
                            )}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">
                            No position
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">
                        Status
                      </label>
                      <div className="bg-gray-50 p-3 rounded-md">
                        {getStatusBadge(selectedAd.status)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">
                        Start Date
                      </label>
                      <p className="text-sm bg-gray-50 p-3 rounded-md">
                        {formatDate(selectedAd.startDate)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">
                        End Date
                      </label>
                      <p className="text-sm bg-gray-50 p-3 rounded-md">
                        {formatDate(selectedAd.endDate)}
                      </p>
                    </div>
                    {selectedAd.imageAlt && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">
                          Image Alt Text
                        </label>
                        <p className="text-sm bg-gray-50 p-3 rounded-md">
                          {selectedAd.imageAlt}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Advertisement Request Information */}
              {selectedAd.advertisementRequest && (
                <>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Request Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">
                          Request ID
                        </label>
                        <p className="text-sm bg-gray-50 p-3 rounded-md font-mono">
                          {selectedAd.advertisementRequest.id}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">
                          Request Status
                        </label>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <Badge
                            variant={
                              selectedAd.advertisementRequest.status ===
                              "accepted"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              selectedAd.advertisementRequest.status ===
                              "accepted"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {selectedAd.advertisementRequest.status
                              .charAt(0)
                              .toUpperCase() +
                              selectedAd.advertisementRequest.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">
                          Full Name
                        </label>
                        <p className="text-sm bg-gray-50 p-3 rounded-md">
                          {selectedAd.advertisementRequest.fullName}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">
                          Email
                        </label>
                        <p className="text-sm bg-gray-50 p-3 rounded-md">
                          {selectedAd.advertisementRequest.email}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">
                          Phone
                        </label>
                        <p className="text-sm bg-gray-50 p-3 rounded-md">
                          {selectedAd.advertisementRequest.phone}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">
                          Request Date
                        </label>
                        <p className="text-sm bg-gray-50 p-3 rounded-md">
                          {formatDate(
                            selectedAd.advertisementRequest.createdAt
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <label className="text-sm font-medium text-gray-600">
                        Request Content
                      </label>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm whitespace-pre-wrap">
                          {selectedAd.advertisementRequest.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Image Display */}
              {selectedAd.imageUrl && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Advertisement Image
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <img
                      src={selectedAd.imageUrl}
                      alt={selectedAd.imageAlt || "Advertisement"}
                      className="rounded max-h-64 mx-auto border"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedAd.description && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Description</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">
                      {selectedAd.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal for new dates when activating expired ad */}
      <Dialog open={showDateModal} onOpenChange={setShowDateModal}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Set New Dates</DialogTitle>
            <DialogDescription>
              Please select new start and end dates for this advertisement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <DatePicker
              label="Start Date"
              value={newDates.startDate}
              onChange={(date) =>
                setNewDates((nd) => ({ ...nd, startDate: date }))
              }
              placeholder="Select start date"
            />
            <DatePicker
              label="End Date"
              value={newDates.endDate}
              onChange={(date) =>
                setNewDates((nd) => ({ ...nd, endDate: date }))
              }
              placeholder="Select end date"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDateModal(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleConfirmDates}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal for delete confirmation */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Delete Advertisement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this advertisement? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="font-medium">{deleteModalAd?.title}</div>
            <div className="text-sm text-muted-foreground">
              {deleteModalAd?.companyName}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteModalAd(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAd}
              disabled={updatingAdId === deleteModalAd?.id}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
