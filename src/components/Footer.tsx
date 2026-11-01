import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Linkedin, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logoAsset from "@/assets/logo.png";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-iron relative mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src={logoAsset}
                alt="SATAH Iron Industry logo"
                className="h-10 w-auto rounded-lg object-contain bg-white p-0.5"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary-foreground tracking-tight">SATAH</span>
                <span className="text-xs text-primary-foreground/60 uppercase tracking-widest">Iron Industry</span>
              </div>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-6">
              Manufacturing strong, reliable, and precisely engineered iron products since 2014.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, index) => (
                <a key={index} href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-accent flex items-center justify-center transition-colors group">
                  <Icon className="w-5 h-5 text-primary-foreground/60 group-hover:text-accent-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-primary-foreground font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/#about" },
                { name: "Shop", href: "/shop" },
                { name: "Calculator", href: "/calculator" },
                { name: "Contact", href: "/#contact" },
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-primary-foreground font-semibold mb-6">Products</h4>
            <ul className="space-y-3">
              {["Rolling Shutters", "Iron Gates", "Patti & Pipes", "Custom Fabrication", "Accessories"].map(link => (
                <li key={link}>
                  <Link to="/shop" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Updated */}
          <div>
            <h4 className="text-primary-foreground font-semibold mb-6">Stay Updated</h4>
            <p className="text-primary-foreground/60 text-sm mb-4">
              Subscribe for updates on new products and special offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="min-w-0 flex-1 px-4 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 text-sm focus:outline-none focus:border-accent"
              />
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © 2024 SATAH Iron Industry. All rights reserved.
            </p>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shadow-accent"
            >
              <ArrowUp className="w-5 h-5 text-accent-foreground" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
