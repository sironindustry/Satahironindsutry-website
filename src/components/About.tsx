import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Users, Factory, Truck } from "lucide-react";

const stats = [
  { icon: Factory, value: "10+", label: "Years of Excellence" },
  { icon: Users, value: "500+", label: "Happy Clients" },
  { icon: Truck, value: "1000+", label: "Projects Delivered" },
  { icon: Star, value: "4.9", label: "Customer Rating" },
];

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/50 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              About Us
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              About <span className="text-gradient">SATAH</span> Iron Industry
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              SATAH IRON INDUSTRY specializes in manufacturing strong, reliable, and 
              precisely engineered iron products. We provide top-quality rolling shutters, 
              gates, and custom fabrication solutions designed for durability and long-term 
              performance.
            </p>
            
            <p className="text-muted-foreground mb-8 leading-relaxed">
              With a focus on innovation and customer satisfaction, we work hard to deliver 
              products that meet the highest standards of safety, strength, and craftsmanship. 
              Our commitment to excellence has made us the trusted choice for builders and 
              fabricators across the region.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="p-4 rounded-xl bg-card shadow-card border border-border hover:shadow-lg transition-shadow"
                >
                  <stat.icon className="w-8 h-8 text-accent mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square w-[calc(100%-80px)] max-w-lg mx-auto">
              {/* Main Circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-iron flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl font-bold text-primary-foreground mb-2">10+</div>
                  <div className="text-primary-foreground/70 text-lg">Years Building Trust</div>
                </div>
              </div>
              
              {/* Decorative Rings */}
              <div className="absolute inset-[-20px] rounded-full border-2 border-accent/20 animate-pulse-glow" />
              <div className="absolute inset-[-40px] rounded-full border border-accent/10" />
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 right-10 p-4 rounded-xl bg-card shadow-lg border border-border"
              >
                <Factory className="w-8 h-8 text-accent" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 left-10 p-4 rounded-xl bg-card shadow-lg border border-border"
              >
                <Star className="w-8 h-8 text-accent" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
