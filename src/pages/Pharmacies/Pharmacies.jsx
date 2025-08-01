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
  IconMap,
  IconTrash,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import usePharmaciesStore from "../../store/usePharmacies";
import useDebounce from "../../hooks/use-debounce";
import PharmacyModalView from "./pharmacyModalView.jsx";

export default function Pharmacies() {
  const {
    pharmacies,
    loading,
    error,
    pagination,
    search,
    fetchPharmacies,
    deletePharmacy,
  } = usePharmaciesStore();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 700);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [governorate, setGovernorate] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pharmacyToDelete, setPharmacyToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const governorates = [
    "all",
    "Cairo",
    "Giza",
    "Alexandria",
    "Dakahlia",
    "Red Sea",
    "Beheira",
    "Fayoum",
    "Gharbia",
    "Ismailia",
    "Menofia",
    "Minya",
    "Qaliubiya",
    "New Valley",
    "Suez",
    "Aswan",
    "Assiut",
    "Beni Suef",
    "Port Said",
    "Damietta",
    "Sharkia",
    "South Sinai",
    "Kafr El Sheikh",
    "Matrouh",
    "Luxor",
    "Qena",
    "North Sinai",
    "Sohag",
  ];

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

  // Handle delete pharmacy
  const handleDelete = (pharmacy) => {
    setPharmacyToDelete(pharmacy);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (pharmacyToDelete) {
      setDeletingId(pharmacyToDelete.id);
      try {
        await deletePharmacy(pharmacyToDelete.id);
        setDeleteDialogOpen(false);
        setPharmacyToDelete(null);
      } catch (err) {
        alert(err.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setPharmacyToDelete(null);
  };

  // Filtering by governorate (frontend)
  const filteredPharmacies =
    governorate === "all"
      ? pharmacies
      : pharmacies.filter(
          (p) =>
            p.governorate &&
            p.governorate.toLowerCase() === governorate.toLowerCase()
        );
  // Summary stats
  const all = filteredPharmacies.length;
  const withDeals = filteredPharmacies.filter(
    (p) => p.deals && p.deals.length > 0
  ).length;
  const withoutDeals = filteredPharmacies.filter(
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
                placeholder="Search by owner name or phone"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full md:w-64"
              />
              <Select value={governorate} onValueChange={setGovernorate}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Governorates" />
                </SelectTrigger>
                <SelectContent>
                  {governorates.map((gov) => (
                    <SelectItem key={gov} value={gov}>
                      {gov === "all" ? "All Governorates" : gov}
                    </SelectItem>
                  ))}
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
                  <TableHead>Get Direction</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
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
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded w-10 animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-red-600"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredPharmacies.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-400"
                    >
                      No pharmacies found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPharmacies.map((pharmacy) => (
                    <TableRow key={pharmacy.id}>
                      <TableCell>{pharmacy.name}</TableCell>
                      <TableCell>{pharmacy.licenseNum}</TableCell>
                      <TableCell>{pharmacy.pharmacyPhone}</TableCell>
                      <TableCell>{pharmacy.city}</TableCell>
                      <TableCell>
                        {pharmacy.deals ? pharmacy.deals.length : 0}
                      </TableCell>
                      <TableCell>
                        {pharmacy.location &&
                          Array.isArray(pharmacy.location.coordinates) &&
                          pharmacy.location.coordinates.length === 2 && (
                            <Button
                              size="sm"
                              variant="outline"
                              title="Get Direction"
                              onClick={() => {
                                const [longitude, latitude] =
                                  pharmacy.location.coordinates;
                                const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
                                window.open(url, "_blank");
                              }}
                            >
                              <IconMap className="h-4 w-4 mr-1" />
                              Get Direction
                            </Button>
                          )}
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
                          <Button
                            size="sm"
                            variant="outline"
                            title="Delete Pharmacy"
                            onClick={() => handleDelete(pharmacy)}
                            disabled={deletingId === pharmacy.id}
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
      <PharmacyModalView
        open={isModalOpen}
        onClose={handleCloseModal}
        pharmacy={selectedPharmacy}
      />
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Pharmacy</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              pharmacy from the system.
            </DialogDescription>
          </DialogHeader>
          {pharmacyToDelete && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">Pharmacy ID:</span>
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                {pharmacyToDelete.id}
              </span>
            </div>
          )}
          <div className="space-y-4">
            <div>
              Are you sure you want to delete{" "}
              <span className="font-bold">{pharmacyToDelete?.name}</span>?
            </div>
            <div className="text-sm text-gray-600">
              <strong>License Number:</strong> {pharmacyToDelete?.licenseNum}
            </div>
            <div className="text-sm text-gray-600">
              <strong>City:</strong> {pharmacyToDelete?.city}
            </div>
            <div className="text-sm text-gray-600">
              <strong>Phone:</strong> {pharmacyToDelete?.pharmacyPhone}
            </div>
          </div>
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={cancelDelete}
              disabled={deletingId === pharmacyToDelete?.id}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletingId === pharmacyToDelete?.id}
            >
              {deletingId === pharmacyToDelete?.id ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
