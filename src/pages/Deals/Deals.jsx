import React, { useEffect, useState } from "react";
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
import {
  IconTrash,
  IconEye,
  IconCalendar,
  IconUser,
  IconPhone,
  IconMail,
  IconRefresh,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import useDealsStore from "../../store/useDeals";
import useDebounce from "../../hooks/use-debounce";

// Helper: format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper: badge for box status
const getBoxStatusBadge = (status) => {
  const config = {
    damaged: { variant: "outline", className: "bg-red-100 text-red-800" },
    valid: { variant: "default", className: "bg-green-100 text-green-800" },
  };
  const c = config[status] || {
    variant: "secondary",
    className: "bg-gray-100 text-gray-800",
  };
  return (
    <Badge variant={c.variant} className={c.className}>
      {status}
    </Badge>
  );
};

// Modal for deal details
function DealModal({ open, onClose, deal, onDelete }) {
  if (!deal) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl">Deal Details</DialogTitle>
              <DialogDescription>View all deal information</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-6">
          {/* Status and ID */}
          <div className="flex justify-between items-center max-md:flex-col max-md:items-start max-md:gap-2">
            <div className="flex items-center gap-2">
              <IconUser className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Deal ID:</span>
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {deal.id}
              </span>
            </div>
            {getBoxStatusBadge(deal.boxStatus)}
          </div>
          <Separator />
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Medicine Name
              </label>
              <p className="text-sm bg-gray-50 p-3 rounded-md">
                {deal.medicineName}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Quantity
              </label>
              <p className="text-sm bg-gray-50 p-3 rounded-md">
                {deal.quantity}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Price</label>
              <p className="text-sm bg-gray-50 p-3 rounded-md">{deal.price}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Expiry Date
              </label>
              <p className="text-sm bg-gray-50 p-3 rounded-md">
                {formatDate(deal.expiryDate)}
              </p>
            </div>
          </div>
          <Separator />
          {/* Pharmacy Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pharmacy Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Pharmacy Name
                </label>
                <p className="text-sm bg-gray-50 p-3 rounded-md">
                  {deal.pharmacy.name}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  License Number
                </label>
                <p className="text-sm bg-gray-50 p-3 rounded-md">
                  {deal.pharmacy.licenseNum}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Phone
                </label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                  <IconPhone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{deal.pharmacy.pharmacyPhone}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Address
                </label>
                <p className="text-sm bg-gray-50 p-3 rounded-md">
                  {deal.pharmacy.addressLine1}, {deal.pharmacy.city}
                </p>
              </div>
            </div>
            {deal.pharmacy.imagesUrls &&
              deal.pharmacy.imagesUrls.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Pharmacy Image
                  </label>
                  <img
                    src={deal.pharmacy.imagesUrls[0]}
                    alt="pharmacy"
                    className="w-32 h-32 object-cover rounded-md border"
                  />
                </div>
              )}
          </div>
          <Separator />
          {/* Posted By */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Posted By</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Name
                </label>
                <p className="text-sm bg-gray-50 p-3 rounded-md">
                  {deal.postedBy.fullName}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                  <IconMail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{deal.postedBy.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Phone
                </label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                  <IconPhone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{deal.postedBy.phone}</span>
                </div>
              </div>
            </div>
          </div>
          <Separator />
          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={() => onDelete(deal.id)}
            >
              <IconTrash className="h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Deals() {
  const { deals, loading, error, pagination, search, fetchDeals, deleteDeal } =
    useDealsStore();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 700);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boxStatusFilter, setBoxStatusFilter] = useState("all");

  useEffect(() => {
    fetchDeals(1, "");
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchDeals(1, debouncedSearch);
    // eslint-disable-next-line
  }, [debouncedSearch]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchDeals(newPage, debouncedSearch);
    }
  };

  const handleRefresh = () => {
    fetchDeals(pagination.page, debouncedSearch);
  };

  const handleView = (deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDeal(null);
  };
  const handleDelete = async (id) => {
    await deleteDeal(id);
    handleCloseModal();
  };

  // Summary stats
  const filteredDeals =
    boxStatusFilter === "all"
      ? deals
      : deals.filter((d) =>
          boxStatusFilter === "damaged"
            ? d.boxStatus === "damaged"
            : d.boxStatus === "good" || d.boxStatus === "valid"
        );
  const opened = filteredDeals.filter((d) => !d.isClosed).length;
  const closed = filteredDeals.filter((d) => d.isClosed).length;

  if (loading) {
    return (
      <div className="px-4 lg:px-6">
        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
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
                  {/* اسم الدواء */}
                  <td className="px-4 py-4">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </td>
                  {/* كمية */}
                  <td className="px-4 py-4">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </td>
                  {/* سعر */}
                  <td className="px-4 py-4">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Skeleton */}
        <div className="flex justify-end mt-4 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-8 bg-gray-300 rounded" />
          ))}
          <div className="h-8 w-16 bg-blue-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Deals</CardTitle>
              <CardDescription>Manage all deals</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <Input
                type="text"
                placeholder="Search by medicine name"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full md:w-64"
              />
              <Select
                value={boxStatusFilter}
                onValueChange={setBoxStatusFilter}
              >
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                </SelectContent>
              </Select>
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
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-sm text-gray-600">All Deals</h3>
              <p className="text-2xl font-bold">{filteredDeals.length}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-sm text-gray-600">
                Opened Deals
              </h3>
              <p className="text-2xl font-bold text-green-600">{opened}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-sm text-gray-600">
                Closed Deals
              </h3>
              <p className="text-2xl font-bold text-red-600">{closed}</p>
            </div>
          </div>
          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading deals...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-red-600"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredDeals.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-400"
                    >
                      No deals found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell>{deal.medicineName}</TableCell>
                      <TableCell>{deal.quantity}</TableCell>
                      <TableCell>{deal.price}</TableCell>
                      <TableCell>{getBoxStatusBadge(deal.boxStatus)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            title="View Details"
                            onClick={() => handleView(deal)}
                          >
                            <IconEye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            title="Delete"
                            onClick={() => handleDelete(deal.id)}
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
            <div className="flex items-center justify-end mt-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const { page, totalPages } = pagination;
                  const windowSize = 2;
                  let start = Math.max(2, page - windowSize);
                  let end = Math.min(totalPages - 1, page + windowSize);
                  // Always show first page
                  pages.push(
                    <Button
                      key={1}
                      variant={page === 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={loading}
                      className="w-8 h-8 p-0"
                    >
                      1
                    </Button>
                  );
                  // Ellipsis before window
                  if (start > 2) {
                    pages.push(
                      <span key="start-ellipsis" className="px-1">
                        ...
                      </span>
                    );
                  }
                  // Windowed pages
                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <Button
                        key={i}
                        variant={page === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(i)}
                        disabled={loading}
                        className="w-8 h-8 p-0"
                      >
                        {i}
                      </Button>
                    );
                  }
                  // Ellipsis after window
                  if (end < totalPages - 1) {
                    pages.push(
                      <span key="end-ellipsis" className="px-1">
                        ...
                      </span>
                    );
                  }
                  // Always show last page
                  if (totalPages > 1) {
                    pages.push(
                      <Button
                        key={totalPages}
                        variant={page === totalPages ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={loading}
                        className="w-8 h-8 p-0"
                      >
                        {totalPages}
                      </Button>
                    );
                  }
                  return pages;
                })()}
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
      {/* Modal */}
      <DealModal
        open={isModalOpen}
        onClose={handleCloseModal}
        deal={selectedDeal}
        onDelete={handleDelete}
      />
    </div>
  );
}
