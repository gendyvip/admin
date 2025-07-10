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
import { Button } from "@/components/ui/button";
import {
  IconEye,
  IconPhone,
  IconMail,
  IconRefresh,
  IconUser,
  IconMapPin,
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
import usePharmaciesStore from "../../store/usePharmacies";
import useDebounce from "../../hooks/use-debounce";

function PharmacyModal({ open, onClose, pharmacy }) {
  if (!pharmacy) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl">Pharmacy Details</DialogTitle>
              <DialogDescription>
                View all pharmacy information
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-6">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-sm bg-gray-50 p-3 rounded-md">
                {pharmacy.name}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                License Number
              </label>
              <p className="text-sm bg-gray-50 p-3 rounded-md">
                {pharmacy.licenseNum}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                <IconPhone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{pharmacy.pharmacyPhone}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">City</label>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                <IconMapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{pharmacy.city}</span>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-600">
                Address
              </label>
              <p className="text-sm bg-gray-50 p-3 rounded-md">
                {pharmacy.addressLine1}
              </p>
            </div>
            {pharmacy.imagesUrls && pharmacy.imagesUrls.length > 0 && (
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-600">
                  Pharmacy Image
                </label>
                <img
                  src={pharmacy.imagesUrls[0]}
                  alt="pharmacy"
                  className="w-32 h-32 object-cover rounded-md border"
                />
              </div>
            )}
          </div>
          <Separator />
          {/* Owner Info */}
          {pharmacy.owner && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Owner Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Name
                  </label>
                  <p className="text-sm bg-gray-50 p-3 rounded-md">
                    {pharmacy.owner.fullName}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                    <IconMail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{pharmacy.owner.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Phone
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                    <IconPhone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{pharmacy.owner.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Separator />
          {/* Deals List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Deals</h3>
            {pharmacy.deals && pharmacy.deals.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicine Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pharmacy.deals.map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell>{deal.medicineName}</TableCell>
                        <TableCell>{deal.quantity}</TableCell>
                        <TableCell>{deal.price}</TableCell>
                        <TableCell>{deal.boxStatus}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-gray-500">No deals for this pharmacy.</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Pharmacies() {
  const { pharmacies, loading, error, pagination, search, fetchPharmacies } =
    usePharmaciesStore();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 700);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPharmacies(1, "");
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchPharmacies(1, debouncedSearch);
    // eslint-disable-next-line
  }, [debouncedSearch]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPharmacies(newPage, debouncedSearch);
    }
  };

  const handleRefresh = () => {
    fetchPharmacies(pagination.page, debouncedSearch);
  };

  const handleView = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPharmacy(null);
  };

  // Summary stats
  const all = pagination.total;
  const withDeals = pharmacies.filter(
    (p) => p.deals && p.deals.length > 0
  ).length;
  const withoutDeals = pharmacies.filter(
    (p) => !p.deals || p.deals.length === 0
  ).length;

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Pharmacies</CardTitle>
              <CardDescription>Manage all pharmacies</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <Input
                type="text"
                placeholder="Search by pharmacy name"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full md:w-64"
              />
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
              <h3 className="font-semibold text-sm text-gray-600">
                All Pharmacies
              </h3>
              <p className="text-2xl font-bold">{all}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-sm text-gray-600">
                With Deals
              </h3>
              <p className="text-2xl font-bold text-green-600">{withDeals}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-sm text-gray-600">
                Without Deals
              </h3>
              <p className="text-2xl font-bold text-red-600">{withoutDeals}</p>
            </div>
          </div>
          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>License Number</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Deals Count</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading pharmacies...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-red-600"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : pharmacies.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-400"
                    >
                      No pharmacies found.
                    </TableCell>
                  </TableRow>
                ) : (
                  pharmacies.map((pharmacy) => (
                    <TableRow key={pharmacy.id}>
                      <TableCell>{pharmacy.name}</TableCell>
                      <TableCell>{pharmacy.licenseNum}</TableCell>
                      <TableCell>{pharmacy.pharmacyPhone}</TableCell>
                      <TableCell>{pharmacy.city}</TableCell>
                      <TableCell>
                        {pharmacy.deals ? pharmacy.deals.length : 0}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            title="View Details"
                            onClick={() => handleView(pharmacy)}
                          >
                            <IconEye className="h-4 w-4" />
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
                disabled={pagination.page === 1 || loading}
              >
                Previous
              </Button>
              <span className="mx-2 text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages || loading}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Modal */}
      <PharmacyModal
        open={isModalOpen}
        onClose={handleCloseModal}
        pharmacy={selectedPharmacy}
      />
    </div>
  );
}
