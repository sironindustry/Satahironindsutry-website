import { useState } from "react";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface QuoteDialogProps {
  trigger: React.ReactNode;
}

const QuoteDialog = ({ trigger }: QuoteDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    product: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({ title: "Please fill in your name and phone number", variant: "destructive" });
      return;
    }

    const text = `*Quote Request*%0A👤 ${formData.name}%0A📞 ${formData.phone}%0A📧 ${formData.email || "N/A"}%0A📦 ${formData.product || "General"}%0A💬 ${formData.message || "No message"}`;
    window.open(`https://wa.me/917772886416?text=${text}`, "_blank");

    toast({ title: "Redirecting to WhatsApp..." });
    setFormData({ name: "", phone: "", email: "", product: "", message: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Get a Free Quote</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Product / Service</Label>
            <Input
              placeholder="e.g. Rolling Shutter, Gate, Fabrication"
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              placeholder="Tell us about your requirements..."
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="resize-none"
            />
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
            Send via WhatsApp
            <Send className="ml-2 w-4 h-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDialog;
