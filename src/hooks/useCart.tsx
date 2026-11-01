 import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { useToast } from "@/hooks/use-toast";
 
 // Get or create session ID for cart
 export const getSessionId = (): string => {
   let sessionId = localStorage.getItem('cartSessionId');
   if (!sessionId) {
     sessionId = crypto.randomUUID();
     localStorage.setItem('cartSessionId', sessionId);
   }
   return sessionId;
 };
 
 export interface CartItem {
   id?: string;
   productId: string;
   name: string;
   variant: string;
   variantLabel: string;
   size: number;
   unit: string;
   weight: number;
   price: number;
 }
 
 interface CartContextType {
   cart: CartItem[];
   isLoading: boolean;
   cartCount: number;
   cartTotal: number;
   cartWeight: number;
   addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
   removeFromCart: (id: string) => Promise<void>;
   clearCart: () => Promise<void>;
   refreshCart: () => Promise<void>;
 }
 
 const CartContext = createContext<CartContextType | undefined>(undefined);
 
 export const CartProvider = ({ children }: { children: ReactNode }) => {
   const { toast } = useToast();
   const [cart, setCart] = useState<CartItem[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const sessionId = getSessionId();
 
   const fetchCart = useCallback(async () => {
     try {
       const { data, error } = await supabase
         .from('cart_items')
         .select('*')
         .eq('session_id', sessionId)
         .order('created_at', { ascending: true });
 
       if (error) throw error;
       
       setCart(data?.map(item => ({
         id: item.id,
         productId: item.product_id,
         name: item.name,
         variant: item.variant,
         variantLabel: item.variant_label,
         size: Number(item.size),
         unit: item.unit,
         weight: Number(item.weight),
         price: Number(item.price),
       })) || []);
     } catch (error) {
       console.error('Error fetching cart:', error);
     } finally {
       setIsLoading(false);
     }
   }, [sessionId]);
 
   useEffect(() => {
     fetchCart();
   }, [fetchCart]);
 
   const addToCart = async (item: Omit<CartItem, 'id'>) => {
     try {
       const { data, error } = await supabase
         .from('cart_items')
         .insert({
           session_id: sessionId,
           product_id: item.productId,
           name: item.name,
           variant: item.variant,
           variant_label: item.variantLabel,
           size: item.size,
           unit: item.unit,
           weight: item.weight,
           price: item.price,
         })
         .select()
         .single();
 
       if (error) throw error;
 
       setCart((prev) => [...prev, {
         id: data.id,
         productId: data.product_id,
         name: data.name,
         variant: data.variant,
         variantLabel: data.variant_label,
         size: Number(data.size),
         unit: data.unit,
         weight: Number(data.weight),
         price: Number(data.price),
       }]);
     } catch (error) {
       console.error('Error adding to cart:', error);
       throw error;
     }
   };
 
   const removeFromCart = async (id: string) => {
     try {
       const { error } = await supabase
         .from('cart_items')
         .delete()
         .eq('id', id);
 
       if (error) throw error;
       setCart((prev) => prev.filter((item) => item.id !== id));
     } catch (error) {
       console.error('Error removing from cart:', error);
       throw error;
     }
   };
 
   const clearCart = async () => {
     try {
       const { error } = await supabase
         .from('cart_items')
         .delete()
         .eq('session_id', sessionId);
 
       if (error) throw error;
       setCart([]);
     } catch (error) {
       console.error('Error clearing cart:', error);
       throw error;
     }
   };
 
   const cartCount = cart.length;
   const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
   const cartWeight = cart.reduce((sum, item) => sum + item.weight, 0);
 
   return (
     <CartContext.Provider value={{
       cart,
       isLoading,
       cartCount,
       cartTotal,
       cartWeight,
       addToCart,
       removeFromCart,
       clearCart,
       refreshCart: fetchCart,
     }}>
       {children}
     </CartContext.Provider>
   );
 };
 
 export const useCart = () => {
   const context = useContext(CartContext);
   if (context === undefined) {
     throw new Error('useCart must be used within a CartProvider');
   }
   return context;
 };