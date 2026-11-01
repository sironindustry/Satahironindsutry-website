import { jsPDF } from "jspdf";
import logo from "@/assets/weight-report-logo.json";

export interface WeightReportRow {
  name: string;
  reading: string;
  weight: number;
  price: number;
}

export function createWeightReport(customer: string, rows: WeightReportRow[], totalWeight: number, totalPrice: number) {
  const doc = new jsPDF();
  const money = (amount: number) => amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const date = new Date().toLocaleDateString("en-IN");
  let y = 0;
  const header = () => {
    const logoWidth = 30;
    doc.addImage(logo.dataUrl, "JPEG", 14, 12, logoWidth, logoWidth * logo.height / logo.width);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("SATAH IRON INDUSTRY", 50, 22);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Kotma, Madhya Pradesh | +91 7772886416", 50, 29);
    doc.setFontSize(13);
    doc.text("WEIGHT REPORT", 50, 38);
    doc.setFontSize(10);
    const nameLines = doc.splitTextToSize(`Customer: ${customer.trim() || "-"}`, 140);
    doc.text(nameLines, 14, 54);
    doc.text(date, 196, 54, { align: "right" });
    y = Math.max(66, 58 + nameLines.length * 5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("#", 16, y);
    doc.text("Item", 26, y);
    doc.text("Kanta (kg)", 133, y, { align: "right" });
    doc.text("Weight (kg)", 161, y, { align: "right" });
    doc.text("Price (INR)", 194, y, { align: "right" });
    doc.line(14, y + 3, 196, y + 3);
    y += 11;
  };
  header();
  rows.forEach((row, index) => {
    const nameLines: string[] = doc.splitTextToSize(row.name || "-", 75);
    const height = Math.max(12, nameLines.length * 5 + 5);
    if (y + height > 262) { doc.addPage(); header(); }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(String(index + 1), 16, y);
    doc.text(nameLines, 26, y);
    doc.text(row.reading.trim() ? Number(row.reading).toFixed(2) : "-", 133, y, { align: "right" });
    doc.text(row.weight.toFixed(2), 161, y, { align: "right" });
    doc.text(money(row.price), 194, y, { align: "right" });
    y += height;
  });
  if (y > 240) { doc.addPage(); header(); }
  doc.line(14, y, 196, y);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL", 26, y + 8);
  doc.text(totalWeight.toFixed(2), 133, y + 8, { align: "right" });
  doc.text(totalWeight.toFixed(2), 161, y + 8, { align: "right" });
  doc.text(money(totalPrice), 194, y + 8, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Item weight = current scale reading minus previous scale reading.", 14, y + 21);
  for (let page = 1; page <= doc.getNumberOfPages(); page++) {
    doc.setPage(page);
    doc.text(`Page ${page} of ${doc.getNumberOfPages()}`, 196, 285, { align: "right" });
  }
  doc.setProperties({ title: `Weight Report - ${customer.trim() || "SATAH IRON INDUSTRY"}`, author: "SATAH IRON INDUSTRY" });
  return doc.output("blob");
}

export async function downloadWeightReport(blob: Blob, customer: string) {
  const safeName = customer.trim().replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 60) || "customer";
  const filename = `SATAH-Weight-${safeName}.pdf`;
  const file = new File([blob], filename, { type: "application/pdf" });
  if (matchMedia("(pointer: coarse)").matches && navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: filename }); return; }
    catch (error) { if (error instanceof DOMException && error.name === "AbortError") return; }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}