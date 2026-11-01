import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Scale, IndianRupee, Plus, Trash2, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useProducts";
import { Label } from "@/components/ui/label";
import { createWeightReport, downloadWeightReport } from "@/lib/weightReport";
import { useToast } from "@/hooks/use-toast";

interface ItemRow {
  id: number;
  name: string;
  weight: string;
  price: string;
  custom?: boolean;
}

let nextRowId = 1;
const emptyRow = (): ItemRow => ({ id: nextRowId++, name: "", weight: "", price: "" });

const ADD_NEW = "__add_new__";

const WeightCalculation = () => {
  const { settings } = useSiteSettings();
  const [rows, setRows] = useState<ItemRow[]>([emptyRow(), emptyRow(), emptyRow()]);
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState("");
  const { toast } = useToast();

  // Dropdown options: fixed shutter material list + user-added custom items
  const itemOptions = useMemo(() => {
    const names = [
      "Patti (0.6mm)",
      "Patti (0.7mm)",
      "Patti (0.8mm)",
      "Patti (1mm)",
      "Pipe",
      "Bottom Channel",
      "Guide",
      "Spring",
      "Bracket",
      "Cover",
      "Nut Bolt",
    ];
    return [...new Set([...names, ...customItems])];
  }, [customItems]);

  // Light-colored sub-label shown under the item name (e.g. thickness)
  const subLabels: Record<string, string> = {
    "Patti (0.6mm)": "0.6 mm thickness",
    "Patti (0.7mm)": "0.7 mm thickness",
    "Patti (0.8mm)": "0.8 mm thickness",
    "Patti (1mm)": "1 mm thickness",
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (id: number) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));

  const updateRow = (id: number, field: "name" | "weight" | "price", value: string) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const handleNameSelect = (id: number, value: string) => {
    if (value === ADD_NEW) {
      // Switch this row's cell to a text input for a new item name
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, name: "", custom: true } : r)));
    } else {
      updateRow(id, "name", value);
    }
  };

  const commitCustomName = (id: number, value: string) => {
    const name = value.trim();
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, name, custom: false } : r))
    );
    if (name) {
      setCustomItems((prev) => (prev.includes(name) ? prev : [...prev, name]));
    }
  };

  // Kanta (weighbridge) logic: each row's input is the CUMULATIVE scale reading.
  // Item weight = current reading - previous reading. Total = last reading.
  const computed = useMemo(() => {
    let prev = 0;
    let price = 0;
    const itemWeights: Record<number, number> = {};
    for (const r of rows) {
      const hasReading = r.weight.trim() !== "";
      const reading = parseFloat(r.weight) || 0;
      // Skip empty rows so they don't reset the cumulative reading
      const itemWeight = hasReading ? Math.max(reading - prev, 0) : 0;
      itemWeights[r.id] = itemWeight;
      if (hasReading) prev = reading;
      const p = parseFloat(r.price);
      // Price optional: if empty, calculate as item weight x market rate
      price += p > 0 ? p : itemWeight * settings.market_rate;
    }
    return { itemWeights, totalWeight: prev, totalPrice: price };
  }, [rows, settings.market_rate]);

  const generatePDF = () => {
    try {
      const reportRows = rows.filter((row) => row.name || row.weight.trim() || row.price.trim()).map((row) => {
        const weight = computed.itemWeights[row.id] ?? 0;
        const price = parseFloat(row.price);
        return { name: row.name, reading: row.weight, weight, price: price > 0 ? price : weight * settings.market_rate };
      });
      const blob = createWeightReport(customerName, reportRows, computed.totalWeight, computed.totalPrice);
      void downloadWeightReport(blob, customerName).catch(() => {
        toast({ title: "Download failed", description: "Please try downloading the PDF again.", variant: "destructive" });
      });
    } catch {
      toast({ title: "PDF could not be generated", description: "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 lg:pt-28 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 text-accent mb-4">
              <Scale className="w-7 h-7" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Weight Calculation
            </h1>
            <p className="mt-2 text-muted-foreground">
              Enter the kanta (scale) reading after loading each item — item weight is calculated automatically (reading − previous reading)
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-5">
            <div className="flex-1 min-w-0 space-y-2">
              <Label htmlFor="weight-customer-name">Customer Name</Label>
              <Input id="weight-customer-name" placeholder="Enter customer name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="h-12" />
            </div>
            <Button onClick={generatePDF} className="h-12 w-full sm:w-auto gap-2">
              <Download className="w-4 h-4" /> Generate PDF
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-lg border border-border bg-card shadow-sm overflow-hidden"
          >
            {/* Excel-like table */}
            <div className="hidden md:grid grid-cols-[36px_minmax(0,1fr)_100px_100px_115px_48px] bg-secondary/60 border-b border-border">
              <span className="px-1 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">#</span>
              <span className="px-2 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-l border-border">Item</span>
              <span className="px-1 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-l border-border">Kanta (kg)</span>
              <span className="px-1 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-l border-border">Weight (kg)</span>
              <span className="px-1 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-l border-border">Price (₹)</span>
              <span className="border-l border-border" />
            </div>

            {rows.map((row, idx) => (
              <div
                key={row.id}
                className="relative grid grid-cols-3 md:grid-cols-[36px_minmax(0,1fr)_100px_100px_115px_48px] border-b border-border last:border-b-0"
              >
                <span className="hidden md:flex px-1 py-1 items-center justify-center text-xs text-muted-foreground bg-secondary/30">
                  {idx + 1}
                </span>
                <div className="col-span-3 md:col-span-1 md:border-l border-border p-2 pr-14 md:p-1 border-b md:border-b-0">
                  {row.custom ? (
                    <Input
                      aria-label={`Row ${idx + 1} new item name`}
                      placeholder="New item name"
                      autoFocus
                      defaultValue={row.name}
                      onBlur={(e) => commitCustomName(row.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitCustomName(row.id, e.currentTarget.value);
                      }}
                      className="min-w-0 border-0 bg-transparent shadow-none focus-visible:ring-1 px-2"
                    />
                  ) : (
                    <Select
                      value={row.name}
                      onValueChange={(v) => handleNameSelect(row.id, v)}
                    >
                      <SelectTrigger
                        aria-label={`Row ${idx + 1} item`}
                        className="min-w-0 h-auto min-h-12 border-0 bg-transparent shadow-none focus:ring-1 px-2 gap-2 [&>span]:line-clamp-none [&>span]:min-w-0 [&>span]:text-left [&>span]:whitespace-normal"
                      >
                        <SelectValue placeholder={`Item ${idx + 1} — Select item`}>
                          {row.name ? (
                            <span className="flex flex-col min-w-0 break-words">
                              <span>{subLabels[row.name] ? "Patti" : row.name}</span>
                              {subLabels[row.name] && <span className="text-xs text-muted-foreground font-normal">{subLabels[row.name]}</span>}
                            </span>
                          ) : undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {itemOptions.map((name) => (
                          <SelectItem key={name} value={name}>
                            <span className="flex flex-col items-start">
                              <span className="break-words">{subLabels[name] ? "Patti" : name}</span>
                              {subLabels[name] && (
                                <span className="text-xs text-muted-foreground/70 font-normal">
                                  {subLabels[name]}
                                </span>
                              )}
                            </span>
                          </SelectItem>
                        ))}
                        <SelectItem value={ADD_NEW} className="text-accent font-medium">
                          + Add New Item
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="md:border-l border-border p-2 md:p-1">
                  <Label htmlFor={`kanta-${row.id}`} className="block md:hidden text-xs text-muted-foreground mb-1">Kanta (kg)</Label>
                  <Input
                    id={`kanta-${row.id}`}
                    aria-label={`Row ${idx + 1} kanta reading`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    placeholder="0"
                    value={row.weight}
                    onChange={(e) => updateRow(row.id, "weight", e.target.value)}
                    className="min-w-0 border-0 bg-transparent shadow-none focus-visible:ring-1 px-1 sm:px-2"
                  />
                </div>
                <div className="border-l border-border p-2 md:p-1 flex flex-col md:justify-center">
                  <span className="md:hidden text-xs text-muted-foreground mb-1">Weight (kg)</span>
                  <span
                    aria-label={`Row ${idx + 1} item weight`}
                    className="flex min-h-11 items-center justify-center text-sm font-semibold text-foreground break-all"
                  >
                    {computed.itemWeights[row.id]?.toFixed(2) ?? "0.00"}
                  </span>
                </div>
                <div className="border-l border-border p-2 md:p-1">
                  <Label htmlFor={`price-${row.id}`} className="block md:hidden text-xs text-muted-foreground mb-1">Price (₹)</Label>
                  <Input
                    id={`price-${row.id}`}
                    aria-label={`Row ${idx + 1} price (optional)`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    placeholder="Auto"
                    value={row.price}
                    onChange={(e) => updateRow(row.id, "price", e.target.value)}
                    className="min-w-0 border-0 bg-transparent shadow-none focus-visible:ring-1 px-1 sm:px-2"
                  />
                </div>
                <div className="absolute right-1 top-2 md:static md:border-l border-border p-0.5 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove row ${idx + 1}`}
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length === 1}
                    className="h-11 w-11 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Totals row */}
            <div className="grid grid-cols-2 md:grid-cols-[36px_minmax(0,1fr)_100px_100px_115px_48px] bg-accent/10 border-t-2 border-accent/30">
              <span className="hidden md:block px-1 py-3" />
              <span className="col-span-2 md:col-span-1 px-3 py-2 md:py-3 text-sm font-semibold text-foreground md:border-l border-border">Total</span>
              <span className="hidden md:block px-1 py-3 text-sm font-bold text-foreground border-l border-border break-words">
                {computed.totalWeight.toFixed(2)}
              </span>
              <span className="px-3 pb-3 md:px-1 md:py-3 text-sm font-bold text-foreground md:border-l border-border break-words">
                <span className="block md:hidden mb-1 text-xs font-normal text-muted-foreground">Weight (kg)</span>
                {computed.totalWeight.toFixed(2)}
              </span>
              <span className="px-3 pb-3 md:px-1 md:py-3 text-sm font-bold text-accent border-l border-border min-w-0">
                <span className="block md:hidden mb-1 text-xs font-normal text-muted-foreground">Price (₹)</span>
                <span className="flex items-center gap-0.5"><IndianRupee className="w-3.5 h-3.5 shrink-0" /><span className="break-all">{computed.totalPrice.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span></span>
              </span>
              <span className="hidden md:block border-l border-border" />
            </div>
          </motion.div>

          <Button onClick={addRow} className="w-full h-12 mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            * Kanta (kg) = scale reading after loading that item. Item weight = current reading − previous reading. Price is optional — if left empty, it is calculated as item weight × ₹{settings.market_rate}/kg.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WeightCalculation;
