import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, Calculator, Phone, Home, Store, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import logoAsset from "@/assets/logo.png";
 import CartDrawer from "@/components/CartDrawer";
 import { useCart } from "@/hooks/useCart";
 import QuoteDialog from "@/components/QuoteDialog";

const navLinks = [
  { name: "Home", href: "/", icon: Home, isRoute: true },
  { name: "Shop", href: "/shop", icon: Store, isRoute: true },
  { name: "Calculator", href: "/calculator", icon: Calculator, isRoute: true },
  { name: "Weight", href: "/weight-calculation", icon: Scale, isRoute: true },
  { name: "Contact", href: "#contact", icon: Phone, isRoute: false },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
   const { cartCount } = useCart();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3"
            >
              <img
                src={logoAsset}
                alt="SATAH Iron Industry logo"
                className="h-10 w-auto rounded-lg object-contain bg-white p-0.5"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground tracking-tight">SATAH</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">Iron Industry</span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => 
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              ) : (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </motion.a>
              )
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
             <CartDrawer
               trigger={
                 <Button variant="ghost" size="icon" className="relative">
                   <ShoppingCart className="w-5 h-5" />
                   <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                     {cartCount}
                   </span>
                 </Button>
               }
             />
            <QuoteDialog
              trigger={
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-accent">
                  Get Quote
                </Button>
              }
            />
          </div>

          {/* Mobile Menu Button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="ghost"
            size="icon"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="lg:hidden"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => 
                link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={`/${link.href}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </a>
                )
              )}
              <QuoteDialog trigger={<Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">Get Quote</Button>} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
