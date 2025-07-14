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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Ban,
  Eye,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { IconRefresh } from "@tabler/icons-react";
import useUsersStore from "@/store/useUsers";
import { toast } from "sonner";
import ViewUserModal from "./ViewUserModal";

export default function Users() {
  const {
    users,
    loading,
    error,
    pagination,
    stats,
    fetchUsers,
    clearError,
    confirmUser,
    blockUser,
  } = useUsersStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [idCardModalOpen, setIdCardModalOpen] = useState(false);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users and stats on component mount
  useEffect(() => {
    const role = roleFilter === "all" ? "" : roleFilter;
    const status = statusFilter === "all" ? "" : statusFilter;
    fetchUsers({
      page: currentPage,
      search: searchTerm,
      role,
      status,
    });
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

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

  const handleRoleFilterChange = (value) => {
    setRoleFilter(value);
    setCurrentPage(1);
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
    const role = roleFilter === "all" ? "" : roleFilter;
    const status = statusFilter === "all" ? "" : statusFilter;
    fetchUsers({
      page: currentPage,
      search: searchTerm,
      role,
      status,
    });
  };

  const handleBlockClick = (user) => {
    setSelectedUser(user);
    setBlockDialogOpen(true);
  };

  const handleBlockConfirm = async () => {
    try {
      await blockUser(selectedUser.id);
      toast.success("User blocked successfully");
      setBlockDialogOpen(false);
      setSelectedUser(null);

      // Refresh the users list to get updated data
      const role = roleFilter === "all" ? "" : roleFilter;
      const status = statusFilter === "all" ? "" : statusFilter;
      fetchUsers({
        page: currentPage,
        search: searchTerm,
        role,
        status,
      });
    } catch (error) {
      toast.error("Failed to block user");
    }
  };

  const handleIdCardClick = (user) => {
    setSelectedUser(user);
    setIdCardModalOpen(true);
  };

  const handleUserDetailsClick = (user) => {
    setSelectedUser(user);
    setUserDetailsModalOpen(true);
  };

  const handleCloseUserDetails = () => {
    setUserDetailsModalOpen(false);
    setSelectedUser(null);
  };

  const handleVerifyClick = (user) => {
    setSelectedUser(user);
    setVerifyDialogOpen(true);
  };

  const handleVerifyConfirm = async () => {
    try {
      await confirmUser(selectedUser.id);
      toast.success("User verified successfully");
      setVerifyDialogOpen(false);
      setSelectedUser(null);

      // Refresh the users list to get updated data
      const role = roleFilter === "all" ? "" : roleFilter;
      const status = statusFilter === "all" ? "" : statusFilter;
      fetchUsers({
        page: currentPage,
        search: searchTerm,
        role,
        status,
      });
    } catch (error) {
      toast.error("Failed to verify user");
    }
  };

  const getStatusBadge = (user) => {
    if (user.adminVerification && user.isIdVerified) {
      return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
    } else if (user.isIdVerified) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">AI Verified</Badge>
      );
    } else if (!user.adminVerification) {
      return <Badge className="bg-red-100 text-red-800">Blocked</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Unverified</Badge>;
    }
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: "bg-purple-100 text-purple-800",
      pharmacist: "bg-blue-100 text-blue-800",
      user: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={roleColors[role] || "bg-gray-100 text-gray-800"}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (fullName) => {
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Skeleton loading component
  const UserSkeleton = () => (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
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
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="space-x-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Users
              </p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Pharmacists
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.pharmacist}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Verified Users
              </p>
              <p className="text-3xl font-bold text-green-600">
                {stats.verified}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Unverified
              </p>
              <p className="text-3xl font-bold text-red-600">
                {stats.unverified}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>
                Manage your application users and their permissions
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="pharmacist">Pharmacist</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Show skeleton loading
                  Array.from({ length: 5 }).map((_, index) => (
                    <UserSkeleton key={index} />
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        No users found
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.profilePhotoUrl} />
                            <AvatarFallback>
                              {getInitials(user.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {user.idCard}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{user.email}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user)}</TableCell>
                      <TableCell>
                        {user.subscriptionStatus ? (
                          <Badge className="bg-green-100 text-green-800">
                            {user.subscriptionType}
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            No Subscription
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(user.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserDetailsClick(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleIdCardClick(user)}
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                          {user.adminVerification ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBlockClick(user)}
                              className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
                              disabled={loading}
                            >
                              {loading ? "Blocking..." : "Block"}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVerifyClick(user)}
                              className="bg-green-700 text-white hover:bg-green-800 hover:text-white"
                              disabled={loading}
                            >
                              {loading ? "Verifying..." : "Verify"}
                            </Button>
                          )}
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
                Total users: {pagination.total}
              </div>
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

      {/* Block Confirmation Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block User</DialogTitle>
            <DialogDescription>
              Are you sure you want to block{" "}
              <span className="font-semibold">{selectedUser?.fullName}</span>?
              This will prevent them from accessing the application.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBlockDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBlockConfirm}
              disabled={loading}
            >
              {loading ? "Blocking..." : "Block User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ID Card Modal */}
      <Dialog open={idCardModalOpen} onOpenChange={setIdCardModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              ID Documents - {selectedUser?.fullName}
            </DialogTitle>
            <DialogDescription>
              View user's identification documents and work ID
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* ID Front Card */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">ID Front Card</h4>
              {selectedUser?.idFrontCardUrl?.secure_url ? (
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={selectedUser.idFrontCardUrl.secure_url}
                    alt="ID Front Card"
                    className="w-full h-48 object-cover"
                  />
                </div>
              ) : (
                <div className="border rounded-lg h-48 flex items-center justify-center bg-gray-50">
                  <p className="text-gray-500 text-sm">No image available</p>
                </div>
              )}
            </div>

            {/* ID Back Card */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">ID Back Card</h4>
              {selectedUser?.idBackCardUrl?.secure_url ? (
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={selectedUser.idBackCardUrl.secure_url}
                    alt="ID Back Card"
                    className="w-full h-48 object-cover"
                  />
                </div>
              ) : (
                <div className="border rounded-lg h-48 flex items-center justify-center bg-gray-50">
                  <p className="text-gray-500 text-sm">No image available</p>
                </div>
              )}
            </div>

            {/* Work ID */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Work ID</h4>
              {selectedUser?.workIdUrl?.secure_url ? (
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={selectedUser.workIdUrl.secure_url}
                    alt="Work ID"
                    className="w-full h-48 object-cover"
                  />
                </div>
              ) : (
                <div className="border rounded-lg h-48 flex items-center justify-center bg-gray-50">
                  <p className="text-gray-500 text-sm">No image available</p>
                </div>
              )}
            </div>
          </div>

          {/* OCR Results */}
          {selectedUser?.ocrResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3">OCR Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <span className="font-medium">Match:</span>{" "}
                    {selectedUser.ocrResult.match ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-medium">Confidence:</span>{" "}
                    {selectedUser.ocrResult.confidence}
                  </p>
                  <p>
                    <span className="font-medium">ID Card Name:</span>{" "}
                    {selectedUser.ocrResult.id_card_name}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">Badge Name:</span>{" "}
                    {selectedUser.ocrResult.badge_name}
                  </p>
                  <p>
                    <span className="font-medium">National ID:</span>{" "}
                    {selectedUser.ocrResult.national_id}
                  </p>
                  {selectedUser.ocrResult.errors &&
                    selectedUser.ocrResult.errors.length > 0 && (
                      <p>
                        <span className="font-medium text-red-600">
                          Errors:
                        </span>{" "}
                        {selectedUser.ocrResult.errors.join(", ")}
                      </p>
                    )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIdCardModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Modal */}
      <ViewUserModal
        isOpen={userDetailsModalOpen}
        onClose={handleCloseUserDetails}
        user={selectedUser}
        getRoleBadge={getRoleBadge}
        formatDate={formatDate}
      />

      {/* Verify Confirmation Dialog */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify User</DialogTitle>
            <DialogDescription>
              Are you sure you want to verify{" "}
              <span className="font-semibold">{selectedUser?.fullName}</span>?
              This will mark the user as verified.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVerifyDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleVerifyConfirm} disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
