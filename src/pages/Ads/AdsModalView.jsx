import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  IconX,
  IconMail,
  IconPhone,
  IconCalendar,
  IconUser,
} from "@tabler/icons-react";

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

export default function AdsModalView({
  isOpen,
  onClose,
  request,
  onAccept,
  onReject,
  onDelete,
  updatingStatus,
}) {
  if (!request) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl">
                Advertisement Request Details
              </DialogTitle>
              <DialogDescription>
                View complete information about this advertisement request
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and ID */}
          <div className="flex justify-between items-center max-md:flex-col max-md:items-start max-md:gap-2">
            <div className="flex items-center gap-2">
              <IconUser className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Request ID:</span>
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {request.id}
              </span>
            </div>
            {getStatusBadge(request.status)}
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <p className="text-sm bg-gray-50 p-3 rounded-md">
                  {request.fullName}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                  <IconMail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{request.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Phone
                </label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                  <IconPhone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{request.phone}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Submitted Date
                </label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                  <IconCalendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {formatDate(request.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Advertisement Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Advertisement Content</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Content
              </label>
              <div className="bg-gray-50 p-4 rounded-md w-full max-w-[95vw] sm:w-[600px] break-all">
                <p className="text-sm whitespace-pre-wrap break-all">
                  {request.content}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {request.additionalInfo && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Additional Information
                </h3>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {request.additionalInfo}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <Separator />
          <div className="flex justify-end gap-3 max-md:grid max-md:grid-cols-2 max-md:w-full max-md:justify-center">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {request.status !== "accepted" && (
              <Button
                className="bg-green-800 hover:bg-green-900 hover:text-white text-white"
                variant="outline"
                onClick={() => onAccept && onAccept(request.id)}
                disabled={
                  updatingStatus?.requestId === request.id &&
                  updatingStatus?.status === "accepted"
                }
              >
                {updatingStatus?.requestId === request.id &&
                updatingStatus?.status === "accepted"
                  ? "Updating..."
                  : "Accept"}
              </Button>
            )}
            {request.status !== "rejected" && (
              <Button
                className="bg-red-500 hover:bg-red-700 hover:text-white text-white"
                variant="outline"
                onClick={() => onReject && onReject(request.id)}
                disabled={
                  updatingStatus?.requestId === request.id &&
                  updatingStatus?.status === "rejected"
                }
              >
                {updatingStatus?.requestId === request.id &&
                updatingStatus?.status === "rejected"
                  ? "Updating..."
                  : "Reject"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
