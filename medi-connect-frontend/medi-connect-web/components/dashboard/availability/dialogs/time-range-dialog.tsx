"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TimeRangeDialogProps, VisitMode } from "@/types/availability";

export function TimeRangeDialog({
  open,
  day,
  range,
  onOpenChange,
  onSave,
}: TimeRangeDialogProps) {
  const [startTime, setStartTime] = useState(range?.startTime ?? "09:00");
  const [endTime, setEndTime] = useState(range?.endTime ?? "12:00");
  const [mode, setMode] = useState<VisitMode>(range?.mode ?? "In-person");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!startTime || !endTime || startTime >= endTime) {
      toast.error("End time must be later than start time.");
      return;
    }
    onSave({ startTime, endTime, mode });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{range ? "Edit" : "Add"} {day} time range</DialogTitle>
          <DialogDescription>
            Preview the hours and consultation mode. The schedule will not change.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="range-start">Start time</Label>
              <Input id="range-start" type="time" required value={startTime} onChange={(event) => setStartTime(event.target.value)} className="mt-2 h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="range-end">End time</Label>
              <Input id="range-end" type="time" required value={endTime} onChange={(event) => setEndTime(event.target.value)} className="mt-2 h-11" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="range-mode">Consultation mode</Label>
            <Select value={mode} onValueChange={(value) => setMode(value as VisitMode)}>
              <SelectTrigger id="range-mode" className="h-11 w-full border-slate-300 bg-white px-3 text-sm font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false} side="bottom" sideOffset={8} className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                <SelectItem value="In-person" className="min-h-10 rounded-lg py-2 pr-9 pl-3 text-sm data-selected:bg-blue-50 data-selected:text-primary">In-person</SelectItem>
                <SelectItem value="Video" className="min-h-10 rounded-lg py-2 pr-9 pl-3 text-sm data-selected:bg-blue-50 data-selected:text-primary">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Preview range</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
