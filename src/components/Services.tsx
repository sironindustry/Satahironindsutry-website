import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Wrench, Shield, Settings, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Wrench,
    title: "Custom Manufacturing",
    description: "Tailored iron works to fit your specific requirements. From rolling shutters to industrial gates, we craft solutions that match your exact specifications.",
    features: ["Custom Sizes", "Premium Materials", "Quality Tested"],
  },
  {
    icon: Shield,
    title: "Professional Installation",
    description: "Expert installation ensuring safety and longevity. Our trained technicians guarantee perfect fitting and optimal performance.",
    features: ["Skilled Technicians", "Safety First", "Warranty Included"],
  },
  {
    icon: Settings,
    title: "Maintenance & Repair",
    description: "Regular servicing to keep your shutters operating smoothly. Preventive maintenance and quick repairs when you need them.",
    features: ["24/7 Support", "Quick Response", "Annual Contracts"],
  },
  {
    icon: Truck,
    title: "B2B Supply",
    description: "Bulk supply of raw materials and components for contractors and fabricators. Competitive pricing with consistent quality.",
    features: ["Bulk Pricing", "Fast Delivery", "Custom Cutting"],
  },
];

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-steel relative overflow-hidden" id="services">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Comprehensive Solutions for All Your Needs
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            From manufacturing to installation and maintenance, we provide end-to-end 
            solutions that keep your business secure and operational.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="group p-4 sm:p-8 rounded-lg bg-card shadow-card border border-border hover:shadow-lg hover:border-accent/30 transition-all duration-300"
            >
              <div className="flex items-start gap-3 sm:gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-spark flex items-center justify-center shadow-accent">
                  <service.icon className="w-7 h-7 text-accent-foreground" />
                </div>
                
                <div className="min-w-0 flex-1 break-words">
                  <h3 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <Button variant="ghost" className="group/btn p-0 h-auto text-accent hover:text-accent/80 hover:bg-transparent">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
