import { Home, Store, Calculator, ShoppingCart, Scale } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/useCart";

const destinations = [
  { to: "/", label: "Home", icon: Home },
  { to: "/shop", label: "Shop", icon: Store },
  { to: "/calculator", label: "Calculator", icon: Calculator },
  { to: "/weight-calculation", label: "Weight", icon: Scale },
];

export default function MobileNavigation() {
  const { cartCount } = useCart();
  return (
    <nav aria-label="Mobile navigation" className="mobile-navigation fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card lg:hidden">
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {destinations.map(({ to, label, icon: Icon }) => (
          <Button key={to} asChild variant="ghost" className="h-14 min-w-0 flex-col gap-1 px-1 text-xs text-muted-foreground [&_svg]:size-5 [&.active]:bg-accent/10 [&.active]:text-accent">
            <NavLink to={to} end={to === "/"} onClick={() => window.scrollTo({ top: 0 })}>
              <Icon />
              <span>{label}</span>
            </NavLink>
          </Button>
        ))}
        <CartDrawer trigger={
          <Button variant="ghost" aria-label={`Cart (${cartCount})`} className="h-14 min-w-0 flex-col gap-1 px-1 text-xs text-muted-foreground [&_svg]:size-5">
            <span className="relative"><ShoppingCart />{cartCount > 0 && <span className="absolute -right-3 -top-1 min-w-4 rounded-full bg-accent px-1 text-[10px] text-accent-foreground">{cartCount}</span>}</span>
            <span>Cart</span>
          </Button>
        } />
      </div>
    </nav>
  );
}