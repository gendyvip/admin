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
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IconRefresh,
  IconPlus,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import useDrugsStore from "../../store/useDrugs";
import useDebounce from "../../hooks/use-debounce";
import AddDrugModal from "./AddDrugModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Drugs() {
  const {
    drugs,
    loading,
    error,
    pagination,
    fetchAllDrugs,
    clearError,
    search,
    deleteDrug,
  } = useDrugsStore();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 700);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDrug, setEditDrug] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [drugToDelete, setDrugToDelete] = useState(null);

  useEffect(() => {
    fetchAllDrugs(1, "");
  }, [fetchAllDrugs]);

  // When debounced search changes, reset to page 1 and fetch from backend
  useEffect(() => {
    fetchAllDrugs(1, debouncedSearch);
  }, [debouncedSearch, fetchAllDrugs]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchAllDrugs(newPage, debouncedSearch);
    }
  };

  const handleRefresh = () => {
    fetchAllDrugs(pagination.page, debouncedSearch);
  };

  const handleAddDrug = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleEditDrug = (drug) => {
    setEditDrug(drug);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditDrug(null);
  };

  const handleDeleteDrug = (drug) => {
    setDrugToDelete(drug);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteDrug = async () => {
    if (drugToDelete) {
      await deleteDrug(drugToDelete.id);
      setDeleteDialogOpen(false);
      setDrugToDelete(null);
      fetchAllDrugs(pagination.page, debouncedSearch);
    }
  };

  const cancelDeleteDrug = () => {
    setDeleteDialogOpen(false);
    setDrugToDelete(null);
  };

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Drugs</CardTitle>
              <CardDescription>
                Manage and view all drugs in the system
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <Input
                type="text"
                placeholder="Search by drug name"
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
              <Button onClick={handleAddDrug} variant="default" size="sm">
                <IconPlus className="h-4 w-4 mr-2" />
                Add Drug
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading drugs...</div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">{error}</div>
              <Button
                onClick={() => {
                  clearError();
                  fetchAllDrugs(pagination.page, debouncedSearch);
                }}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing page {pagination.page} of {pagination.totalPages} |
                Total drugs: {pagination.total}
              </div>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drugs.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-gray-400 py-8"
                        >
                          No drugs found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      drugs.map((drug) => (
                        <TableRow key={drug.id}>
                          <TableCell className="font-mono text-xs">
                            {drug.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>{drug.drugName}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                title="Edit"
                                onClick={() => handleEditDrug(drug)}
                              >
                                <IconEdit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                title="Delete"
                                onClick={() => handleDeleteDrug(drug)}
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
                <div className="flex items-center justify-end mt-4">
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
                            variant={
                              page === totalPages ? "default" : "outline"
                            }
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
                    disabled={
                      pagination.page >= pagination.totalPages || loading
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <AddDrugModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        mode="add"
        onSubmit={() => {}}
      />
      <AddDrugModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        mode="edit"
        initialValue={editDrug ? editDrug.drugName : ""}
        id={editDrug ? editDrug.id : ""}
        onSubmit={() => {}}
      />
      {/* Delete Drug Confirmation Modal */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Drug</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              drug from the system.
            </DialogDescription>
          </DialogHeader>
          {drugToDelete && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">Drug ID:</span>
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                {drugToDelete.id}
              </span>
            </div>
          )}
          <div className="space-y-4">
            <div>
              Are you sure you want to delete{" "}
              <span className="font-bold">{drugToDelete?.drugName}</span>?
            </div>
          </div>
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={cancelDeleteDrug}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteDrug}
              disabled={loading}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
