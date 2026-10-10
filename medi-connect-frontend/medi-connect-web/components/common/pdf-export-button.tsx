"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { PdfExportButtonProps } from "@/types/common";

export function PdfExportButton({
  title,
  subtitle,
  filename,
  headers,
  rows,
  label = "Export PDF",
  className,
}: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport() {
    if (rows.length === 0) return;

    setIsExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 14;
      const tableWidth = pageWidth - margin * 2;
      const columnWidth = tableWidth / headers.length;

      function drawPageHeader() {
        pdf.setTextColor(20, 35, 65);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(17);
        pdf.text(title, margin, 19);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(95, 110, 135);
        pdf.text(subtitle ?? `${rows.length} records`, margin, 26);

        pdf.setFillColor(235, 241, 252);
        pdf.rect(margin, 32, tableWidth, 10, "F");
        pdf.setTextColor(35, 58, 100);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        headers.forEach((header, index) => {
          pdf.text(header, margin + index * columnWidth + 2.5, 38.5, {
            maxWidth: columnWidth - 5,
          });
        });
      }

      drawPageHeader();
      let y = 42;

      rows.forEach((row, rowIndex) => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        const cells = headers.map((_, index) =>
          pdf.splitTextToSize(String(row[index] ?? ""), columnWidth - 5),
        );
        const height = Math.max(10, Math.max(...cells.map((cell) => cell.length)) * 4 + 5);

        if (y + height > pageHeight - 15) {
          pdf.addPage();
          drawPageHeader();
          y = 42;
        }

        if (rowIndex % 2 === 1) {
          pdf.setFillColor(248, 250, 253);
          pdf.rect(margin, y, tableWidth, height, "F");
        }
        pdf.setTextColor(32, 43, 62);
        cells.forEach((cell, index) => {
          pdf.text(cell, margin + index * columnWidth + 2.5, y + 6);
        });
        y += height;
      });

      for (let page = 1; page <= pdf.getNumberOfPages(); page += 1) {
        pdf.setPage(page);
        pdf.setFontSize(8);
        pdf.setTextColor(115, 128, 149);
        pdf.text(`MediConnect  |  ${page} / ${pdf.getNumberOfPages()}`, pageWidth - margin, pageHeight - 7, {
          align: "right",
        });
      }

      pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
      toast.success("PDF exported successfully.");
    } catch {
      toast.error("Could not export the PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={handleExport}
      disabled={isExporting || rows.length === 0 || headers.length === 0}
    >
      {isExporting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Download className="size-4" aria-hidden="true" />}
      {isExporting ? "Exporting..." : label}
    </Button>
  );
}
