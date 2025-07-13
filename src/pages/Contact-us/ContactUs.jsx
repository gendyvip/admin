import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconRefresh, IconTrash } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IconEye } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import ContactModalView from "./ContactModalView";
import useContactUsStore from "../../store/useContact-us";
import useDebounce from "../../hooks/use-debounce";

export default function ContactUs() {
  const {
    requests,
    stats,
    pagination,
    loading,
    error,
    fetchContactUsRequests,
    fetchStatusCounts,
    refreshData,
    clearError,
    updateContactUsStatus,
    deleteContactUsRequest,
  } = useContactUsStore();

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 700);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  useEffect(() => {
    fetchContactUsRequests(1, "");
    fetchStatusCounts();
  }, [fetchContactUsRequests, fetchStatusCounts]);

  // When debounced search changes, reset to page 1 and fetch from backend
  useEffect(() => {
    fetchContactUsRequests(1, debouncedSearch);
  }, [debouncedSearch, fetchContactUsRequests]);

  // Filtered requests by status (frontend filtering)
  const filteredRequests = requests.filter((req) => {
    const statusMatch =
      statusFilter === "all" ||
      req.status.toLowerCase() === statusFilter.toLowerCase();
    return statusMatch;
  });

  const handleRefresh = () => {
    fetchContactUsRequests(pagination.page, debouncedSearch);
  };

  const handlePageChange = (newPage) => {
    fetchContactUsRequests(newPage, debouncedSearch);
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  // Clean and simple status update
  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateContactUsStatus(id, status);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle delete request
  const handleDelete = async (id) => {
    setRequestToDelete(requests.find((req) => req.id === id));
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (requestToDelete) {
      setDeletingId(requestToDelete.id);
      try {
        await deleteContactUsRequest(requestToDelete.id);
        // Close modal if the deleted request was open
        if (selectedRequest && selectedRequest.id === requestToDelete.id) {
          handleCloseModal();
        }
      } catch (err) {
        alert(err.message);
      } finally {
        setDeletingId(null);
        setDeleteDialogOpen(false);
        setRequestToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setRequestToDelete(null);
  };

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Contact Us Requests</CardTitle>
              <CardDescription>
                Manage contact us messages from users
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
              <Input
                type="text"
                placeholder="Search by name, email, or phone"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full md:w-64"
              />
              <Select onValueChange={setStatusFilter} value={statusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="opened">Opened</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
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
          <div className="space-y-6">
            {/* Summary Cards */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-4 border rounded-lg animate-pulse h-20 bg-gray-100"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-sm text-gray-600">
                    Total Requests
                  </h3>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-sm text-gray-600">
                    Opened
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.opened}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-sm text-gray-600">
                    Waiting
                  </h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.waiting || 0}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-sm text-gray-600">
                    Closed
                  </h3>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.closed}
                  </p>
                </div>
              </div>
            )}

            {/* Requests Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-gray-400 py-8"
                      >
                        No contact requests found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>
                          <div className="font-medium max-w-xs">{req.name}</div>
                          <div className="text-sm text-gray-500">
                            ID: {req.id.slice(0, 8)}...
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm max-w-xs">{req.email}</div>
                          <div className="text-sm text-gray-500">
                            {req.phone}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm max-w-xs">{req.subject}</div>
                        </TableCell>
                        <TableCell>
                          <div
                            className="max-w-xs truncate"
                            title={req.message}
                          >
                            {req.message.length > 20
                              ? req.message.substring(0, 20) + "..."
                              : req.message}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              req.status.toLowerCase() === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : req.status.toLowerCase() === "opened"
                                ? "bg-green-100 text-green-800"
                                : req.status.toLowerCase() === "closed"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {req.status.charAt(0).toUpperCase() +
                              req.status.slice(1).toLowerCase()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              title="View Details"
                              onClick={() => handleViewRequest(req)}
                            >
                              <IconEye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-white bg-green-700 hover:bg-green-800 hover:text-white"
                              onClick={() =>
                                handleUpdateStatus(req.id, "opened")
                              }
                              disabled={updatingId === req.id}
                            >
                              {/* {updatingId === req.id ? "Opened" : "Opened"} */}
                              Opened
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-white bg-red-600 hover:bg-red-700 hover:text-white"
                              onClick={() =>
                                handleUpdateStatus(req.id, "closed")
                              }
                              disabled={updatingId === req.id}
                            >
                              {/* {updatingId === req.id ? "Closed..." : "Closed"} */}
                              Closed
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              title="Delete"
                              onClick={() => handleDelete(req.id)}
                              disabled={deletingId === req.id}
                              className="text-red-600 hover:text-red-700"
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
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {(pagination.page - 1) * 10 + 1} to{" "}
                  {Math.min(pagination.page * 10, pagination.total)} of{" "}
                  {pagination.total} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1 || loading}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={
                          pageNum === pagination.page ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={
                      pagination.page >= pagination.totalPages || loading
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Modal */}
      <ContactModalView
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        request={selectedRequest}
        onOpenAction={(id) => handleUpdateStatus(id, "opened")}
        onCloseAction={(id) => handleUpdateStatus(id, "closed")}
        onDeleteAction={(id) => {
          setRequestToDelete(requests.find((req) => req.id === id));
          setDeleteDialogOpen(true);
          handleCloseModal(); // Close the view modal when opening delete confirmation
        }}
        updatingStatus={
          (updatingId || deletingId) &&
          selectedRequest &&
          (updatingId === selectedRequest.id ||
            deletingId === selectedRequest.id)
            ? {
                requestId: updatingId || deletingId,
                status: selectedRequest.status,
              }
            : null
        }
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Contact Request</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              contact request from the system.
            </DialogDescription>
          </DialogHeader>
          {requestToDelete && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">Request ID:</span>
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                {requestToDelete.id}
              </span>
            </div>
          )}
          <div className="space-y-4">
            <div>
              Are you sure you want to delete the contact request from{" "}
              <span className="font-bold">{requestToDelete?.name}</span>?
            </div>
            <div className="text-sm text-gray-600">
              <strong>Email:</strong> {requestToDelete?.email}
            </div>
            <div className="text-sm text-gray-600">
              <strong>Subject:</strong> {requestToDelete?.subject}
            </div>
          </div>
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={cancelDelete}
              disabled={deletingId === requestToDelete?.id}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletingId === requestToDelete?.id}
            >
              {deletingId === requestToDelete?.id ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
