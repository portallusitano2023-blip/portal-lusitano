"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Star,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Trophy,
  TrendingUp,
  MessageCircle,
  Globe,
  Truck,
  Video,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  GraduationCap,
  BookOpen,
  FileText,
  PlayCircle,
  Siren,
  BadgeCheck,
} from "lucide-react";
import { BadgeVerificacao, BarraExpertise } from "./BadgeVerificacao";
import { MetricasPanel } from "./MetricasPanel";
import { EXPERTISE_CONFIG } from "./constants";
import type { Profissional } from "./types";

export function ModalProfissional({
  profissional,
  onClose,
}: {
  profissional: Profissional;
  onClose: () => void;
}) {
  const [aba, setAba] = useState<
    "info" | "especializacoes" | "testemunhos" | "disponibilidade" | "formacao"
  >("info");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[var(--gold)]/20 to-[var(--background-secondary)] p-6 border-b border-[var(--border)]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-start gap-4">
            {profissional.fotoUrl ? (
              <Image
                src={profissional.fotoUrl}
                alt={profissional.nome}
                width={80}
                height={80}
                className="w-20 h-20 rounded-xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--gold)]/40 to-[var(--background-card)] rounded-xl flex items-center justify-center text-3xl font-serif text-[var(--gold)]">
                {profissional.nome.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  {profissional.nome}
                </h2>
                <BadgeVerificacao nivel={profissional.nivelVerificacao} />
              </div>
              <p className="text-sm text-[var(--gold)]">{profissional.titulo}</p>
              <p className="text-sm text-[var(--foreground-secondary)]">
                {profissional.especialidade}
              </p>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-[var(--gold)] fill-[var(--gold)]" />
                  <span className="text-sm font-medium">{profissional.avaliacao}</span>
                  <span className="text-xs text-[var(--foreground-muted)]">
                    ({profissional.numAvaliacoes} avaliações)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--foreground-secondary)]">
                  <MapPin size={12} />
                  {profissional.localizacao}
                </div>
                <div className="text-xs text-[var(--foreground-muted)]">
                  {profissional.experienciaAnos} anos exp.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[var(--border)] px-6 overflow-x-auto">
          <div className="flex gap-1 -mb-px">
            {[
              { id: "info", label: "Informação" },
              { id: "especializacoes", label: "Especializações" },
              { id: "testemunhos", label: "Testemunhos" },
              { id: "disponibilidade", label: "Disponibilidade" },
              { id: "formacao", label: "Formação" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setAba(t.id as typeof aba)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${aba === t.id ? "border-[var(--gold)] text-[var(--gold)]" : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {aba === "info" && <TabInfo profissional={profissional} />}

          {aba === "especializacoes" && <TabEspecializacoes profissional={profissional} />}

          {aba === "testemunhos" && <TabTestemunhos profissional={profissional} />}

          {aba === "disponibilidade" && <TabDisponibilidade profissional={profissional} />}

          {aba === "formacao" && <TabFormacao profissional={profissional} />}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab sub-components (private to this module)
// ---------------------------------------------------------------------------

function TabInfo({ profissional }: { profissional: Profissional }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-2">Sobre</h3>
        <p className="text-[var(--foreground-secondary)] text-sm">{profissional.descricao}</p>
      </div>
      <MetricasPanel metricas={profissional.metricas} />
      <div>
        <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-2">Serviços</h3>
        <div className="flex flex-wrap gap-2">
          {profissional.servicos.map((s, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-[var(--background-card)] rounded-full text-xs text-[var(--foreground-secondary)]"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-2">
          Credenciais
        </h3>
        <ul className="space-y-2">
          {profissional.credenciais.map((c, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-[var(--foreground-secondary)]"
            >
              <CheckCircle size={14} className="text-[var(--gold)] mt-0.5 flex-shrink-0" />
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap gap-3">
        {profissional.idiomas && (
          <div className="bg-[var(--background-card)]/50 rounded-lg px-3 py-2">
            <span className="text-xs text-[var(--foreground-muted)] block">Idiomas</span>
            <span className="text-sm text-[var(--foreground)]">
              {profissional.idiomas.join(", ")}
            </span>
          </div>
        )}
        {profissional.precoMedio && (
          <div className="bg-[var(--background-card)]/50 rounded-lg px-3 py-2">
            <span className="text-xs text-[var(--foreground-muted)] block">Preço Médio</span>
            <span className="text-sm text-[var(--gold)]">{profissional.precoMedio}</span>
          </div>
        )}
      </div>
      {profissional.redesSociais && (
        <div className="flex gap-2">
          {profissional.redesSociais.instagram && (
            <a
              href={profissional.redesSociais.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 bg-[var(--background-card)] rounded-lg text-[var(--foreground-secondary)] hover:text-pink-400"
            >
              <Instagram size={16} />
            </a>
          )}
          {profissional.redesSociais.facebook && (
            <a
              href={profissional.redesSociais.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 bg-[var(--background-card)] rounded-lg text-[var(--foreground-secondary)] hover:text-blue-400"
            >
              <Facebook size={16} />
            </a>
          )}
          {profissional.redesSociais.youtube && (
            <a
              href={profissional.redesSociais.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="p-2 bg-[var(--background-card)] rounded-lg text-[var(--foreground-secondary)] hover:text-red-400"
            >
              <Youtube size={16} />
            </a>
          )}
          {profissional.redesSociais.linkedin && (
            <a
              href={profissional.redesSociais.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2 bg-[var(--background-card)] rounded-lg text-[var(--foreground-secondary)] hover:text-blue-500"
            >
              <Linkedin size={16} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function TabEspecializacoes({ profissional }: { profissional: Profissional }) {
  return (
    <div className="space-y-4">
      {profissional.especializacoes.map((esp, i) => (
        <div key={i} className="bg-[var(--background-card)]/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-[var(--foreground)] text-sm">{esp.nome}</span>
            <span
              className={`text-xs px-2 py-1 rounded ${EXPERTISE_CONFIG[esp.nivel].cor} text-white`}
            >
              {EXPERTISE_CONFIG[esp.nivel].label}
            </span>
          </div>
          <BarraExpertise nivel={esp.nivel} />
          {esp.certificado && (
            <div className="mt-2 text-xs text-[var(--foreground-secondary)]">
              <span className="text-[var(--gold)]">{esp.certificado}</span>
              {esp.instituicao && <span> &bull; {esp.instituicao}</span>}
              {esp.anoObtencao && <span> &bull; {esp.anoObtencao}</span>}
            </div>
          )}
        </div>
      ))}
      {profissional.premios && profissional.premios.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[var(--gold)] mb-3 flex items-center gap-2">
            <Trophy size={16} />
            Prémios
          </h3>
          {profissional.premios.map((p, i) => (
            <div
              key={i}
              className="bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-lg p-3 mb-2"
            >
              <div className="font-medium text-[var(--foreground)] text-sm">{p.titulo}</div>
              <div className="text-xs text-[var(--foreground-secondary)]">
                {p.entidade} &bull; {p.ano}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TabTestemunhos({ profissional }: { profissional: Profissional }) {
  return (
    <div className="space-y-4">
      {profissional.testemunhos && profissional.testemunhos.length > 0 ? (
        <>
          {profissional.testemunhos.map((t, i) => (
            <div key={i} className="bg-[var(--background-card)]/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={12}
                      className={
                        j < t.avaliacao
                          ? "text-[var(--gold)] fill-[var(--gold)]"
                          : "text-[var(--foreground-muted)]"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-[var(--foreground)]">{t.cliente}</span>
                {t.verificado && <BadgeCheck size={12} className="text-blue-400" />}
                <span className="text-xs text-[var(--foreground-muted)] ml-auto">{t.data}</span>
              </div>
              <p className="text-sm text-[var(--foreground-secondary)] italic">
                &ldquo;{t.texto}&rdquo;
              </p>
              {t.cavalo && (
                <div className="text-xs text-[var(--gold)] mt-1">Cavalo: {t.cavalo}</div>
              )}
            </div>
          ))}
          {profissional.casosSucesso && profissional.casosSucesso.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-[var(--gold)] mb-3 flex items-center gap-2">
                <TrendingUp size={16} />
                Casos de Sucesso
              </h3>
              {profissional.casosSucesso.map((c, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-4 mb-3 ${c.destaque ? "bg-[var(--gold)]/10 border border-[var(--gold)]/20" : "bg-[var(--background-card)]/30"}`}
                >
                  <h4 className="font-medium text-[var(--foreground)] text-sm mb-1">{c.titulo}</h4>
                  <p className="text-xs text-[var(--foreground-secondary)]">{c.descricao}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span className="text-xs text-green-400">{c.resultado}</span>
                  </div>
                  <span className="text-xs text-[var(--foreground-muted)] mt-1 block">
                    {c.data}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-[var(--foreground-muted)]">
          <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
          <p>Ainda sem testemunhos públicos</p>
        </div>
      )}
    </div>
  );
}

function TabDisponibilidade({ profissional }: { profissional: Profissional }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-3">
          Horário de Funcionamento
        </h3>
        <div className="bg-[var(--background-card)]/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[var(--foreground)]">
              {profissional.disponibilidade.horaInicio} - {profissional.disponibilidade.horaFim}
            </span>
            {profissional.disponibilidade.emergencias24h && (
              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs flex items-center gap-1">
                <Siren size={10} />
                Emergências 24h
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((d) => (
              <span
                key={d}
                className={`px-3 py-1 rounded text-xs ${profissional.disponibilidade.diasSemana.includes(d) ? "bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30" : "bg-[var(--background-card)] text-[var(--foreground-muted)]"}`}
              >
                {d.substring(0, 3)}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-3">
          Área de Cobertura
        </h3>
        <div className="bg-[var(--background-card)]/30 rounded-lg p-4 flex items-center gap-4">
          <Globe size={24} className="text-[var(--gold)]" />
          <div>
            <div className="text-2xl font-bold text-[var(--foreground)]">
              {profissional.disponibilidade.raioServico} km
            </div>
            <div className="text-xs text-[var(--foreground-muted)]">
              a partir de {profissional.localizacao}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {profissional.disponibilidade.deslocacaoIncluida && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-2">
            <Truck size={16} className="text-green-400" />
            <span className="text-xs text-green-400">Deslocação incluída</span>
          </div>
        )}
        {profissional.disponibilidade.consultaOnline && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center gap-2">
            <Video size={16} className="text-blue-400" />
            <span className="text-xs text-blue-400">Consulta online</span>
          </div>
        )}
      </div>
      <div className="bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[var(--gold)] mb-2">Contactar</h3>
        <div className="flex gap-2">
          <a
            href={`tel:${profissional.telefone}`}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-[var(--gold)] rounded-lg text-black font-medium hover:bg-[#D4AF6A] transition-colors"
          >
            <Phone size={16} />
            Ligar
          </a>
          <a
            href={`mailto:${profissional.email}`}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-[var(--background-card)] rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
          >
            <Mail size={16} />
            Email
          </a>
        </div>
      </div>
    </div>
  );
}

function TabFormacao({ profissional }: { profissional: Profissional }) {
  return (
    <div className="space-y-4">
      {profissional.formacao && profissional.formacao.length > 0 ? (
        <>
          <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-3">
            Formação Académica
          </h3>
          {profissional.formacao.map((f, i) => (
            <div
              key={i}
              className="bg-[var(--background-card)]/30 rounded-lg p-4 flex items-start gap-3"
            >
              <div className="p-2 bg-[var(--gold)]/20 rounded-lg">
                <GraduationCap size={16} className="text-[var(--gold)]" />
              </div>
              <div>
                <div className="font-medium text-[var(--foreground)] text-sm">{f.titulo}</div>
                <div className="text-xs text-[var(--foreground-secondary)]">{f.instituicao}</div>
                <div className="text-xs text-[var(--foreground-muted)] mt-1">{f.ano}</div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <p className="text-[var(--foreground-muted)] text-sm">
          Informação de formação não disponível
        </p>
      )}
      {profissional.publicacoes && profissional.publicacoes.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-3">
            Publicações
          </h3>
          {profissional.publicacoes.map((p, i) => (
            <div
              key={i}
              className="bg-[var(--background-card)]/30 rounded-lg p-4 flex items-start gap-3"
            >
              <div className="p-2 bg-blue-500/20 rounded-lg">
                {p.tipo === "video" ? (
                  <PlayCircle size={16} className="text-blue-400" />
                ) : (
                  <FileText size={16} className="text-blue-400" />
                )}
              </div>
              <div>
                <div className="font-medium text-[var(--foreground)] text-sm">{p.titulo}</div>
                {p.revista && <div className="text-xs text-[var(--gold)]">{p.revista}</div>}
                <div className="text-xs text-[var(--foreground-muted)]">{p.ano}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {profissional.cursosOferecidos && profissional.cursosOferecidos.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[var(--gold)] mb-3 flex items-center gap-2">
            <BookOpen size={16} />
            Cursos Oferecidos
          </h3>
          {profissional.cursosOferecidos.map((c, i) => (
            <div
              key={i}
              className="bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-lg p-4 mb-2"
            >
              <div className="font-medium text-[var(--foreground)] text-sm">{c.titulo}</div>
              <div className="flex items-center gap-3 mt-2 text-xs text-[var(--foreground-secondary)]">
                <span>{c.duracao}</span>
                <span className="text-[var(--gold)] font-medium">{c.preco}</span>
                {c.proximaData && <span>Próxima: {c.proximaData}</span>}
                {c.vagas && <span>{c.vagas} vagas</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
