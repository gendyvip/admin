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

export default function AdsCreation() {
  const { ads, loading, error, pagination, stats, fetchAds, clearError } =
    useAdsCreationStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAd, setSelectedAd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch ads on component mount
  useEffect(() => {
    const status = statusFilter === "all" ? "" : statusFilter;
    fetchAds({
      page: currentPage,
      search: searchTerm,
      status,
    });
  }, [currentPage, searchTerm, statusFilter]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRefresh = () => {
    const status = statusFilter === "all" ? "" : statusFilter;
    fetchAds({
      page: currentPage,
      search: searchTerm,
      status,
    });
  };

  const handleRowClick = (ad) => {
    setSelectedAd(ad);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
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
    </TableRow>
  );

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
            <Button variant="default" size="sm">
              <IconPlus className="h-4 w-4 mr-2" />
              Add Ad
            </Button>
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
                    <TableCell colSpan={6} className="text-center py-8">
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
                          {ad.targetPosition?.replace(/"/g, "")}
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
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Advertisement Details</DialogTitle>
            <DialogDescription>
              Full details of the selected advertisement
            </DialogDescription>
          </DialogHeader>
          {selectedAd && (
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Title: </span>
                {selectedAd.title}
              </div>
              <div>
                <span className="font-semibold">Company: </span>
                {selectedAd.companyName}
              </div>
              <div>
                <span className="font-semibold">Position: </span>
                {selectedAd.targetPosition}
              </div>
              <div>
                <span className="font-semibold">Status: </span>
                {getStatusBadge(selectedAd.status)}
              </div>
              <div>
                <span className="font-semibold">Start Date: </span>
                {formatDate(selectedAd.startDate)}
              </div>
              <div>
                <span className="font-semibold">End Date: </span>
                {formatDate(selectedAd.endDate)}
              </div>
              {selectedAd.description && (
                <div>
                  <span className="font-semibold">Description: </span>
                  {selectedAd.description}
                </div>
              )}
              {selectedAd.imageUrl && (
                <div>
                  <span className="font-semibold">Image: </span>
                  <img
                    src={selectedAd.imageUrl}
                    alt="Ad"
                    className="mt-2 rounded max-h-48 border"
                  />
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
    </div>
  );
}
