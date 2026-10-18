"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BlockedDateDialogProps } from "@/types/availability";

export function BlockedDateDialog({
  open,
  existingDates,
  onOpenChange,
  onSave,
}: BlockedDateDialogProps) {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date || !reason.trim()) {
      toast.error("Enter a date and reason.");
      return;
    }
    if (existingDates.includes(date)) {
      toast.error("This date is already blocked.");
      return;
    }
    onSave(date, reason.trim());
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Block a date</DialogTitle>
          <DialogDescription>
            Preview a one-off closure or leave day. No date will be added yet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="blocked-date">Date</Label>
            <Input
              id="blocked-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-11"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="blocked-reason">Reason</Label>
            <Input
              id="blocked-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="e.g. Annual leave"
              maxLength={80}
              className="h-11"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Preview blocked date</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
