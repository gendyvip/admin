import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye } from "lucide-react";

export default function ViewUserModal({
  isOpen,
  onClose,
  user,
  getRoleBadge,
  formatDate,
}) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            User Details - {user.fullName}
          </DialogTitle>
          <DialogDescription>
            Complete user information and verification details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Full Name:</span>
                  <span>{user.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span>{user.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">ID Card:</span>
                  <span>{user.idCard}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Gender:</span>
                  <span className="capitalize">{user.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date of Birth:</span>
                  <span>{formatDate(user.dateOfBirth)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Role:</span>
                  <span>{getRoleBadge(user.role)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Verification Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">ID Verification:</span>
                  <Badge
                    className={
                      user.isIdVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {user.isIdVerified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Admin Verification:</span>
                  <Badge
                    className={
                      user.adminVerification
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {user.adminVerification ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Work ID Status:</span>
                  <Badge
                    className={
                      user.isWorkIdVerified === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : user.isWorkIdVerified === "blocked"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {user.isWorkIdVerified === "confirmed"
                      ? "Confirmed"
                      : user.isWorkIdVerified === "blocked"
                      ? "Blocked"
                      : user.isWorkIdVerified || "Pending"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Subscription:</span>
                  <Badge
                    className={
                      user.subscriptionStatus
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {user.subscriptionStatus
                      ? user.subscriptionType
                      : "No Subscription"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="font-medium">User ID:</span>
                  <span className="font-mono text-sm">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Created At:</span>
                  <span>{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Last Updated:</span>
                  <span>{formatDate(user.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Profile Photo:</span>
                  <span>
                    {user.profilePhotoUrl ? "Uploaded" : "Not Uploaded"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* OCR Results */}
          {user.ocrResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">OCR Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Match Result:</span>
                      <Badge
                        className={
                          user.ocrResult.match
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {user.ocrResult.match ? "Match" : "No Match"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Confidence:</span>
                      <span>{user.ocrResult.confidence}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">ID Card Name:</span>
                      <span>{user.ocrResult.id_card_name}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Badge Name:</span>
                      <span>{user.ocrResult.badge_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">National ID:</span>
                      <span>{user.ocrResult.national_id}</span>
                    </div>
                    {user.ocrResult.errors &&
                      user.ocrResult.errors.length > 0 && (
                        <div className="col-span-2">
                          <span className="font-medium text-red-600">
                            Errors:
                          </span>
                          <div className="mt-1 text-sm text-red-600">
                            {user.ocrResult.errors.map((error, index) => (
                              <div key={index}>• {error}</div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Document URLs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document URLs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">ID Front Card:</span>
                  <span className="text-sm text-blue-600">
                    {user.idFrontCardUrl?.secure_url ? (
                      <a
                        href={user.idFrontCardUrl.secure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        View Image
                      </a>
                    ) : (
                      "Not Available"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">ID Back Card:</span>
                  <span className="text-sm text-blue-600">
                    {user.idBackCardUrl?.secure_url ? (
                      <a
                        href={user.idBackCardUrl.secure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        View Image
                      </a>
                    ) : (
                      "Not Available"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Work ID:</span>
                  <span className="text-sm text-blue-600">
                    {user.workIdUrl?.secure_url ? (
                      <a
                        href={user.workIdUrl.secure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        View Image
                      </a>
                    ) : (
                      "Not Available"
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
