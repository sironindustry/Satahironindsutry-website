import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do you sell finished shutters or installation services?",
    answer: "Yes! We offer both finished rolling shutters and professional installation services. Our team handles everything from manufacturing to fitting, ensuring seamless operation and optimal performance.",
  },
  {
    question: "Can I order custom-length Patti and Pipes?",
    answer: "Absolutely! Custom cutting is one of our specialties. We can cut patti, pipes, and other materials to your exact specifications. This helps reduce waste and labor costs for your projects.",
  },
  {
    question: "What is the minimum order quantity for bulk purchases?",
    answer: "Our minimum order varies by product type. For raw materials like patti and pipes, we typically work with orders of 100kg or more. Contact us for specific requirements and bulk pricing.",
  },
  {
    question: "Do you provide delivery services?",
    answer: "Yes, we offer delivery services across the region. Delivery charges depend on the distance and order size. For large orders, we often provide free delivery within the city limits.",
  },
  {
    question: "What warranty do you offer on your products?",
    answer: "All our manufactured products come with a 2-year warranty against manufacturing defects. Installation services include a 1-year workmanship warranty. Extended warranty options are also available.",
  },
  {
    question: "Can you handle large commercial projects?",
    answer: "Yes, we regularly work on large commercial and industrial projects. Our manufacturing capacity allows us to handle bulk orders while maintaining consistent quality and timely delivery.",
  },
];

const FAQ = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden" id="faq">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Common questions from our B2B partners and clients
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border px-6 shadow-card data-[state=open]:shadow-lg transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-accent py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
