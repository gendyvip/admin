import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconRefresh } from "@tabler/icons-react";
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
import ContactModalView from "./ContactModalView";
import useContactUsStore from "../../store/useContact-us";
import { contactUsService } from "../../api/contact-us";

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
  } = useContactUsStore();

  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchContactUsRequests(1);
    fetchStatusCounts();
  }, [fetchContactUsRequests, fetchStatusCounts]);

  // Filtered requests by search
  const filteredRequests = requests.filter((req) => {
    const q = search.toLowerCase();
    return (
      req.name.toLowerCase().includes(q) ||
      req.email.toLowerCase().includes(q) ||
      req.phone.toLowerCase().includes(q)
    );
  });

  const handleRefresh = () => {
    refreshData(pagination.page);
  };

  const handlePageChange = (newPage) => {
    fetchContactUsRequests(newPage);
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
      await contactUsService.updateContactUsStatus(id, status);
      await fetchContactUsRequests(pagination.page);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="px-4 lg:px-6">
      {/* Test button outside the table to confirm onClick works */}
      <Button onClick={() => alert("Test button clicked!")}>
        Test Outside Button
      </Button>
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                    Pending
                  </h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pending}
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
      />
    </div>
  );
}
