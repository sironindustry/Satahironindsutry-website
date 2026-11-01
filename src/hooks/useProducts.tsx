import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ProductVariant {
  id: string;
  variant_key: string;
  label: string;
  weight_per_unit: number;
  fixed_price: number;
  sort_order: number;
}

export interface Product {
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

export interface SiteSettings {
  market_rate: number;
  phone: string;
  address: string;
  working_hours: string;
  admin_password: string;
  [key: string]: string | number;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const { data: productsData, error: pError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (pError) throw pError;

      const { data: variantsData, error: vError } = await supabase
        .from('product_variants')
        .select('*')
        .order('sort_order');

      if (vError) throw vError;

      const merged = (productsData || []).map(p => ({
        ...p,
        variants: (variantsData || []).filter(v => v.product_id === p.id),
      }));

      setProducts(merged);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return { products, isLoading, refetch: fetchProducts };
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    market_rate: 95,
    phone: '+91 7772886416',
    address: '117A-Govinda Gaun, Ward No. 11, Bhalumda Kotma Road, Kotma, Madhya Pradesh 484444',
    working_hours: '10:00 AM to 9:00 PM (Saturday off)',
    admin_password: 'satah2024',
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      const mapped: Record<string, string> = {};
      (data || []).forEach(s => { mapped[s.setting_key] = s.setting_value; });

      setSettings({
        market_rate: Number(mapped.market_rate) || 95,
        phone: mapped.phone || '+91 7772886416',
        address: mapped.address || '',
        working_hours: mapped.working_hours || '',
        admin_password: mapped.admin_password || 'satah2024',
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  return { settings, isLoading, refetch: fetchSettings };
};
