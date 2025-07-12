import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useDrugsStore from "../../store/useDrugs";

export default function AddDrugModal({
  isOpen,
  onClose,
  onSubmit,
  mode = "add", // "add" or "edit"
  initialValue = "",
  id = "",
}) {
  const [drugName, setDrugName] = useState(initialValue || "");
  const { addDrug, loading, error, clearError } = useDrugsStore();

  // Reset input when modal closes or mode/initialValue changes
  useEffect(() => {
    if (!isOpen) {
      setDrugName("");
      clearError();
    } else {
      setDrugName(initialValue || "");
    }
  }, [isOpen, mode, initialValue, clearError]);

  const handleSubmit = async () => {
    if (drugName.trim()) {
      try {
        if (mode === "add") {
          await addDrug({ drugName: drugName.trim() });
          onClose();
          onSubmit && onSubmit();
        } else {
          // Handle edit mode - you'll need to implement updateDrug in the store
          onSubmit && onSubmit(drugName.trim());
        }
      } catch (error) {
        // Error is already handled in the store
        console.error("Failed to submit drug:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Drug" : "Add New Drug"}
          </DialogTitle>
        </DialogHeader>
        {mode === "edit" && id && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Drug ID:</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
              {id}
            </span>
          </div>
        )}
        <div className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          <Input
            type="text"
            placeholder="Drug name"
            value={drugName}
            onChange={(e) => setDrugName(e.target.value)}
            className="w-full"
            disabled={loading}
          />
        </div>
        <DialogFooter className="mt-4 flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!drugName.trim() || loading}>
            {loading ? "Saving..." : mode === "edit" ? "Save" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
