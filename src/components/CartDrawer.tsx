 import { motion } from "framer-motion";
 import { ShoppingCart, Trash2, X, IndianRupee, Loader2 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Separator } from "@/components/ui/separator";
 import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
 } from "@/components/ui/sheet";
 import { useCart } from "@/hooks/useCart";
 import { useToast } from "@/hooks/use-toast";
 
 interface CartDrawerProps {
   trigger: React.ReactNode;
 }
 
 const CartDrawer = ({ trigger }: CartDrawerProps) => {
   const { cart, isLoading, cartCount, cartTotal, cartWeight, removeFromCart, clearCart } = useCart();
   const { toast } = useToast();
 
   const handleRemove = async (id: string, name: string) => {
     try {
       await removeFromCart(id);
       toast({
         title: "Removed from cart",
         description: `${name} has been removed`,
       });
     } catch (error) {
       toast({
         title: "Error",
         description: "Failed to remove item",
         variant: "destructive",
       });
     }
   };
 
   const handleClearCart = async () => {
     try {
       await clearCart();
       toast({
         title: "Cart cleared",
         description: "All items have been removed",
       });
     } catch (error) {
       toast({
         title: "Error",
         description: "Failed to clear cart",
         variant: "destructive",
       });
     }
   };
 
   return (
     <Sheet>
       <SheetTrigger asChild>
         {trigger}
       </SheetTrigger>
       <SheetContent className="w-full max-w-full sm:max-w-md flex flex-col h-[100dvh]">
         <SheetHeader>
           <SheetTitle className="flex items-center gap-2">
             <ShoppingCart className="w-5 h-5" />
             Your Cart ({cartCount})
           </SheetTitle>
           <SheetDescription>
             Review your items before checkout
           </SheetDescription>
         </SheetHeader>
 
         {isLoading ? (
           <div className="flex-1 flex items-center justify-center">
             <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
           </div>
         ) : cart.length === 0 ? (
           <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
             <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mb-4" />
             <h3 className="text-lg font-medium text-foreground">Your cart is empty</h3>
             <p className="text-sm text-muted-foreground mt-1">
               Add items from the Shop or Calculator
             </p>
           </div>
         ) : (
           <>
             <div className="min-h-0 flex-1 overflow-y-auto py-4 space-y-3">
               {cart.map((item, index) => (
                 <motion.div
                   key={item.id || index}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: index * 0.05 }}
                   className="flex items-start justify-between p-3 rounded-lg bg-secondary/30 border border-border"
                 >
                   <div className="min-w-0 flex-1 break-words">
                     <h4 className="font-medium text-foreground">{item.name}</h4>
                     <p className="text-sm text-muted-foreground">
                       {item.variantLabel} • {item.size} {item.unit}
                     </p>
                     <div className="flex flex-wrap items-center gap-3 mt-1 text-sm">
                       {item.weight > 0 && (
                         <span className="text-muted-foreground">{item.weight.toFixed(2)} kg</span>
                       )}
                       <span className="font-semibold text-accent">
                         ₹{item.price.toLocaleString()}
                       </span>
                     </div>
                   </div>
                   <Button
                     variant="ghost"
                     size="icon"
                     className="text-muted-foreground hover:text-destructive"
                     onClick={() => item.id && handleRemove(item.id, item.name)}
                   >
                     <Trash2 className="w-4 h-4" />
                   </Button>
                 </motion.div>
               ))}
             </div>
 
             <div className="border-t border-border pt-4 space-y-4">
               <div className="space-y-2">
                 {cartWeight > 0 && (
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Total Weight</span>
                     <span className="font-medium">{cartWeight.toFixed(2)} kg</span>
                   </div>
                 )}
                 <div className="flex justify-between text-lg">
                   <span className="font-medium">Total</span>
                   <span className="font-bold text-accent">
                     ₹{cartTotal.toLocaleString()}
                   </span>
                 </div>
               </div>
 
               <div className="flex gap-2">
                 <Button
                   variant="outline"
                   className="min-w-0 flex-1 break-words"
                   onClick={handleClearCart}
                 >
                   Clear Cart
                 </Button>
                 <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                   Get Quote
                 </Button>
               </div>
             </div>
           </>
         )}
       </SheetContent>
     </Sheet>
   );
 };
 
 export default CartDrawer;