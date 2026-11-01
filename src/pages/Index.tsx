import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const homeStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://sironindustry.com/#localbusiness",
    "name": "SATAH Iron Industry",
    "image": "https://sironindustry.com/logo.png",
    "url": "https://sironindustry.com",
    "telephone": "+917772886416",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "117A-Govinda Gaun, Ward No. 11, Bhalumda Kotma Road",
      "addressLocality": "Kotma",
      "addressRegion": "Madhya Pradesh",
      "postalCode": "484444",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.2033,
      "longitude": 81.9644
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sunday"],
        "opens": "10:00",
        "closes": "21:00"
      }
    ],
    "description": "At SATAH Iron Industry, we specialize in selling a wide range of shutter materials. From shutter strips and shutters to guides, shutter bottoms, springs, locks, gear boxes, iron pipes, and brackets, we've got everything you need for your shutter projects. Count on us for high-quality materials that are built to last. Contact SATAH Iron Industry today for all your shutter material needs!",
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Madhya Pradesh"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Chhattisgarh"
      },
      {
        "@type": "Country",
        "name": "India"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Shutter Materials & Iron Fabrication",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Rolling Shutters" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Shutter Strips (Patti 0.6mm - 1.0mm)" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Shutter Side Guides (2.5 inch & 3 inch)" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Shutter Bottom Channels" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Shutter Springs (12, 15, 18 inch)" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Shutter Brackets (Light & Heavy)" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Shutter Locks & Kunda Sets" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Rolling Shutter Gear Boxes" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Heavy Iron Pipes" } }
      ]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://sironindustry.com/#website",
    "url": "https://sironindustry.com/",
    "name": "SATAH Iron Industry",
    "description": "Manufacturer and supplier of rolling shutters, shutter strips, springs, guides, gear boxes and iron fabrication materials.",
    "publisher": {
      "@id": "https://sironindustry.com/#localbusiness"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What shutter materials do you supply?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "At SATAH Iron Industry, we specialize in selling a wide range of shutter materials: shutter strips (patti), rolling shutters, guides, shutter bottoms, springs, locks, gear boxes, iron pipes, and brackets."
        }
      },
      {
        "@type": "Question",
        "name": "Do you sell finished shutters or installation services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer both finished rolling shutters and professional installation services. Our team handles everything from manufacturing to fitting, ensuring seamless operation."
        }
      },
      {
        "@type": "Question",
        "name": "Can I order custom-length Patti and Pipes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! Custom cutting is one of our specialties. We can cut patti, pipes, and other materials to your exact specifications to reduce waste and labor costs."
        }
      },
      {
        "@type": "Question",
        "name": "What is the minimum order quantity for bulk purchases?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our minimum order varies by product type. For raw materials like patti and pipes, we typically work with orders of 100kg or more. Contact us for bulk contractor pricing."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide delivery services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer delivery services across the region including Kotma, Anuppur, Shahdol, and surrounding areas in Madhya Pradesh and Chhattisgarh."
        }
      }
    ]
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="SATAH Iron Industry | Rolling Shutter Materials, Strips, Springs, Pipes & Hardware"
        description="At SATAH Iron Industry, we specialize in selling a wide range of shutter materials. From shutter strips and shutters to guides, shutter bottoms, springs, locks, gear boxes, iron pipes, and brackets, we've got everything you need for your shutter projects. Contact us today!"
        keywords="shutter materials, rolling shutters, shutter strips, patti, shutter guides, shutter bottoms, shutter springs, shutter locks, gear boxes, iron pipes, brackets, iron fabrication, Kotma, Madhya Pradesh, SATAH Iron Industry"
        canonical="/"
        structuredData={homeStructuredData}
      />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
