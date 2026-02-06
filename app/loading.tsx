export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      {/* Logo Animation */}
      <div className="relative opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
        {/* Outer Ring */}
        <div className="w-16 h-16 border border-[#C5A059]/30 rounded-full animate-[spin-slow_3s_linear_infinite]" />

        {/* Inner Ring */}
        <div className="absolute inset-2 border border-[#C5A059] rounded-full animate-[spin-slow-reverse_2s_linear_infinite]" />

        {/* Center Dot */}
        <div className="absolute inset-0 flex items-center justify-center animate-[pulse-scale_1.5s_ease-in-out_infinite]">
          <div className="w-2 h-2 bg-[#C5A059] rounded-full" />
        </div>
      </div>

      {/* Text */}
      <p className="mt-8 text-[10px] uppercase tracking-[0.4em] text-zinc-600 animate-[pulse-opacity_2s_ease-in-out_infinite]">
        A carregar...
      </p>
    </div>
  );
}
