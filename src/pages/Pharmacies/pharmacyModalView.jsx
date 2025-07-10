import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconPhone, IconMail, IconMapPin } from "@tabler/icons-react";

export default function PharmacyModalView({ open, onClose, pharmacy }) {
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Governorate
              </label>
              <p className="text-sm bg-gray-50 p-3 rounded-md">
                {pharmacy.governorate}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Zip Code
              </label>
              <p className="text-sm bg-gray-50 p-3 rounded-md">
                {pharmacy.zipCode}
              </p>
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
