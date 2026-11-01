import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    value: "+91 7772886416",
    link: "tel:+917772886416",
  },
  {
    icon: Mail,
    title: "Email",
    value: "info@satahiron.com",
    link: "mailto:info@satahiron.com",
  },
  {
    icon: MapPin,
    title: "Address",
    value: "117A-Govinda Gaun, Ward No. 11, Bhalumda Kotma Road, Kotma, Madhya Pradesh 484444",
    link: "#",
  },
  {
    icon: Clock,
    title: "Working Hours",
    value: "10:00 AM - 9:00 PM (Sat Off)",
    link: "#",
  },
];

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name && !formData.phone) {
      toast({ title: "Please enter your name or phone number", variant: "destructive" });
      return;
    }
    const text = `*Inquiry from Website*%0A👤 ${formData.name || "Customer"}%0A📞 ${formData.phone || "N/A"}%0A📧 ${formData.email || "N/A"}%0A💬 ${formData.message || "I am interested in your shutter materials."}`;
    window.open(`https://wa.me/917772886416?text=${text}`, "_blank");
    toast({ title: "Inquiry Sent!", description: "Opening WhatsApp to connect with SATAH Iron Industry..." });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section className="py-24 bg-steel relative overflow-hidden" id="contact">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
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
            Contact Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Let's Build Something Great Together
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            Get in touch for quotes, custom orders, or any questions about our products and services.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 min-w-0 space-y-4"
          >
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                className="flex items-start gap-4 p-4 rounded-xl bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/30 transition-colors">
                  <info.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="text-sm text-primary-foreground/60 mb-1">
                    {info.title}
                  </div>
                  <div className="font-semibold text-primary-foreground break-words">
                    {info.value}
                  </div>
                </div>
              </a>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="p-4 sm:p-8 rounded-lg bg-card shadow-card border border-border">
              <h3 className="text-xl font-bold text-card-foreground mb-6">
                Send us a message
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Your Name
                  </label>
                  <Input
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-secondary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Phone Number
                  </label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-secondary/50"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Your Message
                </label>
                <Textarea
                  placeholder="Tell us about your project requirements..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-secondary/50 resize-none"
                />
              </div>
              
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-accent" size="lg">
                Send Message
                <Send className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
