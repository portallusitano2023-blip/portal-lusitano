"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";

// Componente de Upload Simulado (Visual de Engenharia)
const UploadZone = ({ label, icon }: { label: string; icon: string }) => (
  <div className="border border-dashed border-zinc-800 bg-zinc-900/50 p-8 text-center hover:border-[#C5A059] hover:bg-zinc-900 transition-all cursor-pointer group">
    <div className="text-2xl mb-3 text-zinc-600 group-hover:text-[#C5A059] transition-colors">
      {icon}
    </div>
    <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">{label}</p>
    <p className="text-[9px] text-zinc-600">Arraste o ficheiro PDF ou JPG</p>
  </div>
);

export default function VenderPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Passos do Protocolo
  const steps = [
    { id: 1, title: "Identificação Genética", subtitle: "Dados do Livro Azul (LA)" },
    { id: 2, title: "Status Veterinário", subtitle: "Raios-X e Exames" },
    { id: 3, title: "Morfologia & Media", subtitle: "Fotos e Vídeos Técnicos" },
    { id: 4, title: "Revisão & Contrato", subtitle: "Validação Final" },
  ];

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
        {/* HEADER: A SEGURANÇA PRIMEIRO */}
        <header className="max-w-4xl mx-auto mb-12 text-center">
          <div className="inline-flex items-center gap-2 border border-zinc-800 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[9px] uppercase tracking-widest text-zinc-400">
              Ambiente Seguro • SSL Encriptado
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif italic mb-6">
            Protocolo de <span className="text-[#C5A059]">Certificação</span>
          </h1>
          <p className="text-zinc-500 font-light text-sm max-w-xl mx-auto">
            Para garantir a integridade do Portal Lusitano, exigimos dados completos de cada
            exemplar. O seu cavalo será submetido a uma <strong>auditoria técnica</strong> antes de
            ficar online.
          </p>
        </header>

        {/* STEPPER (BARRA DE PROGRESSO) */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="flex justify-between relative">
            {/* Linha de fundo */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-900 -z-10"></div>

            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-4 bg-black px-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-500
                    ${
                      currentStep >= step.id
                        ? "border-[#C5A059] text-black bg-[#C5A059]"
                        : "border-zinc-800 text-zinc-600 bg-black"
                    }
                  `}
                >
                  {step.id}
                </div>
                <div className="text-center hidden md:block">
                  <p
                    className={`text-[9px] uppercase tracking-widest font-bold ${currentStep >= step.id ? "text-white" : "text-zinc-700"}`}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTEÚDO DOS PASSOS */}
        <div className="max-w-4xl mx-auto bg-zinc-950 border border-zinc-900 p-8 md:p-16 relative">
          {/* STEP 1: GENÉTICA (RIGOROSO) */}
          {currentStep === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                <h3 className="text-xl font-serif italic text-white">Dados do Stud-Book (APSL)</h3>
                <span className="text-xs text-zinc-500">Passo 1/4</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-500">
                    Nome Completo (Livro Azul)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-black border border-zinc-800 p-4 text-white text-sm focus:border-[#C5A059] outline-none"
                    placeholder="Ex: IMPERADOR II"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-500">
                    Nº UELN (Universal Equine Life Number)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-black border border-zinc-800 p-4 text-white text-sm focus:border-[#C5A059] outline-none font-mono"
                    placeholder="724015..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-500">
                    Nº do Microchip
                  </label>
                  <input
                    type="text"
                    className="w-full bg-black border border-zinc-800 p-4 text-white text-sm focus:border-[#C5A059] outline-none font-mono"
                    placeholder="9811000..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-500">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    className="w-full bg-black border border-zinc-800 p-4 text-white text-sm focus:border-[#C5A059] outline-none text-zinc-400"
                  />
                </div>
              </div>

              <div className="pt-4">
                <label className="text-[9px] uppercase tracking-widest text-zinc-500 block mb-4">
                  Comprovativo de Propriedade (Obrigatório)
                </label>
                <UploadZone label="Carregar Foto do Livro Azul (Página Resenho)" icon="📘" />
              </div>
            </div>
          )}

          {/* STEP 2: VETERINÁRIA (SEGURANÇA PARA O COMPRADOR) */}
          {currentStep === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                <h3 className="text-xl font-serif italic text-white">Status Clínico</h3>
                <span className="text-xs text-zinc-500">Passo 2/4</span>
              </div>

              <div className="bg-red-950/20 border border-red-900/30 p-6 flex gap-4 items-start">
                <span className="text-red-500 text-xl">⚠️</span>
                <p className="text-xs text-red-200/70 leading-relaxed">
                  <strong>Aviso de Transparência:</strong> Omitir lesões ou cirurgias prévias
                  resultará no banimento permanente do vendedor e na retenção da taxa de inscrição.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                    Exames Disponíveis
                  </p>
                  <label className="flex items-center gap-3 p-4 border border-zinc-800 bg-black cursor-pointer hover:border-zinc-600">
                    <input type="checkbox" className="accent-[#C5A059]" />
                    <span className="text-sm text-zinc-300">Raio-X (Set Completo)</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-zinc-800 bg-black cursor-pointer hover:border-zinc-600">
                    <input type="checkbox" className="accent-[#C5A059]" />
                    <span className="text-sm text-zinc-300">Análises Piroplasmose</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-zinc-800 bg-black cursor-pointer hover:border-zinc-600">
                    <input type="checkbox" className="accent-[#C5A059]" />
                    <span className="text-sm text-zinc-300">Exame Clínico de Compra</span>
                  </label>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                    Vícios e Comportamento
                  </p>
                  <textarea
                    className="w-full h-40 bg-black border border-zinc-800 p-4 text-white text-sm focus:border-[#C5A059] outline-none"
                    placeholder="Descreva honestamente o temperamento (box, transporte, ferrar) e se existe algum vício de estábulo..."
                  ></textarea>
                </div>
              </div>

              <UploadZone label="Carregar Relatório Veterinário (PDF)" icon="🩺" />
            </div>
          )}

          {/* STEP 3: MEDIA (QUALIDADE VISUAL) */}
          {currentStep === 3 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                <h3 className="text-xl font-serif italic text-white">Dossier Visual</h3>
                <span className="text-xs text-zinc-500">Passo 3/4</span>
              </div>

              <p className="text-zinc-500 text-sm italic">
                Não aceitamos fotos de telemóvel de baixa qualidade. O seu cavalo será avaliado pelo
                que mostra aqui.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <UploadZone label="Foto de Modelo (Perfil)" icon="📸" />
                <UploadZone label="Foto de Frente" icon="📸" />
                <UploadZone label="Foto de Garupa" icon="📸" />
                <UploadZone label="Foto em Movimento" icon="🏇" />
              </div>

              <div className="space-y-2 pt-6">
                <label className="text-[9px] uppercase tracking-widest text-zinc-500">
                  Link de Vídeo (Obrigatório: Passo, Trote, Galope)
                </label>
                <input
                  type="url"
                  className="w-full bg-black border border-zinc-800 p-4 text-white text-sm focus:border-[#C5A059] outline-none font-mono"
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          )}

          {/* STEP 4: REVISÃO (O CONTRATO) */}
          {currentStep === 4 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                <h3 className="text-xl font-serif italic text-white">Submissão para Auditoria</h3>
                <span className="text-xs text-zinc-500">Passo Final</span>
              </div>

              <div className="bg-zinc-900 p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-[#C5A059]/10 text-[#C5A059] rounded-full flex items-center justify-center text-2xl mx-auto border border-[#C5A059]/30">
                  🔒
                </div>
                <h4 className="text-white text-lg font-serif">
                  O cavalo entrará em &ldquo;Quarentena Digital&rdquo;
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-lg mx-auto">
                  Após o pagamento da taxa de listagem (75€), a equipa do Portal Lusitano irá
                  verificar o UELN e o Chip junto da base de dados oficial.
                  <br />
                  <br />
                  Se os dados não corresponderem, o anúncio será rejeitado.
                </p>
              </div>

              <div className="flex items-start gap-4 p-4 border border-zinc-800">
                <input type="checkbox" className="mt-1 accent-[#C5A059]" />
                <p className="text-xs text-zinc-500">
                  Declaro sob compromisso de honra que sou o legítimo proprietário deste animal e
                  autorizo o Portal Lusitano a verificar os dados clínicos junto do médico
                  veterinário indicado.
                </p>
              </div>
            </div>
          )}

          {/* BOTÕES DE NAVEGAÇÃO */}
          <div className="flex justify-between mt-12 pt-8 border-t border-zinc-900">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className={`text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors ${currentStep === 1 ? "invisible" : ""}`}
            >
              ← Voltar
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                className="bg-white text-black px-8 py-3 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-[#C5A059] transition-colors"
              >
                Próximo Passo
              </button>
            ) : (
              <button className="bg-[#C5A059] text-black px-10 py-4 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                Pagar e Submeter para Análise
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
