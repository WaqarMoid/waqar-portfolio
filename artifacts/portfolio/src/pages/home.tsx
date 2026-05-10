import React from "react";
import { Link } from "wouter";
import { FileText, FolderOpen, PenLine, Globe } from "lucide-react";

export default function Home() {
  const cards = [
    {
      icon: <FileText size={24} className="text-[#c9a96e]" />,
      title: "Academic CV",
      desc: "Education, projects & experience",
      href: "/cv",
      delay: "0.6s"
    },
    {
      icon: <FolderOpen size={24} className="text-[#c9a96e]" />,
      title: "Creative Work",
      desc: "Presentations, papers & projects",
      href: "/projects",
      delay: "0.7s"
    },
    {
      icon: <PenLine size={24} className="text-[#c9a96e]" />,
      title: "Thoughts",
      desc: "Essays and notes",
      href: "/blog",
      delay: "0.8s"
    },
    {
      icon: <Globe size={24} className="text-[#c9a96e]" />,
      title: "Connect",
      desc: "Find me on the internet",
      href: "/connect",
      delay: "0.9s"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-12">
      <h1 
        className="font-display text-[#c9a96e] font-bold uppercase tracking-widest text-center"
        style={{ fontSize: "clamp(3rem, 8vw, 7rem)", animation: "fadeInUp 0.8s ease backwards" }}
      >
        Md Waqar Moid
      </h1>
      
      <p 
        className="text-[#9a9db0] italic text-lg md:text-xl mt-2 mb-6"
        style={{ animation: "fadeInUp 0.8s ease 0.2s backwards" }}
      >
        Undergrad student at IIT Kanpur. Interested in the high arts.
      </p>
      
      <div 
        className="w-[120px] h-px border-t border-[#c9a96e] opacity-30 my-8"
        style={{ animation: "fadeInUp 0.8s ease 0.4s backwards" }}
      />

      <div
        className="text-center mb-8"
        style={{ animation: "fadeInUp 0.8s ease 0.5s backwards" }}
      >
        <p className="font-serif text-2xl md:text-3xl text-[#c9a96e] tracking-wide mb-2" dir="rtl" lang="ar">
          رَبِّ زِدْنِي عِلْمًا
        </p>
        <p className="text-sm text-[#9a9db0] italic tracking-widest uppercase font-display">
          My Lord, increase me in knowledge
        </p>
      </div>

      <div 
        className="w-[120px] h-px border-t border-[#c9a96e] opacity-30 my-8"
        style={{ animation: "fadeInUp 0.8s ease 0.55s backwards" }}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group block p-6 bg-[#181c24] border border-[#2a2f3d] rounded-lg transition-all duration-300 hover:border-[#c9a96e] hover:-translate-y-1"
            style={{ animation: `fadeInUp 0.8s ease ${card.delay} backwards` }}
          >
            <div className="mb-4">{card.icon}</div>
            <h2 className="font-display text-xl font-bold uppercase tracking-wider mb-2 text-[#e8e6e1] group-hover:text-[#c9a96e] transition-colors">
              {card.title}
            </h2>
            <p className="text-sm text-[#9a9db0]">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}