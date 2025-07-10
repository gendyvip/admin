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

export default function AddDrugModal({
  isOpen,
  onClose,
  onSubmit,
  mode = "add", // "add" or "edit"
  initialValue = "",
  id = "",
}) {
  const [drugName, setDrugName] = useState(initialValue || "");

  // Reset input when modal closes or mode/initialValue changes
  useEffect(() => {
    if (!isOpen) setDrugName("");
    else setDrugName(initialValue || "");
  }, [isOpen, mode, initialValue]);

  const handleSubmit = () => {
    if (drugName.trim()) {
      onSubmit && onSubmit(drugName.trim());
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
          <Input
            type="text"
            placeholder="Drug name"
            value={drugName}
            onChange={(e) => setDrugName(e.target.value)}
            className="w-full"
          />
        </div>
        <DialogFooter className="mt-4 flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!drugName.trim()}>
            {mode === "edit" ? "Save" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
