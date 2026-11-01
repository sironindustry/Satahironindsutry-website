import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote: "SATAH's patti quality is consistent. My clients love the smooth operation of the shutters. The durability is unmatched in the market.",
    author: "Rajesh Kumar",
    role: "Civil Contractor",
    company: "Rajesh Construction",
    rating: 5,
  },
  {
    quote: "I source all my raw materials here. Custom cut sizes save me a lot of waste and labor cost. Their team understands our requirements perfectly.",
    author: "Amit Sharma",
    role: "Workshop Owner",
    company: "Amit Fabrication Works",
    rating: 5,
  },
  {
    quote: "Been working with SATAH for 5 years now. The quality and service have been consistently excellent. They're our go-to supplier.",
    author: "Priya Patel",
    role: "Project Manager",
    company: "Metro Builders",
    rating: 5,
  },
  {
    quote: "Their custom gate designs impressed our clients. Fast delivery and professional installation made our projects smooth.",
    author: "Suresh Mehta",
    role: "Architect",
    company: "Design Studio",
    rating: 5,
  },
];

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Trusted by Builders & Fabricators
          </h2>
          <p className="text-muted-foreground text-lg">
            We supply precision components to the industry's best. Here's what our partners say.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-card rounded-3xl p-8 sm:p-12 shadow-card border border-border">
            {/* Quote Icon */}
            <div className="absolute top-8 left-8 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Quote className="w-6 h-6 text-accent" />
            </div>

            {/* Testimonial Content */}
            <div className="pt-8">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl sm:text-2xl text-foreground font-medium leading-relaxed mb-8">
                  "{testimonials[currentIndex].quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-spark flex items-center justify-center text-accent-foreground font-bold text-xl">
                    {testimonials[currentIndex].author[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonials[currentIndex].author}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-accent"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevTestimonial}
                  className="rounded-full"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTestimonial}
                  className="rounded-full"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
