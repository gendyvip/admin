import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchWaitingUsers } from "@/api/ai-api";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import usersService from "@/api/users";
import { toast } from "sonner";

export default function Ocr() {
  const [data, setData] = useState({
    users: [],
    total: 0,
    count: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    setLoading(true);
    fetchWaitingUsers()
      .then((res) => {
        console.log("Waiting Users API response:", res);
        // حماية: لو res.users غير موجودة
        setData(res && Array.isArray(res.users) ? res : { ...res, users: [] });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching data");
        setLoading(false);
      });
  }, []);

  // إحصائيات سريعة
  let usersArr = [];
  if (Array.isArray(data.users)) {
    usersArr = data.users;
  } else if (data.users && typeof data.users === "object") {
    usersArr = [data.users];
  }
  const totalUsers = usersArr.length;
  const totalSubscribed = usersArr.filter((u) => u.subscriptionStatus).length;
  const totalUnsubscribed = totalUsers - totalSubscribed;
  const totalVerified = usersArr.filter((u) => u.isIdVerified).length;

  // Handle Accept/Reject
  const handleUserAction = async (userId, action) => {
    setActionLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      if (action === "accept") {
        await usersService.confirmUser(userId);
        toast.success("User accepted successfully");
      } else if (action === "reject") {
        await usersService.blockUser(userId);
        toast.success("User rejected (blocked) successfully");
      }
      // Refresh users list
      const res = await fetchWaitingUsers();
      setData(res && Array.isArray(res.users) ? res : { ...res, users: [] });
    } catch (err) {
      toast.error(err.message || "Action failed");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="px-4 lg:px-6 space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="space-x-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Users
              </p>
              <p className="text-3xl font-bold">{totalUsers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="space-x-2">
              <p className="text-sm font-medium text-muted-foreground">
                Subscribed
              </p>
              <p className="text-3xl font-bold text-green-600">
                {totalSubscribed}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="space-x-2">
              <p className="text-sm font-medium text-muted-foreground">
                Unsubscribed
              </p>
              <p className="text-3xl font-bold text-red-600">
                {totalUnsubscribed}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="space-x-2">
              <p className="text-sm font-medium text-muted-foreground">
                ID Verified
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {totalVerified}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Waiting Users</CardTitle>
          <CardDescription>
            List of users waiting for admin or OCR verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>ID Card</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>AI Status</TableHead>
                  <TableHead>Created At</TableHead>
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
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-red-600"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : usersArr.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-gray-400"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  usersArr.map((user) => {
                    // Determine AI Status
                    let aiStatus = "-";
                    let aiStatusColor = "bg-gray-100 text-gray-800";
                    if (user.ocrResult && user.ocrResult.confidence) {
                      let conf = user.ocrResult.confidence;
                      // Remove % if present and parse as float
                      if (typeof conf === "string" && conf.endsWith("%")) {
                        conf = conf.slice(0, -1);
                      }
                      conf = parseFloat(conf);
                      if (!isNaN(conf)) {
                        if (conf > 80) {
                          aiStatus = "Matched";
                          aiStatusColor = "bg-green-100 text-green-800";
                        } else if (conf >= 60) {
                          aiStatus = "Need Review";
                          aiStatusColor = "bg-yellow-100 text-yellow-800";
                        } else {
                          aiStatus = "Refused";
                          aiStatusColor = "bg-red-100 text-red-800";
                        }
                      }
                    }
                    return (
                      <TableRow key={user.id}>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <Badge className="bg-gray-100 text-gray-800">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.idCard}</TableCell>
                        <TableCell>
                          {user.isIdVerified ? (
                            <Badge className="bg-green-100 text-green-800">
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">
                              Not Verified
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={aiStatusColor}>{aiStatus}</Badge>
                        </TableCell>
                        <TableCell>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setModalOpen(true);
                            }}
                            title="View Details"
                            className="mr-2"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-700 hover:bg-green-800 text-white mr-2"
                            disabled={actionLoading[user.id]}
                            onClick={() => handleUserAction(user.id, "accept")}
                          >
                            {actionLoading[user.id] ? "Accept" : "Accept"}
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-700 hover:bg-red-800 text-white"
                            disabled={actionLoading[user.id]}
                            onClick={() => handleUserAction(user.id, "reject")}
                          >
                            {actionLoading[user.id] ? "Reject" : "Reject"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              All details for user:{" "}
              <span className="font-bold">{selectedUser?.fullName}</span>
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* User ID at the top, styled like ViewUserModal.jsx */}
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm text-gray-700">
                  User ID:
                </span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded border border-gray-300 text-gray-700 select-all">
                  {selectedUser.id}
                </span>
              </div>
              {/* Images Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {/* ID Front Card */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">ID Front Card</h4>
                  {selectedUser.idFrontCardUrl?.secure_url ? (
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={selectedUser.idFrontCardUrl.secure_url}
                        alt="ID Front Card"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg h-48 flex items-center justify-center bg-gray-50">
                      <p className="text-gray-500 text-sm">
                        No image available
                      </p>
                    </div>
                  )}
                </div>
                {/* ID Back Card */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">ID Back Card</h4>
                  {selectedUser.idBackCardUrl?.secure_url ? (
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={selectedUser.idBackCardUrl.secure_url}
                        alt="ID Back Card"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg h-48 flex items-center justify-center bg-gray-50">
                      <p className="text-gray-500 text-sm">
                        No image available
                      </p>
                    </div>
                  )}
                </div>
                {/* Work ID */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Work ID</h4>
                  {selectedUser.workIdUrl?.secure_url ? (
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={selectedUser.workIdUrl.secure_url}
                        alt="Work ID"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg h-48 flex items-center justify-center bg-gray-50">
                      <p className="text-gray-500 text-sm">
                        No image available
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Info & OCR Result */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h4 className="font-bold mb-2 text-lg">Basic Info</h4>
                  <div className="mb-2">
                    <span className="font-semibold">Email:</span>{" "}
                    {selectedUser.email}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Phone:</span>{" "}
                    {selectedUser.phone}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Role:</span>{" "}
                    {selectedUser.role}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">ID Card:</span>{" "}
                    {selectedUser.idCard}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Gender:</span>{" "}
                    {selectedUser.gender}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Date of Birth:</span>{" "}
                    {selectedUser.dateOfBirth}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Created At:</span>{" "}
                    {selectedUser.createdAt
                      ? new Date(selectedUser.createdAt).toLocaleString()
                      : "-"}
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <h4 className="font-bold mb-2 text-lg">OCR Result</h4>
                  <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto max-h-60 whitespace-pre-wrap">
                    {JSON.stringify(selectedUser.ocrResult, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
