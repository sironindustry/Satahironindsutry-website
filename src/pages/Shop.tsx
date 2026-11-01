import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus, Package, Trash2, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart, CartItem } from "@/hooks/useCart";
import { useProducts, useSiteSettings } from "@/hooks/useProducts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductState {
  selectedVariant: string;
  size: number;
}

const Shop = () => {
  const { toast } = useToast();
  const { cart, cartTotal, cartWeight, addToCart, removeFromCart, clearCart } = useCart();
  const { products, isLoading: productsLoading } = useProducts();
  const { settings } = useSiteSettings();
  const MARKET_RATE = settings.market_rate;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [productStates, setProductStates] = useState<Record<string, ProductState>>({});

  // Initialize product states when products load
  const getProductState = (productId: string, defaultVariant: string) => {
    if (!productStates[productId]) {
      return { selectedVariant: defaultVariant, size: 1 };
    }
    return productStates[productId];
  };

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ["All", ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter(p => p.category === selectedCategory);
  }, [selectedCategory, products]);

  const updateProductState = (productId: string, updates: Partial<ProductState>) => {
    setProductStates(prev => ({
      ...prev,
      [productId]: { ...getProductState(productId, ""), ...updates },
    }));
  };

  const calculatePrice = (product: typeof products[0], variantId: string, size: number) => {
    const variant = product.variants.find(v => v.variant_key === variantId) || product.variants[0];
    if (!variant) return 0;
    if (product.is_fixed_price) return variant.fixed_price * size;
    return variant.weight_per_unit * size * MARKET_RATE;
  };

  const calculateWeight = (product: typeof products[0], variantId: string, size: number) => {
    if (product.is_fixed_price) return 0;
    const variant = product.variants.find(v => v.variant_key === variantId) || product.variants[0];
    if (!variant) return 0;
    return variant.weight_per_unit * size;
  };

  const handleAddToCart = async (product: typeof products[0]) => {
    const state = getProductState(product.id, product.variants[0]?.variant_key || "");
    const variant = product.variants.find(v => v.variant_key === state.selectedVariant) || product.variants[0];
    if (!variant) return;

    const weight = calculateWeight(product, state.selectedVariant, state.size);
    const price = calculatePrice(product, state.selectedVariant, state.size);

    try {
      await addToCart({
        productId: product.product_key,
        name: product.name,
        variant: variant.variant_key,
        variantLabel: variant.label,
        size: state.size,
        unit: product.unit,
        weight,
        price,
      });
      toast({
        title: "✓ Added to Cart",
        description: `${product.name} (${variant.label}) × ${state.size} ${product.unit}`,
      });
    } catch {
      toast({ title: "Error", description: "Failed to add item to cart", variant: "destructive" });
    }
  };

  const handleRemoveFromCart = async (item: CartItem) => {
    if (!item.id) return;
    try {
      await removeFromCart(item.id);
    } catch {
      toast({ title: "Error", description: "Failed to remove item", variant: "destructive" });
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast({ title: "Cart cleared", description: "All items removed" });
    } catch {
      toast({ title: "Error", description: "Failed to clear cart", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Buy Rolling Shutter Parts, Strips, Springs, Guides & Hardware"
        description="At SATAH Iron Industry, we specialize in selling a wide range of shutter materials. Shop shutter strips (patti), guides, shutter bottoms, springs, locks, gear boxes, iron pipes, and brackets online at live market rates."
        keywords="buy shutter materials, shutter strips online, rolling shutter patti, shutter springs, shutter bottom channel, shutter gear boxes, shutter locks, iron pipes, SATAH Iron Industry"
        canonical="/shop"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Shop Rolling Shutter Parts & Materials",
            "url": "https://sironindustry.com/shop",
            "description": "At SATAH Iron Industry, we specialize in selling a wide range of shutter materials: shutter strips, guides, bottoms, springs, locks, gear boxes, iron pipes, and brackets.",
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
              { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://sironindustry.com/shop" }
            ]
          }
        ]}
      />
      <Navbar />

      <main className="pt-20 lg:pt-24 pb-10 lg:pb-16 flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-bold text-foreground mb-3">Shop Parts</h1>
            <p className="text-muted-foreground">
              All weight-based items at <span className="text-accent font-bold">₹{MARKET_RATE}/kg</span> market rate
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Products Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? "bg-accent" : ""}
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              {/* Products Grid */}
              {productsLoading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-64 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredProducts.map((product, index) => {
                    if (product.variants.length === 0) return null;
                    const state = getProductState(product.id, product.variants[0].variant_key);
                    const variant = product.variants.find(v => v.variant_key === state.selectedVariant) || product.variants[0];
                    const price = calculatePrice(product, state.selectedVariant, state.size);
                    const weight = calculateWeight(product, state.selectedVariant, state.size);
                    const hasMultipleVariants = product.variants.length > 1;

                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="h-full hover:shadow-lg transition-shadow border-border">
                          <CardHeader className="pb-3">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="flex min-w-0 items-center gap-3">
                                <span className="text-3xl">{product.image}</span>
                                <div>
                                  <CardTitle className="text-base">{product.name}</CardTitle>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {product.is_fixed_price ? "Fixed Price" : `Per ${product.unit}`}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {product.category}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Variant Dropdown */}
                            {hasMultipleVariants ? (
                              <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Select Type</label>
                                <Select
                                  value={state.selectedVariant}
                                  onValueChange={value => updateProductState(product.id, { selectedVariant: value })}
                                >
                                  <SelectTrigger className="w-full bg-background border-border">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-card border-border z-50">
                                    {product.variants.map(v => (
                                      <SelectItem key={v.variant_key} value={v.variant_key}>
                                        <div className="flex items-center justify-between w-full gap-4">
                                          <span>{v.label}</span>
                                          <span className="text-xs text-muted-foreground">
                                            {product.is_fixed_price
                                              ? `₹${v.fixed_price}`
                                              : `${(v.weight_per_unit * 1000).toFixed(0)}g/${product.unit}`}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                <span className="font-medium">{variant.label}</span>
                                {!product.is_fixed_price && (
                                  <span className="ml-2 text-xs">
                                    ({(variant.weight_per_unit * 1000).toFixed(0)}g/{product.unit})
                                  </span>
                                )}
                                {product.is_fixed_price && (
                                  <span className="ml-2 text-accent font-medium">₹{variant.fixed_price}/{product.unit}</span>
                                )}
                              </div>
                            )}

                            {/* Size Input */}
                            <div>
                              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                Quantity ({product.unit})
                              </label>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-9 w-9"
                                  onClick={() => updateProductState(product.id, { size: Math.max(1, state.size - 1) })}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                  type="number"
                                  value={state.size}
                                  onChange={e => updateProductState(product.id, { size: Math.max(1, Math.min(100, Number(e.target.value) || 1)) })}
                                  className="w-20 min-w-0 text-center h-9"
                                  min={1}
                                  max={100}
                                />
                                <span className="text-sm text-muted-foreground w-8">{product.unit}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-9 w-9"
                                  onClick={() => updateProductState(product.id, { size: Math.min(100, state.size + 1) })}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Price Display */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
                              <div>
                                {weight > 0 && (
                                  <p className="text-xs text-muted-foreground">Weight: {weight.toFixed(2)} kg</p>
                                )}
                                <p className="text-xl font-bold text-accent">₹{Math.round(price).toLocaleString()}</p>
                              </div>
                              <Button className="bg-primary hover:bg-primary/90" onClick={() => handleAddToCart(product)}>
                                <Plus className="h-4 w-4 mr-1" /> Add to Cart
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart Section */}
            <div className="hidden lg:block lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-28"
              >
                <Card className="border-accent/30">
                  <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        <CardTitle className="text-lg">Cart</CardTitle>
                      </div>
                      <Badge variant="secondary" className="bg-accent text-accent-foreground">
                        {cart.length} items
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {cart.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Your cart is empty</p>
                        <p className="text-xs mt-1">Add items to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {cart.map((item, index) => (
                          <div key={item.id || index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.variantLabel} × {item.size} {item.unit}
                              </p>
                              {item.weight > 0 && (
                                <p className="text-xs text-muted-foreground">{item.weight.toFixed(2)} kg</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-accent">₹{Math.round(item.price).toLocaleString()}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => handleRemoveFromCart(item)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {cart.length > 0 && (
                      <>
                        <Separator className="my-4" />
                        <div className="space-y-2">
                          {cartWeight > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Total Weight</span>
                              <span className="font-medium">{cartWeight.toFixed(2)} kg</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Market Rate</span>
                            <span className="font-medium">₹{MARKET_RATE}/kg</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">Total</span>
                            <span className="font-bold text-2xl text-accent">₹{Math.round(cartTotal).toLocaleString()}</span>
                          </div>
                        </div>
                        <Button className="w-full mt-4 bg-success hover:bg-success/90">
                          <IndianRupee className="h-4 w-4 mr-2" /> Place Order
                        </Button>
                        <Button variant="outline" className="w-full mt-2" onClick={handleClearCart}>
                          Clear Cart
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
