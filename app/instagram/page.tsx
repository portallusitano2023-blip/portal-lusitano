import { Users, Heart, Sparkles, ArrowRight } from "lucide-react";
import { IconInstagram } from "@/components/icons/SocialIcons";
import InstagramForm from "@/components/instagram/InstagramForm";

const stats = [
  { value: "19K+", label: "Seguidores", icon: Users },
  { value: "5%+", label: "Engagement", icon: Heart },
  { value: "100%", label: "P\u00FAblico Equestre", icon: Sparkles },
];

export default function InstagramPage() {
  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <div className="relative text-center mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 800px 600px at 50% 30%, rgba(197,160,89,0.07) 0%, transparent 70%)",
            }}
          />

          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(197,89,200,0.25)]">
            <IconInstagram className="text-white" size={40} />
          </div>

          <span className="inline-block text-xs uppercase tracking-[0.3em] text-[#C5A059] border border-[#C5A059]/30 rounded-full px-4 py-1 mb-6">
            Publicidade
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white mb-5 leading-tight">
            Promova no Nosso Instagram
          </h1>

          <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
            {"Alcance milhares de entusiastas do mundo equestre atrav\u00E9s da nossa comunidade"}
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C5A059]/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/60" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C5A059]/50" />
          </div>

          <a
            href="https://instagram.com/portal_lusitano"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-8 py-3.5 rounded-full font-medium hover:opacity-90 transition-opacity shadow-[0_4px_24px_rgba(197,89,200,0.25)]"
          >
            <IconInstagram size={18} />
            @portal_lusitano
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-4 mb-16 max-w-2xl mx-auto opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.1s" }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-[#0A0A0A] border border-white/[0.08] rounded-2xl flex flex-col items-center"
            >
              <stat.icon className="text-[#C5A059] mb-3" size={22} />
              <div className="text-4xl font-serif text-white mb-1 leading-none">
                {stat.value}
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Packages + Form (client component) */}
        <InstagramForm />

        {/* Why Us */}
        <div
          className="mt-20 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="flex items-center gap-4 mb-14 max-w-3xl mx-auto">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-[#C5A059]/30" />
            <div className="w-2 h-2 rounded-full bg-[#C5A059]/50" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#C5A059]/30 to-[#C5A059]/30" />
          </div>

          <h2 className="text-3xl font-serif text-white text-center mb-10">
            {"Porqu\u00EA Promover Connosco?"}
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-full flex items-center justify-center mb-5">
                <Users className="text-[#C5A059]" size={22} />
              </div>
              <h3 className="text-white font-medium text-base mb-3">
                {"Audi\u00EAncia Qualificada"}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {"100% do nosso p\u00FAblico \u00E9 interessado em cavalos e equita\u00E7\u00E3o"}
              </p>
            </div>

            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-full flex items-center justify-center mb-5">
                <Heart className="text-[#C5A059]" size={22} />
              </div>
              <h3 className="text-white font-medium text-base mb-3">Alto Engagement</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {"Comunidade ativa que interage genuinamente com o conte\u00FAdo"}
              </p>
            </div>

            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-full flex items-center justify-center mb-5">
                <Sparkles className="text-[#C5A059]" size={22} />
              </div>
              <h3 className="text-white font-medium text-base mb-3">{"Conte\u00FAdo Premium"}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {"Criamos conte\u00FAdo de qualidade que representa bem a sua marca"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
