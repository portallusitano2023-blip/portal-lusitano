"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Aqui faremos a ligação com a API que vamos criar a seguir
    const res = await fetch("/api/newsletter", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    if (res.ok) setStatus("success");
    else setStatus("error");
  };

  return (
    <section className="bg-[var(--background-secondary)] border-y border-[var(--border)] py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-serif text-[var(--foreground)] mb-4">
          Inscreva-se na <span className="text-[var(--gold)]">Gazeta Lusitana</span>
        </h2>
        <p className="text-[var(--foreground-muted)] mb-8 uppercase tracking-widest text-xs">
          Receba análises de linhagens e oportunidades de investimento por e-mail.
        </p>

        {status === "success" ? (
          <p className="text-[var(--gold)] font-bold">
            Bem-vindo à elite. A sua subscrição foi confirmada.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-4 justify-center"
            aria-label="Subscrição da newsletter"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              O seu e-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="O seu melhor e-mail"
              className="bg-[var(--background)] border border-[var(--border)] px-6 py-4 text-[var(--foreground)] w-full md:w-96 focus:border-[var(--gold)] outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-[var(--gold)] text-black px-10 py-4 font-bold uppercase text-xs tracking-widest hover:bg-white transition"
              aria-label={status === "loading" ? "A processar subscrição" : "Subscrever newsletter"}
            >
              {status === "loading" ? "A Processar..." : "Subscrever"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
