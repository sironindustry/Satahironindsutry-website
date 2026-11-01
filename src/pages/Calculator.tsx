import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Calculator as CalculatorIcon, Tag, Settings, Wrench, FileText, ShoppingCart, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
 import { useCart } from "@/hooks/useCart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

// Configuration options - Updated with exact weights per foot
const pattiOptions = ["0.6mm", "0.7mm", "0.8mm", "0.9mm", "1.0mm"];
const pipeOptions = ["Light", "Heavy"];
const guideOptions = ["2.5\"", "3\""];
const channelOptions = ["Light", "Heavy"];
const springOptions = ["12\"", "15\"", "18\""];
const bracketOptions = ["Light", "Heavy"];
const gearBoxOptions = ["None", "Normal", "Steel", "Heavy"];

// Gear box prices by type
const gearBoxPrices = {
  None: 0,
  Normal: 2100,
  Steel: 2700,
  Heavy: 3800,
};

// Weight per foot for each component (in kg)
const weightPerFoot = {
  // Patti weights per foot based on gauge (mm)
  patti: {
    "0.6mm": 0.160,  // 160 gm/ft
    "0.7mm": 0.180,  // 180 gm/ft
    "0.8mm": 0.210,  // 210 gm/ft
    "0.9mm": 0.230,  // 230 gm/ft
    "1.0mm": 0.270,  // 270 gm/ft
  },
  // Pipe weight per foot
  pipe: {
    Light: 0.580,    // 580 gm/ft
    Heavy: 1.0,      // 1 kg/ft
  },
  // Bottom Channel (6 inch) weight per foot
  bottomChannel: {
    Light: 0.830,    // 830 gm/ft
    Heavy: 1.05,     // 1.05 kg/ft
  },
  // Side Guide weight per foot
  guide: {
    "2.5\"": 0.720,  // 720 gm/ft
    "3\"": 1.05,     // 1.05 kg/ft
  },
  // Cover weight per foot
  cover: 0.720,      // 720 gm/ft
};

// Spring weight per piece based on size
const springWeights = {
  "12\"": 3.0,       // 3 kg/pcs
  "15\"": 4.1,       // 4.1 kg/pcs
  "18\"": 6.0,       // 6 kg/pcs
};

// Bracket weight per piece
const bracketWeights = {
  Light: 2.5,        // 2.5 kg/pcs
  Heavy: 4.0,        // 4 kg/pcs
};

// Base rates (₹ per kg or per piece) - Default 95rs for most items
const getBaseRates = (marketRate: number) => ({
  patti: marketRate,
  pipe: marketRate,
  bottomChannel: marketRate,
  guides: marketRate,
  spring: marketRate, // per piece
  bracket: marketRate, // per piece
  cover: marketRate,
  kunda: marketRate, // per set
  lock: marketRate, // per piece
  chakri: marketRate, // per piece
  nutBolt: marketRate, // per lot
  bearing: 100, // per piece (fixed)
});

// Weight calculation based on user-provided weights
const calculateWeights = (width: number, height: number, patti: string, pipe: string, guide: string, channel: string) => {
  // Patti calculation: 
  // - Each patti strip is 0.25 ft wide (4 strips per foot of height)
  // - For 8 ft height = 32 patti, 10 ft = 40 patti, 10'2" = 41 patti
  const pattiStrips = Math.ceil(height * 4); // 4 strips per foot of height
  
  // Each patti strip spans the full width, weight = width × weight_per_foot × number_of_strips × strip_width(0.25ft)
  // Simplified: total patti length in feet = width × pattiStrips × 0.25 (but each strip is width long)
  // Actually: total length = width × pattiStrips (each strip is width ft long)
  const pattiWeightPerFt = weightPerFoot.patti[patti as keyof typeof weightPerFoot.patti] || 0.210;
  const totalPattiLength = width * pattiStrips; // Total ft of patti material
  const pattiWeight = totalPattiLength * pattiWeightPerFt;
  
  // Pipe weight: 1 pipe of width length
  const pipeWeightPerFt = weightPerFoot.pipe[pipe as keyof typeof weightPerFoot.pipe] || 0.580;
  const pipeWeight = width * pipeWeightPerFt;
  
  // Bottom channel weight: 1 channel of width length
  const channelWeightPerFt = weightPerFoot.bottomChannel[channel as keyof typeof weightPerFoot.bottomChannel] || 0.830;
  const bottomChannelWeight = width * channelWeightPerFt;
  
  // Guides weight: 2 guides (pair) of height length each
  const guideWeightPerFt = weightPerFoot.guide[guide as keyof typeof weightPerFoot.guide] || 0.720;
  const guidesWeight = height * 2 * guideWeightPerFt; // pair of guides
  
  // Cover weight: width + 1 ft
  const coverLength = width + 1;
  const coverWeight = coverLength * weightPerFoot.cover;
  
  return {
    patti: { weight: pattiWeight, strips: pattiStrips },
    pipe: { weight: pipeWeight },
    bottomChannel: { weight: bottomChannelWeight },
    guides: { weight: guidesWeight },
    cover: { weight: coverWeight },
  };
};

const Calculator = () => {
  const { toast } = useToast();
   const { addToCart } = useCart();
  
  // Dimension inputs
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  
  // Standard parts configuration
  const [pattiType, setPattiType] = useState("0.8mm");
  const [pipeType, setPipeType] = useState("Light");
  const [guideType, setGuideType] = useState("2.5\"");
  const [channelType, setChannelType] = useState("Light");
  const [springType, setSpringType] = useState("15\"");
  const [springQty, setSpringQty] = useState(2);
  const [bracketType, setBracketType] = useState("Heavy");
  const [bracketQty, setBracketQty] = useState(2);
  const [includeTopCover, setIncludeTopCover] = useState(true);
  
  // Extras
  const [lockQty, setLockQty] = useState(2);
  const [includeLock, setIncludeLock] = useState(true);
  const [chakriQty, setChakriQty] = useState(2);
  const [includeChakri, setIncludeChakri] = useState(true);
  const [bearingQty, setBearingQty] = useState(2);
  const [includeBearing, setIncludeBearing] = useState(true);
  const [gearBox, setGearBox] = useState("None");
  
  // Right side options
  const [marketRate, setMarketRate] = useState(95);
  const [includeKunda, setIncludeKunda] = useState(true);
  const [includeOtherMaterial, setIncludeOtherMaterial] = useState(false);
  const [includeNutBolt, setIncludeNutBolt] = useState(true);
  const [labourCost, setLabourCost] = useState(500);
  // Per-item rate overrides: item id -> custom rate (undefined = use default)
  const [rateOverrides, setRateOverrides] = useState<Record<string, number | undefined>>({});

  const effectiveRate = marketRate;
  
  // Item toggles for the summary
  const [includePatti, setIncludePatti] = useState(true);
  const [includePipe, setIncludePipe] = useState(true);
  const [includeBottomChannel, setIncludeBottomChannel] = useState(true);
  const [includeGuides, setIncludeGuides] = useState(true);
  const [includeSprings, setIncludeSprings] = useState(true);
  const [includeBrackets, setIncludeBrackets] = useState(true);
  const [includeCover, setIncludeCover] = useState(true);
  
  // Calculate all values
  const calculations = useMemo(() => {
    const baseRates = getBaseRates(effectiveRate);
    const weights = calculateWeights(width, height, pattiType, pipeType, guideType, channelType);
    
    // Spring weight based on exact size (at least 2 pcs per shutter)
    const springWeightPerPc = springWeights[springType as keyof typeof springWeights] || 4.1;
    const springWeight = springQty * springWeightPerPc;
    
    // Bracket weight based on type (at least 2 pcs per shutter)
    const bracketWeightPerPc = bracketWeights[bracketType as keyof typeof bracketWeights] || 2.5;
    const bracketWeight = bracketQty * bracketWeightPerPc;
    
    const items = [
      {
        id: "patti",
        name: "Patti",
        subtext: `(${weights.patti.strips} strips)`,
        weight: weights.patti.weight,
        rate: baseRates.patti,
        unit: "kg",
        amount: weights.patti.weight * baseRates.patti,
        included: includePatti,
        setIncluded: setIncludePatti,
      },
      {
        id: "pipe",
        name: "Pipe",
        weight: weights.pipe.weight,
        rate: baseRates.pipe,
        unit: "kg",
        amount: weights.pipe.weight * baseRates.pipe,
        included: includePipe,
        setIncluded: setIncludePipe,
      },
      {
        id: "bottomChannel",
        name: "Bottom Channel",
        weight: weights.bottomChannel.weight,
        rate: baseRates.bottomChannel,
        unit: "kg",
        amount: weights.bottomChannel.weight * baseRates.bottomChannel,
        included: includeBottomChannel,
        setIncluded: setIncludeBottomChannel,
      },
      {
        id: "guides",
        name: "Guides",
        weight: weights.guides.weight,
        rate: baseRates.guides,
        unit: "kg",
        amount: weights.guides.weight * baseRates.guides,
        included: includeGuides,
        setIncluded: setIncludeGuides,
      },
      {
        id: "springs",
        name: `Springs (${springQty})`,
        weight: springWeight,
        rate: baseRates.spring,
        unit: "pc",
        amount: springQty * baseRates.spring,
        included: includeSprings,
        setIncluded: setIncludeSprings,
      },
      {
        id: "brackets",
        name: `Brackets (${bracketQty})`,
        weight: bracketWeight,
        rate: baseRates.bracket,
        unit: "pc",
        amount: bracketQty * baseRates.bracket,
        included: includeBrackets,
        setIncluded: setIncludeBrackets,
      },
      {
        id: "cover",
        name: "Cover",
        weight: weights.cover.weight,
        rate: baseRates.cover,
        unit: "kg",
        amount: weights.cover.weight * baseRates.cover,
        included: includeCover && includeTopCover,
        setIncluded: setIncludeCover,
        disabled: !includeTopCover,
      },
    ];
    
    // Calculate gear box cost
    const gearBoxCost = gearBoxPrices[gearBox as keyof typeof gearBoxPrices] || 0;
    
    const extras = [
      {
        id: "kunda",
        name: "Kunda (Set)",
        qty: 1,
        rate: baseRates.kunda,
        unit: "set",
        amount: baseRates.kunda,
        included: includeKunda,
        setIncluded: setIncludeKunda,
      },
      {
        id: "lock",
        name: `Lock (${lockQty})`,
        qty: lockQty,
        rate: baseRates.lock,
        unit: "pcs",
        amount: lockQty * baseRates.lock,
        included: includeLock,
        setIncluded: () => {},
      },
      {
        id: "chakri",
        name: `Chakri (${chakriQty})`,
        qty: chakriQty,
        rate: baseRates.chakri,
        unit: "pcs",
        amount: chakriQty * baseRates.chakri,
        included: includeChakri,
        setIncluded: () => {},
      },
      {
        id: "nutBolt",
        name: "Nut Bolt",
        qty: 1,
        rate: baseRates.nutBolt,
        unit: "Lot",
        amount: baseRates.nutBolt,
        included: includeNutBolt,
        setIncluded: setIncludeNutBolt,
      },
      {
        id: "bearing",
        name: `Bearing (${bearingQty})`,
        qty: bearingQty,
        rate: baseRates.bearing,
        unit: "pcs",
        amount: bearingQty * baseRates.bearing,
        included: includeBearing,
        setIncluded: () => {},
      },
      {
        id: "gearBox",
        name: gearBox === "None" ? "Gear Box" : `Gear Box (${gearBox})`,
        qty: 1,
        rate: gearBoxCost,
        unit: "pcs",
        amount: gearBoxCost,
        included: gearBox !== "None" || (rateOverrides["gearBox"] ?? 0) > 0,
        setIncluded: () => {},
      },
      {
        id: "otherMaterial",
        name: "Other Shutter Material",
        qty: 1,
        rate: 0,
        unit: "pcs",
        amount: 0,
        included: includeOtherMaterial,
        setIncluded: setIncludeOtherMaterial,
      },
    ];
    
    // Apply per-item rate overrides (custom rate replaces the default; totals recompute)
    const applyRateOverrides = <T extends { id: string; rate: number; amount: number; qty?: number; weight?: number }>(list: T[]) =>
      list.map((item) => {
        const override = rateOverrides[item.id];
        if (override == null || override === item.rate) return item;
        const base = item.rate > 0 ? item.amount / item.rate : item.qty ?? item.weight ?? 1;
        return { ...item, rate: override, amount: base * override };
      });
    const finalItems = applyRateOverrides(items);
    const finalExtras = applyRateOverrides(extras);
    
    // Calculate totals
    const totalWeight = finalItems.reduce((sum, item) => sum + (item.included ? item.weight : 0), 0);
    const itemsSubtotal = finalItems.reduce((sum, item) => sum + (item.included ? item.amount : 0), 0);
    const extrasSubtotal = finalExtras.reduce((sum, item) => sum + (item.included ? item.amount : 0), 0);
    const subtotal = itemsSubtotal + extrasSubtotal;
    const total = subtotal + labourCost;
    
    return { items: finalItems, extras: finalExtras, totalWeight, subtotal, total, effectiveRate };
  }, [
    width, height, pattiType, pipeType, guideType, channelType,
    springType, springQty, bracketType, bracketQty, includeTopCover,
    lockQty, includeLock, chakriQty, includeChakri, bearingQty, includeBearing,
    includeKunda, includeOtherMaterial, includeNutBolt, labourCost, gearBox, effectiveRate,
    includePatti, includePipe, includeBottomChannel, includeGuides,
    includeSprings, includeBrackets, includeCover, rateOverrides
  ]);

  // Professional PDF Invoice Generation
  const generatePDF = useCallback(() => {
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
    const currentDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      background: #f8fafc; 
      padding: 20px;
      color: #1e293b;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
      color: white;
      padding: 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .company-info h1 {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .company-info p {
      opacity: 0.9;
      font-size: 14px;
    }
    .invoice-meta {
      text-align: right;
    }
    .invoice-badge {
      background: #f97316;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      display: inline-block;
    }
    .invoice-meta p {
      font-size: 14px;
      margin: 4px 0;
    }
    .invoice-meta strong {
      font-size: 16px;
    }
    .body {
      padding: 32px;
    }
    .specs-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
      padding: 20px;
      background: #f1f5f9;
      border-radius: 8px;
    }
    .spec-item {
      text-align: center;
    }
    .spec-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      margin-bottom: 4px;
    }
    .spec-value {
      font-size: 18px;
      font-weight: 700;
      color: #1e3a5f;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      background: #1e3a5f;
      color: white;
      padding: 14px 16px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    th:last-child { text-align: right; }
    td {
      padding: 14px 16px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    td:last-child { text-align: right; font-weight: 600; }
    tr:nth-child(even) { background: #f8fafc; }
    .section-title {
      background: #fef3c7 !important;
      font-weight: 700;
      color: #92400e;
    }
    .section-title td { border-bottom: 2px solid #fcd34d; }
    .totals {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
    }
    .totals-box {
      width: 280px;
      background: #f8fafc;
      border-radius: 8px;
      overflow: hidden;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid #e2e8f0;
    }
    .total-row:last-child {
      border-bottom: none;
    }
    .total-row.grand {
      background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
      color: white;
      font-size: 18px;
      font-weight: 700;
      padding: 16px;
    }
    .footer {
      background: #f8fafc;
      padding: 24px 32px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-left p {
      font-size: 13px;
      color: #64748b;
      margin: 2px 0;
    }
    .footer-right {
      text-align: right;
    }
    .qr-placeholder {
      width: 80px;
      height: 80px;
      background: #e2e8f0;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #64748b;
    }
    .weight-badge {
      display: inline-block;
      background: #dbeafe;
      color: #1e40af;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    @media print {
      body { background: white; padding: 0; }
      .invoice-container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div class="company-info">
        <h1>SATAH IRON INDUSTRY</h1>
        <p>Premium Rolling Shutters & Industrial Solutions</p>
        <p style="margin-top: 8px; opacity: 0.7;">GST: 09XXXXX1234X1ZX</p>
      </div>
      <div class="invoice-meta">
        <div class="invoice-badge">Estimate</div>
        <p><strong>${invoiceNumber}</strong></p>
        <p>${currentDate}</p>
      </div>
    </div>
    
    <div class="body">
      <div class="specs-grid">
        <div class="spec-item">
          <div class="spec-label">Width</div>
          <div class="spec-value">${width} ft</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Height</div>
          <div class="spec-value">${height} ft</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Total Weight</div>
          <div class="spec-value">${calculations.totalWeight.toFixed(1)} kg</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Rate Applied</div>
          <div class="spec-value">₹${calculations.effectiveRate}/kg</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40%">Item Description</th>
            <th style="width: 20%">Weight/Qty</th>
            <th style="width: 20%">Rate</th>
            <th style="width: 20%">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${calculations.items
            .filter(item => item.included)
            .map(item => `
              <tr>
                <td><strong>${item.name}</strong> ${item.subtext || ''}</td>
                <td><span class="weight-badge">$<span className="sm:hidden">Weight: </span>{item.weight.toFixed(1)}<span className="sm:hidden"> kg</span> ${item.unit}</span></td>
                <td>₹${item.rate}/${item.unit}</td>
                <td>₹${Math.round(item.amount).toLocaleString()}</td>
              </tr>
            `).join('')}
          
          <tr class="section-title">
            <td colspan="4">Extras & Accessories</td>
          </tr>
          
          ${calculations.extras
            .filter(item => item.included)
            .map(item => `
              <tr>
                <td><strong>${item.name}</strong></td>
                <td>${item.qty} ${item.unit}</td>
                <td>₹${item.rate}</td>
                <td>₹${item.amount.toLocaleString()}</td>
              </tr>
            `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="totals-box">
          <div class="total-row">
            <span>Subtotal</span>
            <span>₹${calculations.subtotal.toLocaleString()}</span>
          </div>
          <div class="total-row">
            <span>Labour & Fixing</span>
            <span>₹${labourCost.toLocaleString()}</span>
          </div>
          <div class="total-row grand">
            <span>Total</span>
            <span>₹${calculations.total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-left">
        <p><strong>Terms & Conditions:</strong></p>
        <p>• Prices valid for 7 days from date of estimate</p>
        <p>• 50% advance required to confirm order</p>
        <p>• Installation charges included as per estimate</p>
      </div>
      <div class="footer-right">
        <p style="font-size: 12px; color: #64748b; margin-bottom: 8px;">Thank you for your business!</p>
        <p style="font-weight: 600; color: #1e3a5f;">SATAH IRON INDUSTRY</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  }, [width, height, calculations, labourCost]);

  // Add parts to cart function
   const handleAddToCart = useCallback(async () => {
     try {
       // Add each included item to cart
       const itemsToAdd = [
         ...calculations.items.filter(item => item.included).map(item => ({
           productId: `calc-${item.id}`,
           name: item.name,
           variant: `${width}x${height}`,
           variantLabel: `${width}ft × ${height}ft`,
           size: 1,
           unit: item.unit,
           weight: item.weight,
           price: Math.round(item.amount),
         })),
         ...calculations.extras.filter(item => item.included).map(item => ({
           productId: `calc-extra-${item.id}`,
           name: item.name,
           variant: `${width}x${height}`,
           variantLabel: `${width}ft × ${height}ft`,
           size: item.qty,
           unit: item.unit,
           weight: 0,
           price: Math.round(item.amount),
         })),
       ];
 
       // Add labour if present
       if (labourCost > 0) {
         itemsToAdd.push({
           productId: 'calc-labour',
           name: 'Labour/Fixing',
           variant: `${width}x${height}`,
           variantLabel: `${width}ft × ${height}ft`,
           size: 1,
           unit: 'service',
           weight: 0,
           price: labourCost,
         });
       }
 
       // Add all items to cart
       for (const item of itemsToAdd) {
         await addToCart(item);
       }
 
       toast({
         title: "✓ Added to Cart",
         description: `Shutter ${width}ft × ${height}ft (₹${calculations.total.toLocaleString()}) added successfully!`,
       });
     } catch (error) {
       console.error('Error adding to cart:', error);
       toast({
         title: "Error",
         description: "Failed to add items to cart",
         variant: "destructive",
       });
     }
   }, [calculations, width, height, labourCost, toast, addToCart]);

  const handleCalculate = () => {
    // Trigger recalculation (already reactive via useMemo)
    console.log("Calculation updated");
  };

  return (
    <div className="calculator-page min-h-screen bg-background">
      <SEO
        title="Rolling Shutter Cost Estimator & Material Weight Calculator"
        description="Free online rolling shutter weight calculator & cost estimator by SATAH Iron Industry. Calculate exact patti strips, pipe, guide, bottom channel, spring, and bracket weights with instant PDF estimate download."
        keywords="rolling shutter calculator, shutter cost estimator, shutter weight calculation, patti strips weight, rolling shutter material estimator, shutter invoice generator, SATAH Iron Industry"
        canonical="/calculator"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Rolling Shutter Cost Estimator & Weight Calculator",
            "url": "https://sironindustry.com/calculator",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "All",
            "description": "Calculate exact rolling shutter weight, strips, guide, bottom channel, springs, brackets, and generate instant PDF estimates by SATAH Iron Industry.",
            "provider": {
              "@type": "LocalBusiness",
              "name": "SATAH Iron Industry",
              "url": "https://sironindustry.com"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sironindustry.com/" },
              { "@type": "ListItem", "position": 2, "name": "Cost Estimator", "item": "https://sironindustry.com/calculator" }
            ]
          }
        ]}
      />
      <Navbar />
      
      <main className="pt-20 pb-40 lg:pt-24 lg:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-3 mb-5 p-4 sm:p-6 bg-card rounded-lg border border-border"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CalculatorIcon className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold text-foreground">Cost Estimator</h1>
            </div>
            <div className="text-right">
              <div className="text-xl sm:text-3xl font-bold text-accent">{calculations.totalWeight.toFixed(1)} kg</div>
              <div className="text-xs text-muted-foreground uppercase">Total Weight</div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Configuration */}
            <div className="space-y-6">
              {/* Dimensions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 sm:p-6 bg-card rounded-lg shadow-card border border-border"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Tag className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold text-accent">Dimensions</h2>
                </div>
                
                <div className="grid grid-cols-1 min-[375px]:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Width (FT)
                    </label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Math.max(1, Math.min(50, Number(e.target.value) || 0)))}
                      min={1}
                      max={50}
                      className="bg-secondary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Height (FT)
                    </label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Math.max(1, Math.min(50, Number(e.target.value) || 0)))}
                      min={1}
                      max={50}
                      className="bg-secondary/50"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleCalculate}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <CalculatorIcon className="w-4 h-4 mr-2" />
                  Calculate Now
                </Button>
              </motion.div>

              {/* Standard Parts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 sm:p-6 bg-card rounded-lg shadow-card border border-border"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Settings className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold text-foreground">Standard Parts</h2>
                </div>
                
                <div className="grid grid-cols-1 min-[375px]:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">Patti</label>
                    <Select value={pattiType} onValueChange={setPattiType}>
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pattiOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">Pipe</label>
                    <Select value={pipeType} onValueChange={setPipeType}>
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pipeOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">Guide</label>
                    <Select value={guideType} onValueChange={setGuideType}>
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {guideOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">Channel</label>
                    <Select value={channelType} onValueChange={setChannelType}>
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {channelOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">Spring</label>
                    <Select value={springType} onValueChange={setSpringType}>
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {springOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">Spring Qty</label>
                    <Input
                      type="number"
                      value={springQty}
                      onChange={(e) => setSpringQty(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                      min={1}
                      max={10}
                      className="bg-secondary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">Bracket</label>
                    <Select value={bracketType} onValueChange={setBracketType}>
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bracketOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">Bracket Qty</label>
                    <Input
                      type="number"
                      value={bracketQty}
                      onChange={(e) => setBracketQty(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                      min={1}
                      max={10}
                      className="bg-secondary/50"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2">
                  <Checkbox
                    id="topCover"
                    checked={includeTopCover}
                    onCheckedChange={(checked) => setIncludeTopCover(checked as boolean)}
                  />
                  <label htmlFor="topCover" className="text-sm text-accent cursor-pointer">
                    Include Top Cover (13" Girth)
                  </label>
                </div>
              </motion.div>

              {/* Extras */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 sm:p-6 bg-card rounded-lg shadow-card border border-border"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Wrench className="w-5 h-5 text-destructive" />
                  <h2 className="text-lg font-semibold text-destructive">Extras</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="lock"
                        checked={includeLock}
                        onCheckedChange={(checked) => setIncludeLock(checked as boolean)}
                      />
                      <label htmlFor="lock" className="text-sm cursor-pointer">Lock ({lockQty})</label>
                    </div>
                    <Input
                      type="number"
                      value={lockQty}
                      onChange={(e) => setLockQty(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                      min={1}
                      max={10}
                      className="w-20 bg-secondary/50"
                      disabled={!includeLock}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="chakri"
                        checked={includeChakri}
                        onCheckedChange={(checked) => setIncludeChakri(checked as boolean)}
                      />
                      <label htmlFor="chakri" className="text-sm cursor-pointer">Chakri ({chakriQty})</label>
                    </div>
                    <Input
                      type="number"
                      value={chakriQty}
                      onChange={(e) => setChakriQty(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                      min={1}
                      max={10}
                      className="w-20 bg-secondary/50"
                      disabled={!includeChakri}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="bearing"
                        checked={includeBearing}
                        onCheckedChange={(checked) => setIncludeBearing(checked as boolean)}
                      />
                      <label htmlFor="bearing" className="text-sm cursor-pointer">Bearing ({bearingQty})</label>
                    </div>
                    <Input
                      type="number"
                      value={bearingQty}
                      onChange={(e) => setBearingQty(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                      min={1}
                      max={10}
                      className="w-20 bg-secondary/50"
                      disabled={!includeBearing}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">Gear Box</label>
                    <Select value={gearBox} onValueChange={setGearBox}>
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {gearBoxOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt} {gearBoxPrices[opt as keyof typeof gearBoxPrices] > 0 && `(₹${gearBoxPrices[opt as keyof typeof gearBoxPrices]})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              {/* Items List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-card rounded-xl shadow-card border border-border overflow-hidden"
              >
                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-3 bg-secondary/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <div className="col-span-5">Item (Uncheck to Remove)</div>
                  <div className="col-span-2 text-right">Weight/Qty</div>
                  <div className="col-span-3 text-right">Rate</div>
                  <div className="col-span-2 text-right">Amt</div>
                </div>
                
                {/* Items */}
                <div className="divide-y divide-border">
                  {calculations.items.map((item) => (
                    <div
                      key={item.id}
                      className={`grid grid-cols-2 sm:grid-cols-12 gap-x-3 gap-y-2 px-4 py-4 sm:py-3 items-center ${
                        !item.included ? "opacity-50" : ""
                      }`}
                    >
                      <div className="col-span-2 sm:col-span-5 min-w-0 flex items-center gap-3">
                        <Checkbox
                          aria-label={`Include ${item.name}`}
                          checked={item.included}
                          onCheckedChange={(checked) => item.setIncluded(checked as boolean)}
                          disabled={item.disabled}
                        />
                        <div className="min-w-0 break-words">
                          <span className="font-medium text-foreground">{item.name}</span>
                          {item.subtext && (
                            <span className="block text-xs text-muted-foreground">{item.subtext}</span>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2 sm:col-span-2 text-sm sm:text-right text-muted-foreground">
                        <span className="sm:hidden">Weight: </span>{item.weight.toFixed(1)}<span className="sm:hidden"> kg</span>
                      </div>
                      <div className="sm:col-span-3 min-w-0 flex items-center sm:justify-end gap-1">
                        <Input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          value={rateOverrides[item.id] ?? item.rate}
                          onChange={(e) => {
                            const val = e.target.value === "" ? 0 : Math.max(0, Number(e.target.value) || 0);
                            setRateOverrides((prev) => ({ ...prev, [item.id]: val }));
                          }}
                          className="w-20 sm:w-16 h-11 sm:h-8 px-2 text-right bg-secondary/50"
                          aria-label={`${item.name} rate`}
                        />
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">/{item.unit}</span>
                      </div>
                      <div className="sm:col-span-2 min-w-0 text-right font-semibold text-foreground break-words">
                        <span className="sm:hidden text-xs font-normal text-muted-foreground block">Amount ₹</span>{item.included ? Math.round(item.amount).toLocaleString() : "-"}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Extras Section */}
                <div className="bg-accent/5 border-t border-accent/20">
                  <div className="px-4 py-2 text-sm font-medium text-foreground">Extras</div>
                  <div className="divide-y divide-border/50">
                    {calculations.extras.map((item) => (
                      <div
                        key={item.id}
                        className={`grid grid-cols-2 sm:grid-cols-12 gap-x-3 gap-y-2 px-4 py-4 sm:py-3 items-center ${
                          !item.included ? "opacity-50" : ""
                        }`}
                      >
                        <div className="col-span-2 sm:col-span-5 min-w-0 flex items-center gap-3">
                          <Checkbox
                            aria-label={`Include ${item.name}`}
                            checked={item.included}
                            onCheckedChange={(checked) => item.setIncluded(checked as boolean)}
                          />
                          <span className="min-w-0 break-words font-medium text-foreground">{item.name}</span>
                        </div>
                        <div className="col-span-2 sm:col-span-2 text-sm sm:text-right text-muted-foreground">
                          <span className="sm:hidden">Qty: </span>{item.qty} {item.unit}
                        </div>
                        <div className="sm:col-span-3 min-w-0 flex items-center sm:justify-end gap-1">
                          <Input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            value={rateOverrides[item.id] ?? item.rate}
                            onChange={(e) => {
                              const val = e.target.value === "" ? 0 : Math.max(0, Number(e.target.value) || 0);
                              setRateOverrides((prev) => ({ ...prev, [item.id]: val }));
                              if (item.id === "otherMaterial") setIncludeOtherMaterial(val > 0);
                            }}
                            className="w-20 sm:w-16 h-11 sm:h-8 px-2 text-right bg-secondary/50"
                            aria-label={`${item.name} rate`}
                          />
                        </div>
                        <div className="sm:col-span-2 min-w-0 text-right font-semibold text-foreground break-words">
                          <span className="sm:hidden text-xs font-normal text-muted-foreground block">Amount ₹</span>{item.included ? item.amount.toLocaleString() : "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Subtotal */}
                <div className="px-4 py-3 border-t border-border flex flex-wrap gap-2 justify-between items-center">
                  <span className="font-semibold text-foreground">Subtotal</span>
                  <span className="font-bold text-lg text-foreground">
                    ₹ {calculations.subtotal.toLocaleString()}
                  </span>
                </div>
                
                {/* Labour */}
                <div className="px-4 py-3 border-t border-border flex flex-wrap gap-2 justify-between items-center">
                  <span className="text-foreground">Add. Labour/Fixing</span>
                  <Input
                    type="number"
                    value={labourCost}
                    onChange={(e) => setLabourCost(Math.max(0, Math.min(50000, Number(e.target.value) || 0)))}
                    min={0}
                    max={50000}
                    className="w-28 text-right bg-secondary/50"
                  />
                </div>
                
                {/* Total */}
                <div className="px-4 py-4 bg-secondary/30 border-t border-border flex flex-wrap gap-2 justify-between items-center">
                  <span className="text-xl font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-accent">
                    ₹ {calculations.total.toLocaleString()}
                  </span>
                </div>
                
                {/* Actions */}
                <div className="hidden lg:flex px-4 py-4 border-t border-border gap-3">
                  <Button variant="outline" className="flex-1" onClick={generatePDF}>
                    <Download className="w-4 h-4 mr-2" />
                    PDF Invoice
                  </Button>
                  <Button 
                    className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add Parts to Cart
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <div className="calculator-mobile-actions fixed inset-x-0 z-40 border-t border-border bg-card p-3 lg:hidden">
        <div className="flex items-center justify-between gap-2 mb-2 text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="font-bold text-accent">₹ {calculations.total.toLocaleString()}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="h-12 px-2" onClick={generatePDF}><Download className="size-4" /> PDF Invoice</Button>
          <Button className="h-12 px-2 bg-success hover:bg-success/90 text-success-foreground" onClick={handleAddToCart}><ShoppingCart className="size-4" /> Add to Cart</Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Calculator;
