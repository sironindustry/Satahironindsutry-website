import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuoteDialog from "@/components/QuoteDialog";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-[min(760px,90svh)] lg:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Industrial manufacturing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-iron/50 via-transparent to-transparent" />
      </div>


      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium border border-accent/30">
              <Zap className="w-4 h-4" />
              Trusted by 500+ Businesses
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6"
          >
            Secure Your World with{" "}
            <span className="text-gradient">Precision Engineering</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-primary-foreground/70 max-w-2xl mb-8"
          >
            Premium rolling shutters, gates, and custom iron fabrication. Built for 
            durability, engineered for performance, designed for your business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-accent text-base px-8 py-6 group"
            >
              Explore Products
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <QuoteDialog
              trigger={
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/50 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 text-base px-8 py-6"
                >
                  Get Free Estimate
                </Button>
              }
            />
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-6"
          >
            {[
              { icon: ShieldCheck, text: "10+ Years Experience" },
              { icon: Award, text: "ISO Certified" },
              { icon: Zap, text: "Fast Delivery" },
            ].map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-primary-foreground/60"
              >
                <badge.icon className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="hidden lg:block absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-accent rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
