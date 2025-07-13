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
} from "@tabler/icons-react";
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
import PharmacyModalView from "../Pharmacies/pharmacyModalView.jsx";

export default function ListedPharmacies() {
  const { pharmacies, loading, error, pagination, search, fetchPharmacies } =
    usePharmaciesStore();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 700);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [governorate, setGovernorate] = useState("all");

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

  // Filter for isForSale only
  const forSalePharmacies = pharmacies.filter((p) => p.isForSale === true);
  // Filtering by governorate (frontend)
  const filteredPharmacies =
    governorate === "all"
      ? forSalePharmacies
      : forSalePharmacies.filter(
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
                {[...Array(7)].map((_, i) => (
                  <th key={i} className="px-4 py-2">
                    <div className="h-4 w-20 bg-gray-300 rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, row) => (
                <tr key={row}>
                  {/* اسم الصيدلية */}
                  <td className="px-4 py-4">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </td>
                  {/* رخصة */}
                  <td className="px-4 py-4">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </td>
                  {/* تليفون */}
                  <td className="px-4 py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </td>
                  {/* مدينة */}
                  <td className="px-4 py-4">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </td>
                  {/* عدد عروض */}
                  <td className="px-4 py-4">
                    <div className="h-4 w-10 bg-gray-200 rounded" />
                  </td>
                  {/* زر اتجاه */}
                  <td className="px-4 py-4">
                    <div className="h-8 w-24 bg-gray-300 rounded" />
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
              <CardTitle>Listed Pharmacies</CardTitle>
              <CardDescription>Manage all pharmacies for sale</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <Input
                type="text"
                placeholder="Search by pharmacy name"
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
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading pharmacies...
                    </TableCell>
                  </TableRow>
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
    </div>
  );
}
