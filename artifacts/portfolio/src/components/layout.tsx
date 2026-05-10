import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronUp } from "lucide-react";
import { useVerifyAdminPassword } from "@workspace/api-client-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminAuthModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [password, setPassword] = useState("");
  const verify = useVerifyAdminPassword();

  const handleVerify = () => {
    verify.mutate({ data: { password } }, {
      onSuccess: (res) => {
        if (res.success) {
          sessionStorage.setItem("adminToken", res.token);
          onOpenChange(false);
          window.location.reload();
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#181c24] border-[#2a2f3d] text-[#e8e6e1]">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest text-[#c9a96e]">AUTHENTICATE</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input 
            type="password" 
            placeholder="Passphrase" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#111318] border-[#2a2f3d] text-[#e8e6e1] focus-visible:ring-[#c9a96e]"
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
          />
        </div>
        <DialogFooter>
          <Button 
            onClick={handleVerify} 
            disabled={verify.isPending}
            className="bg-[#c9a96e] text-[#111318] hover:bg-[#a8c5e0] transition-colors"
          >
            {verify.isPending ? "Verifying..." : "Enter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/cv", label: "CV" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Thoughts" },
    { href: "/connect", label: "Connect" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#1e2330]/80 backdrop-blur-md border-b border-[#2a2f3d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-display text-2xl font-bold text-[#c9a96e]">
              WM
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-[0.85rem] uppercase tracking-[0.12em] transition-colors ${
                  location === link.href || (link.href === '/blog' && location.startsWith('/blog'))
                    ? "text-[#c9a96e] border-b-2 border-[#c9a96e]"
                    : "text-[#9a9db0] hover:text-[#c9a96e]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#e8e6e1]">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-[#181c24] border-b border-[#2a2f3d]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 text-base uppercase tracking-widest ${
                  location === link.href || (link.href === '/blog' && location.startsWith('/blog'))
                    ? "text-[#c9a96e]"
                    : "text-[#9a9db0]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <footer className="border-t border-[#2a2f3d] py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm text-[#9a9db0]">
        <div className="flex items-center gap-2">
          <span>© 2025 Md Waqar Moid</span>
          <button 
            onClick={() => setShowAuth(true)}
            className="w-2 h-2 rounded-full hover:bg-[#c9a96e] transition-colors opacity-20 hover:opacity-100"
            title="Admin Access"
          />
        </div>
      </div>
      <AdminAuthModal open={showAuth} onOpenChange={setShowAuth} />
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#111318] text-[#e8e6e1] font-sans selection:bg-[#c9a96e]/30">
      <Navbar />
      <main className="flex-grow pt-16 relative z-10 animate-in fade-in duration-300" key={location}>
        {children}
      </main>
      <Footer />
      
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-[#1e2330] border border-[#2a2f3d] text-[#e8e6e1] hover:text-[#c9a96e] hover:border-[#c9a96e] flex items-center justify-center transition-all shadow-lg z-50"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
}