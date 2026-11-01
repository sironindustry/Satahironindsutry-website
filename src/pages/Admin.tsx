import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Lock, LogOut, Package, Settings, Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductVariant {
  id?: string;
  variant_key: string;
  label: string;
  weight_per_unit: number;
  fixed_price: number;
  sort_order: number;
  isNew?: boolean;
}

interface Product {
  id: string;
  product_key: string;
  name: string;
  category: string;
  unit: string;
  image: string;
  is_fixed_price: boolean;
  sort_order: number;
  is_active: boolean;
  variants: ProductVariant[];
}

interface SiteSettingRow {
  setting_key: string;
  setting_value: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "settings">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettingRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    product_key: "",
    name: "",
    category: "",
    unit: "pcs",
    image: "🔩",
    is_fixed_price: false,
  });

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'admin_password')
        .single();

      if (error) throw error;

      if (data.setting_value === password) {
        setIsAuthenticated(true);
        toast({ title: "✓ Logged in", description: "Welcome, Admin!" });
      } else {
        toast({ title: "Error", description: "Wrong password", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Login failed", variant: "destructive" });
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [{ data: prods }, { data: variants }, { data: sets }] = await Promise.all([
        supabase.from('products').select('*').order('sort_order'),
        supabase.from('product_variants').select('*').order('sort_order'),
        supabase.from('site_settings').select('*'),
      ]);

      const merged = (prods || []).map(p => ({
        ...p,
        variants: (variants || []).filter(v => v.product_id === p.id),
      }));

      setProducts(merged);
      setSettings(sets || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ setting_value: value, updated_at: new Date().toISOString() })
        .eq('setting_key', key);

      if (error) throw error;
      setSettings(prev => prev.map(s => s.setting_key === key ? { ...s, setting_value: value } : s));
      toast({ title: "✓ Updated", description: `${key} saved` });
    } catch {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          category: product.category,
          unit: product.unit,
          image: product.image,
          is_fixed_price: product.is_fixed_price,
          is_active: product.is_active,
          sort_order: product.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq('id', product.id);

      if (error) throw error;
      toast({ title: "✓ Product updated" });
    } catch {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const updateVariant = async (variant: ProductVariant) => {
    if (!variant.id) return;
    try {
      const { error } = await supabase
        .from('product_variants')
        .update({
          label: variant.label,
          weight_per_unit: variant.weight_per_unit,
          fixed_price: variant.fixed_price,
        })
        .eq('id', variant.id);

      if (error) throw error;
      toast({ title: "✓ Variant updated" });
    } catch {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const addVariant = async (productId: string, variant: ProductVariant) => {
    try {
      const { error } = await supabase
        .from('product_variants')
        .insert({
          product_id: productId,
          variant_key: variant.variant_key,
          label: variant.label,
          weight_per_unit: variant.weight_per_unit,
          fixed_price: variant.fixed_price,
          sort_order: variant.sort_order,
        });

      if (error) throw error;
      toast({ title: "✓ Variant added" });
      fetchData();
    } catch {
      toast({ title: "Error", description: "Failed to add variant", variant: "destructive" });
    }
  };

  const deleteVariant = async (variantId: string) => {
    try {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', variantId);

      if (error) throw error;
      toast({ title: "✓ Variant deleted" });
      fetchData();
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      toast({ title: "✓ Product deleted" });
      fetchData();
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const addProduct = async () => {
    try {
      const maxOrder = products.reduce((max, p) => Math.max(max, p.sort_order), 0);
      const { error } = await supabase
        .from('products')
        .insert({
          product_key: newProduct.product_key,
          name: newProduct.name,
          category: newProduct.category,
          unit: newProduct.unit,
          image: newProduct.image,
          is_fixed_price: newProduct.is_fixed_price,
          sort_order: maxOrder + 1,
        });

      if (error) throw error;
      toast({ title: "✓ Product added" });
      setShowAddProduct(false);
      setNewProduct({ product_key: "", name: "", category: "", unit: "pcs", image: "🔩", is_fixed_price: false });
      fetchData();
    } catch {
      toast({ title: "Error", description: "Failed to add product", variant: "destructive" });
    }
  };

  const getSettingValue = (key: string) => settings.find(s => s.setting_key === key)?.setting_value || "";

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent to-spark flex items-center justify-center">
              <Lock className="w-8 h-8 text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl">Admin Panel</CardTitle>
            <p className="text-muted-foreground text-sm">Enter password to continue</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button className="w-full bg-accent hover:bg-accent/90" onClick={handleLogin}>
              <Lock className="w-4 h-4 mr-2" /> Login
            </Button>
            <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 inline mr-1" /> Back to Home
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Settings className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SATAH Admin Panel</h1>
              <p className="text-xs text-primary-foreground/60">Manage products, prices & settings</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
                <ArrowLeft className="w-4 h-4 mr-1" /> Home
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => setIsAuthenticated(false)} className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={activeTab === "products" ? "default" : "outline"}
            onClick={() => setActiveTab("products")}
            className={activeTab === "products" ? "bg-accent" : ""}
          >
            <Package className="w-4 h-4 mr-2" /> Products & Prices
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "outline"}
            onClick={() => setActiveTab("settings")}
            className={activeTab === "settings" ? "bg-accent" : ""}
          >
            <Settings className="w-4 h-4 mr-2" /> Site Settings
          </Button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Products ({products.length})</h2>
              <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
                <DialogTrigger asChild>
                  <Button className="bg-accent hover:bg-accent/90">
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Input placeholder="Product Key (e.g. 'anchor')" value={newProduct.product_key} onChange={e => setNewProduct({ ...newProduct, product_key: e.target.value })} />
                    <Input placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                    <Input placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
                    <div className="flex gap-2">
                      <Input placeholder="Unit (ft/pcs/set)" value={newProduct.unit} onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })} />
                      <Input placeholder="Emoji 🔩" value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={newProduct.is_fixed_price} onChange={e => setNewProduct({ ...newProduct, is_fixed_price: e.target.checked })} />
                      <span className="text-sm">Fixed Price (not weight-based)</span>
                    </div>
                    <Button className="w-full bg-accent" onClick={addProduct} disabled={!newProduct.product_key || !newProduct.name}>
                      Add Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {products.map(product => (
              <Card key={product.id} className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{product.image}</span>
                      <div>
                        <CardTitle className="text-base">{product.name}</CardTitle>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                          <Badge variant={product.is_active ? "default" : "destructive"} className="text-xs">
                            {product.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {product.is_fixed_price ? "Fixed Price" : "Weight-based"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingProduct({ ...product })}>
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit {product.name}</DialogTitle>
                          </DialogHeader>
                          {editingProduct?.id === product.id && (
                            <div className="space-y-3">
                              <Input value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} placeholder="Name" />
                              <Input value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} placeholder="Category" />
                              <div className="flex gap-2">
                                <Input value={editingProduct.unit} onChange={e => setEditingProduct({ ...editingProduct, unit: e.target.value })} placeholder="Unit" />
                                <Input value={editingProduct.image} onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })} placeholder="Emoji" />
                              </div>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm">
                                  <input type="checkbox" checked={editingProduct.is_fixed_price} onChange={e => setEditingProduct({ ...editingProduct, is_fixed_price: e.target.checked })} />
                                  Fixed Price
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                  <input type="checkbox" checked={editingProduct.is_active} onChange={e => setEditingProduct({ ...editingProduct, is_active: e.target.checked })} />
                                  Active
                                </label>
                              </div>
                              <Button className="w-full bg-accent" onClick={() => { updateProduct(editingProduct); fetchData(); }}>
                                <Save className="w-4 h-4 mr-2" /> Save
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" size="sm" onClick={() => deleteProduct(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Variants:</p>
                  <div className="space-y-2">
                    {product.variants.map(variant => (
                      <div key={variant.id} className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-2 bg-secondary/50 rounded-lg">
                        <Input
                          className="w-full sm:w-auto sm:flex-1 min-w-0 h-8 text-sm"
                          value={variant.label}
                          onChange={e => {
                            setProducts(prev => prev.map(p => p.id === product.id
                              ? { ...p, variants: p.variants.map(v => v.id === variant.id ? { ...v, label: e.target.value } : v) }
                              : p
                            ));
                          }}
                          placeholder="Label"
                        />
                        {product.is_fixed_price ? (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">₹</span>
                            <Input
                              className="w-24 h-8 text-sm"
                              type="number"
                              value={variant.fixed_price}
                              onChange={e => {
                                setProducts(prev => prev.map(p => p.id === product.id
                                  ? { ...p, variants: p.variants.map(v => v.id === variant.id ? { ...v, fixed_price: Number(e.target.value) } : v) }
                                  : p
                                ));
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">g/ft</span>
                            <Input
                              className="w-24 h-8 text-sm"
                              type="number"
                              value={Math.round(variant.weight_per_unit * 1000)}
                              onChange={e => {
                                setProducts(prev => prev.map(p => p.id === product.id
                                  ? { ...p, variants: p.variants.map(v => v.id === variant.id ? { ...v, weight_per_unit: Number(e.target.value) / 1000 } : v) }
                                  : p
                                ));
                              }}
                            />
                          </div>
                        )}
                        <Button size="sm" variant="outline" className="h-8" onClick={() => updateVariant(variant)}>
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="destructive" className="h-8" onClick={() => variant.id && deleteVariant(variant.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <AddVariantRow productId={product.id} isFixedPrice={product.is_fixed_price} onAdd={addVariant} nextOrder={product.variants.length + 1} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-xl font-bold">Site Settings</h2>
            {[
              { key: "market_rate", label: "Market Rate (₹/kg)", type: "number" },
              { key: "phone", label: "Phone Number", type: "text" },
              { key: "address", label: "Address", type: "text" },
              { key: "working_hours", label: "Working Hours", type: "text" },
              { key: "admin_password", label: "Admin Password", type: "password" },
            ].map(field => (
              <Card key={field.key}>
                <CardContent className="pt-4">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">{field.label}</label>
                  <div className="flex gap-2">
                    <Input
                      type={field.type}
                      value={getSettingValue(field.key)}
                      onChange={e => setSettings(prev => prev.map(s => s.setting_key === field.key ? { ...s, setting_value: e.target.value } : s))}
                    />
                    <Button variant="outline" onClick={() => updateSetting(field.key, getSettingValue(field.key))}>
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Small component for adding variants inline
const AddVariantRow = ({ productId, isFixedPrice, onAdd, nextOrder }: { productId: string; isFixedPrice: boolean; onAdd: (productId: string, variant: ProductVariant) => void; nextOrder: number }) => {
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [value, setValue] = useState(0);

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-2 border border-dashed border-border rounded-lg">
      <Input className="w-full sm:w-auto sm:flex-1 min-w-0 h-8 text-sm" placeholder="Key" value={key} onChange={e => setKey(e.target.value)} />
      <Input className="w-full sm:w-auto sm:flex-1 min-w-0 h-8 text-sm" placeholder="Label" value={label} onChange={e => setLabel(e.target.value)} />
      <Input className="w-24 h-8 text-sm" type="number" placeholder={isFixedPrice ? "₹" : "g/ft"} value={value || ""} onChange={e => setValue(Number(e.target.value))} />
      <Button
        size="sm"
        className="h-8 bg-accent"
        disabled={!key || !label}
        onClick={() => {
          onAdd(productId, {
            variant_key: key,
            label,
            weight_per_unit: isFixedPrice ? 0 : value / 1000,
            fixed_price: isFixedPrice ? value : 0,
            sort_order: nextOrder,
          });
          setKey(""); setLabel(""); setValue(0);
        }}
      >
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default Admin;
