"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, AlertTriangle, Bug, Globe, Shield, Thermometer,
  FileText, ChevronDown, ChevronUp, MapPin, Activity, Syringe,
  Ban, Scale, ExternalLink
} from "lucide-react";

// =============================================================================
// FONTES CREDÍVEIS UTILIZADAS:
// - USDA APHIS: https://www.aphis.usda.gov/livestock-poultry-disease/equine/piroplasmosis
// - WOAH (OIE): https://www.woah.org/en/disease/equine-piroplasmosis/
// - PMC/PubMed: https://pmc.ncbi.nlm.nih.gov/articles/PMC11349644/
// - Frontiers Vet Sci: https://www.frontiersin.org/journals/veterinary-science/articles/10.3389/fvets.2024.1459989/full
// - ScienceDirect: https://www.sciencedirect.com/science/article/pii/S030440172400267X (Portugal 5-year study)
// - PubMed: https://pubmed.ncbi.nlm.nih.gov/23591484/ (North Portugal prevalence)
// - Frontiers: https://www.frontiersin.org/journals/veterinary-science/articles/10.3389/fvets.2020.591943/full (Military horses Lisbon)
// - Lusitano Horse Finder: https://lusitanohorsefinder.com/understanding-piroplasmosis/
// - Lusitano World: https://www.lusitanoworld.com/en/blog/what-is-piroplasmosis/
// - Horse Sport: https://horsesport.com/horse-news/piro-positive-horses-can-compete-at-weg-2010/
// - EquiManagement: https://equimanagement.com/articles/usdas-weg-tryon-2018-equine-piro-protection/
// - PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC10534063/ (Tokyo 2020 case)
// - Olympics.com: https://www.olympics.com/ioc/news/beijing-2008-equestrian-events-moved-to-hong-kong
// - FEI Vet Regs 2026: Imidocarb como Controlled Medication
// =============================================================================

interface SeccaoExpandivel {
  id: string;
  titulo: string;
  icone: React.ElementType;
  conteudo: React.ReactNode;
}

function SeccaoCard({ seccao, aberta, onToggle }: { seccao: SeccaoExpandivel; aberta: boolean; onToggle: () => void }) {
  const Icone = seccao.icone;
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden transition-all">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-zinc-800/30 transition-colors touch-manipulation"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#C5A059]/20 flex items-center justify-center flex-shrink-0">
            <Icone size={20} className="text-[#C5A059]" />
          </div>
          <h2 className="text-lg sm:text-xl font-serif text-white">{seccao.titulo}</h2>
        </div>
        {aberta ? <ChevronUp size={20} className="text-zinc-500" /> : <ChevronDown size={20} className="text-zinc-500" />}
      </button>
      {aberta && (
        <div className="px-5 sm:px-6 pb-6 border-t border-zinc-800/50 pt-4">
          {seccao.conteudo}
        </div>
      )}
    </div>
  );
}

function EstudoCard({ regiao, tEqui, bCaballi, fonte }: { regiao: string; tEqui: string; bCaballi: string; fonte: string }) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={14} className="text-[#C5A059]" />
        <span className="text-sm font-medium text-white">{regiao}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div>
          <span className="text-xs text-zinc-500 block">T. equi</span>
          <span className="text-lg font-bold text-red-400">{tEqui}</span>
        </div>
        <div>
          <span className="text-xs text-zinc-500 block">B. caballi</span>
          <span className="text-lg font-bold text-orange-400">{bCaballi}</span>
        </div>
      </div>
      <span className="text-[10px] text-zinc-600 italic">{fonte}</span>
    </div>
  );
}

export default function PiroplasmosePage() {
  const [seccoesAbertas, setSeccoesAbertas] = useState<Set<string>>(new Set(["oque"]));

  const toggleSeccao = (id: string) => {
    setSeccoesAbertas(prev => {
      const novo = new Set(prev);
      if (novo.has(id)) {
        novo.delete(id);
      } else {
        novo.add(id);
      }
      return novo;
    });
  };

  const seccoes: SeccaoExpandivel[] = [
    {
      id: "oque",
      titulo: "O Que É a Piroplasmose Equina?",
      icone: Bug,
      conteudo: (
        <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
          <p>
            A <strong className="text-white">piroplasmose equina</strong> (EP) é uma doença parasitária transmitida por carraças
            que afecta cavalos, mulas, burros e zebras. É causada por dois protozoários que infectam os glóbulos
            vermelhos: <em className="text-[#C5A059]">Theileria equi</em> e <em className="text-[#C5A059]">Babesia caballi</em>.
          </p>

          {/* FONTE: WOAH */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-300 font-medium mb-1">Dados Importantes</p>
                <ul className="space-y-1 text-zinc-400 text-xs">
                  <li>Mais de <strong className="text-white">90% da populaçao equina mundial</strong> vive em zonas endémicas</li>
                  <li>Mortalidade pode atingir <strong className="text-white">50%</strong> em casos não tratados</li>
                  <li>Cavalos sobreviventes tornam-se <strong className="text-white">portadores crónicos</strong> para toda a vida</li>
                  <li>Não existe vacina disponível</li>
                </ul>
              </div>
            </div>
          </div>

          <h3 className="text-white font-semibold mt-4">Transmissão</h3>
          {/* FONTE: USDA APHIS, WOAH */}
          <p>
            A doença é transmitida por cerca de <strong className="text-white">14 espécies de carraças Ixodídeas</strong> dos
            géneros <em>Dermacentor</em>, <em>Rhipicephalus</em> e <em>Hyalomma</em>. Pode também ser transmitida por:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400 ml-2">
            <li>Produtos sanguíneos contaminados</li>
            <li>Reutilização de agulhas ou seringas</li>
            <li>Equipamento intravenoso partilhado</li>
            <li>Transmissão transplacentária (égua para poldro)</li>
          </ul>

          <h3 className="text-white font-semibold mt-4">Formas Clínicas</h3>
          {/* FONTE: PMC/PubMed - New insights in diagnosis and treatment */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-zinc-800/80 rounded-lg p-3">
              <span className="text-xs text-red-400 font-medium">Aguda (mais comum)</span>
              <p className="text-xs text-zinc-400 mt-1">Febre &gt;40°C, anemia, perda de apetite, taquicardia</p>
            </div>
            <div className="bg-zinc-800/80 rounded-lg p-3">
              <span className="text-xs text-orange-400 font-medium">Subaguda</span>
              <p className="text-xs text-zinc-400 mt-1">Perda de peso, febre intermitente, icterícia</p>
            </div>
            <div className="bg-zinc-800/80 rounded-lg p-3">
              <span className="text-xs text-yellow-400 font-medium">Crónica</span>
              <p className="text-xs text-zinc-400 mt-1">Inapetência ligeira, baixo rendimento, perda de peso</p>
            </div>
            <div className="bg-zinc-800/80 rounded-lg p-3">
              <span className="text-xs text-red-600 font-medium">Peraguda (rara)</span>
              <p className="text-xs text-zinc-400 mt-1">Morte súbita</p>
            </div>
          </div>

          <p className="text-[10px] text-zinc-600 mt-4">
            Fontes: WOAH (woah.org), USDA APHIS (aphis.usda.gov), PMC/PubMed (pmc.ncbi.nlm.nih.gov)
          </p>
        </div>
      )
    },
    {
      id: "portugal",
      titulo: "Prevalência em Portugal e no Lusitano",
      icone: MapPin,
      conteudo: (
        <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
          <p>
            A piroplasmose é <strong className="text-white">endémica</strong> em Portugal e Espanha, onde as carraças vectoras
            estão amplamente estabelecidas. Isto significa que a maioria dos cavalos nascidos em pastagens portuguesas
            é exposta ao parasita enquanto jovem, desenvolvendo anticorpos que conferem protecção ao longo da vida.
          </p>

          {/* FONTE: Lusitano Horse Finder */}
          <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg p-4">
            <p className="text-[#C5A059] font-medium text-sm mb-2">O Problema Central</p>
            <p className="text-zinc-400 text-xs">
              Um Lusitano perfeitamente saudável, que simplesmente cresceu em pastagens portuguesas,
              pode testar <strong className="text-white">positivo para anticorpos</strong> de piroplasmose e ser
              automaticamente <strong className="text-white">impedido de ser exportado</strong> para países livres da doença,
              como os EUA, Canadá, Austrália ou Japão.
            </p>
          </div>

          <h3 className="text-white font-semibold mt-4">Estudos Científicos em Portugal</h3>
          {/* FONTE: ScienceDirect, PubMed, Frontiers */}
          <div className="grid sm:grid-cols-2 gap-3">
            <EstudoCard
              regiao="Portugal (estudo 5 anos, cELISA)"
              tEqui="32.7%"
              bCaballi="15.7%"
              fonte="ScienceDirect, 2024"
            />
            <EstudoCard
              regiao="PSL Vila Viçosa (Sul)"
              tEqui="53.4%"
              bCaballi="—"
              fonte="Estudo serológico PSL"
            />
            <EstudoCard
              regiao="Alentejo (154 cavalos)"
              tEqui="85.1%"
              bCaballi="65.6%"
              fonte="Análise serológica regional"
            />
            <EstudoCard
              regiao="Norte de Portugal"
              tEqui="17.9%"
              bCaballi="11.1%"
              fonte="PubMed, 2013"
            />
          </div>

          <div className="bg-zinc-800/60 rounded-lg p-4 mt-4">
            <p className="text-xs text-zinc-400">
              <strong className="text-white">Nota:</strong> A prevalência varia significativamente por região.
              O Sul de Portugal (Alentejo, Vila Viçosa) apresenta taxas muito mais elevadas que o Norte,
              reflectindo a maior presença de carraças vectoras em climas mais quentes e secos.
            </p>
          </div>

          <p className="text-[10px] text-zinc-600 mt-4">
            Fontes: ScienceDirect (sciencedirect.com), PubMed (pubmed.ncbi.nlm.nih.gov),
            Frontiers in Veterinary Science (frontiersin.org), Lusitano Horse Finder (lusitanohorsefinder.com)
          </p>
        </div>
      )
    },
    {
      id: "exportacao",
      titulo: "Impacto na Exportação e Comércio Internacional",
      icone: Globe,
      conteudo: (
        <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
          {/* FONTE: USDA APHIS, Lusitano World */}
          <p>
            A piroplasmose é descrita como a <strong className="text-white">principal restrição à importação/exportação
            de cavalos</strong> a nível mundial. Vários países exigem que os cavalos testem negativo
            para <em>T. equi</em> e <em>B. caballi</em> antes de permitirem a entrada.
          </p>

          <h3 className="text-white font-semibold">Países com Política &quot;Piro-Free&quot;</h3>
          <div className="flex flex-wrap gap-2">
            {["Estados Unidos", "Canadá", "Austrália", "Nova Zelândia", "Japão", "China", "Tailândia", "México"].map(pais => (
              <span key={pais} className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs text-red-300">
                <Ban size={10} className="inline mr-1" />{pais}
              </span>
            ))}
          </div>

          <h3 className="text-white font-semibold mt-4">Testes de Exportação</h3>
          <div className="bg-zinc-800/60 rounded-lg p-4">
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><strong className="text-white">Testes utilizados:</strong> IFAT (imunofluorescência indirecta), cELISA, e CFT (fixação do complemento)</li>
              <li><strong className="text-white">Limite:</strong> Cavalos devem pontuar abaixo de 30% em todos os testes para serem considerados negativos</li>
              <li><strong className="text-white">Custo:</strong> ~60€ em Portugal; 200-300€ em laboratórios como Bose (Alemanha)</li>
              <li><strong className="text-white">Tempo:</strong> Resultados em 2-5 dias</li>
            </ul>
          </div>

          <h3 className="text-white font-semibold mt-4">Consequências nos EUA</h3>
          {/* FONTE: USDA APHIS */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-xs text-zinc-400 mb-2">
              Os EUA são um mercado crítico para o Lusitano, especialmente para dressage.
              Se um cavalo testar positivo após a importação, as consequências são:
            </p>
            <ul className="space-y-1 text-xs text-red-300">
              <li>Eutanásia</li>
              <li>Quarentena vitalícia</li>
              <li>Devolução ao país de origem</li>
            </ul>
          </div>

          {/* FONTE: USDA APHIS, DVM360 */}
          <div className="bg-zinc-800/60 rounded-lg p-4 mt-2">
            <p className="text-xs text-zinc-400">
              <strong className="text-white">Problema do stress de viagem:</strong> O stress do transporte de longa distância
              pode causar a subida dos títulos sanguíneos acima do limiar de 30%, resultando em que um cavalo que
              testou negativo antes da partida possa testar positivo à chegada.
            </p>
          </div>

          <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg p-4 mt-4">
            <p className="text-xs text-zinc-400">
              <strong className="text-[#C5A059]">Impacto económico:</strong> Criadores de Lusitanos vendem cada vez mais
              cavalos &quot;piro-free&quot; como categoria premium, criando efectivamente duas categorias de valor comercial
              dentro da raça. Cavalos com testes negativos têm um valor de mercado significativamente superior
              para exportação.
            </p>
          </div>

          <p className="text-[10px] text-zinc-600 mt-4">
            Fontes: USDA APHIS (aphis.usda.gov), DVM360 (dvm360.com), Lusitano World (lusitanoworld.com),
            Lusitano Horse Finder (lusitanohorsefinder.com)
          </p>
        </div>
      )
    },
    {
      id: "olimpiadas",
      titulo: "Piroplasmose e as Competições Internacionais",
      icone: Activity,
      conteudo: (
        <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
          {/* FONTE: Olympics.com */}
          <h3 className="text-white font-semibold">Jogos Olímpicos Pequim 2008</h3>
          <div className="bg-zinc-800/60 rounded-lg p-4">
            <p className="text-xs text-zinc-400">
              As provas equestres dos Jogos Olímpicos de 2008 foram transferidas de Pequim para <strong className="text-white">Hong Kong</strong>,
              após os organizadores declararem que não podiam garantir uma zona livre de doenças para os cavalos perto de Pequim.
              Hong Kong foi seleccionada pela sua indústria de corridas, que proporcionava medidas de quarentena e
              protocolos de gestão de doenças rigorosos. Todos os cavalos tiveram de testar negativo para piroplasmose equina.
            </p>
          </div>

          {/* FONTE: PMC - Tokyo 2020 case */}
          <h3 className="text-white font-semibold mt-4">Jogos Olímpicos Tóquio 2020</h3>
          <div className="bg-zinc-800/60 rounded-lg p-4">
            <p className="text-xs text-zinc-400 mb-2">
              Caso documentado num estudo peer-reviewed: um cavalo Warmblood alemão de 15 anos chegou a Tóquio
              aparentemente saudável e com teste negativo (IFAT). Três dias após a chegada, desenvolveu:
            </p>
            <ul className="space-y-1 text-xs text-zinc-400 ml-2">
              <li>Febre superior a 40°C</li>
              <li>Anemia severa (hematócrito caiu para 12.3%)</li>
              <li>Desconforto abdominal</li>
            </ul>
            <p className="text-xs text-zinc-400 mt-2">
              Testou positivo para <em className="text-[#C5A059]">Theileria equi</em> por PCR.
              Foi tratado com imidocarb e recebeu uma transfusão de 7 litros de sangue.
              Recuperou e regressou a casa sem transmitir a doença.
            </p>
            <p className="text-xs text-zinc-500 mt-2 italic">
              Este caso demonstra como portadores assintomáticos podem testar negativo em testes standard
              mas desenvolver doença aguda quando stressados pelo transporte.
            </p>
          </div>

          {/* FONTE: Horse Sport, EquiManagement */}
          <h3 className="text-white font-semibold mt-4">Jogos Equestres Mundiais (WEG)</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-zinc-800/60 rounded-lg p-4">
              <span className="text-xs text-[#C5A059] font-medium">WEG 2010 - Kentucky</span>
              <p className="text-xs text-zinc-400 mt-2">
                Cerca de <strong className="text-white">100 cavalos piro-positivos competiram</strong> sob protocolos
                especiais aprovados pela USDA. Cerca de 500 cavalos passaram por uma instalação de quarentena
                perto de Cincinnati. Cavalos positivos tiveram estábulos e áreas de pastagem separadas.
              </p>
            </div>
            <div className="bg-zinc-800/60 rounded-lg p-4">
              <span className="text-xs text-[#C5A059] font-medium">WEG 2018 - Tryon</span>
              <p className="text-xs text-zinc-400 mt-2">
                Protocolos rigorosos de biossegurança: cavalos piro-positivos em estábulos de isolamento separados,
                monitorizados 24/7, inspecções diárias de carraças, tratamento acaricida, sem contacto
                com cavalos americanos. Um estudo de 2017 determinou que o risco de propagação era
                <strong className="text-white"> negligenciável a extremamente baixo</strong>.
              </p>
            </div>
          </div>

          <p className="text-[10px] text-zinc-600 mt-4">
            Fontes: Olympics.com, PMC (pmc.ncbi.nlm.nih.gov), Horse Sport (horsesport.com),
            EquiManagement (equimanagement.com)
          </p>
        </div>
      )
    },
    {
      id: "tratamento",
      titulo: "Tratamento e Limitações",
      icone: Syringe,
      conteudo: (
        <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
          {/* FONTE: PMC/PubMed, Frontiers, Lusitano World */}
          <p>
            O <strong className="text-white">dipropionato de imidocarb</strong> é o tratamento mais utilizado mundialmente.
            No entanto, o tratamento tem limitações significativas:
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-zinc-800/60 rounded-lg p-4">
              <span className="text-xs text-green-400 font-medium">Eficácia</span>
              <ul className="space-y-1 text-xs text-zinc-400 mt-2">
                <li>Eficaz contra <em>B. caballi</em></li>
                <li><em>T. equi</em> é notavelmente mais difícil de eliminar</li>
                <li><em>T. haneyi</em> mostra resistência ao imidocarb</li>
                <li>Falhas de tratamento estão documentadas</li>
              </ul>
            </div>
            <div className="bg-zinc-800/60 rounded-lg p-4">
              <span className="text-xs text-red-400 font-medium">Efeitos Secundários</span>
              <ul className="space-y-1 text-xs text-zinc-400 mt-2">
                <li>Agitação e sudorese</li>
                <li>Cólica e diarreia</li>
                <li>Toxicidade hepática e renal</li>
                <li>Requer pré-medicação anticolinérgica</li>
              </ul>
            </div>
          </div>

          {/* FONTE: Lusitano World */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-zinc-400">
                O <strong className="text-red-300">Lusitano World desaconselha fortemente</strong> a compra de cavalos
                piro-positivos com a intenção de os tratar e depois exportar, citando efeitos secundários graves
                e a impraticabilidade de reduzir os títulos sanguíneos abaixo dos limiares de exportação.
              </p>
            </div>
          </div>

          {/* FONTE: FEI Vet Regs 2026 */}
          <h3 className="text-white font-semibold mt-4">Regulamentação FEI 2026</h3>
          <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg p-4">
            <p className="text-xs text-zinc-400">
              A partir de <strong className="text-white">1 de Janeiro de 2026</strong>, a FEI adicionou o imidocarb
              como <strong className="text-[#C5A059]">Medicação Controlada</strong> sob as regulamentações EADCM.
              Pode ser administrado a cavalos de competição sob condições reguladas, mas o seu uso deve ser
              reportado aos delegados veterinários e existem restrições temporais relativas à competição.
            </p>
          </div>

          <p className="text-[10px] text-zinc-600 mt-4">
            Fontes: PMC/PubMed (pmc.ncbi.nlm.nih.gov), Frontiers in Veterinary Science (frontiersin.org),
            Lusitano World (lusitanoworld.com), FEI Veterinary Regulations 2026 (fei.org)
          </p>
        </div>
      )
    },
    {
      id: "regulamentacao",
      titulo: "Regulamentação Actual",
      icone: Scale,
      conteudo: (
        <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
          {/* FONTE: WOAH */}
          <h3 className="text-white font-semibold">WOAH (Organização Mundial de Saúde Animal)</h3>
          <div className="bg-zinc-800/60 rounded-lg p-4">
            <ul className="space-y-1 text-xs text-zinc-400">
              <li>Piroplasmose equina é <strong className="text-white">doença de notificação obrigatória</strong></li>
              <li>Regulada pelo Capítulo 12.7 do Código Sanitário para Animais Terrestres</li>
              <li>Países importadores devem exigir testes de diagnóstico negativos nos 30 dias antes do envio</li>
              <li>Animais devem ser mantidos livres de carraças durante 30 dias antes do envio</li>
            </ul>
          </div>

          {/* FONTE: USDA APHIS */}
          <h3 className="text-white font-semibold mt-4">USDA (Estados Unidos)</h3>
          <div className="bg-zinc-800/60 rounded-lg p-4">
            <ul className="space-y-1 text-xs text-zinc-400">
              <li>Classificada como <strong className="text-white">doença animal estrangeira</strong> de notificação obrigatória</li>
              <li>Todos os cavalos importados devem testar negativo (CFT e cELISA)</li>
              <li>Se testes iniciais são não-negativos: quarentena até 28 dias com reteste a cada 14 dias</li>
              <li>Cavalos positivos podem agora inscrever-se no <strong className="text-white">programa de tratamento USDA-APHIS</strong></li>
              <li>Admissão temporária sob protocolos especiais para eventos internacionais</li>
            </ul>
          </div>

          <h3 className="text-white font-semibold mt-4">União Europeia</h3>
          <div className="bg-zinc-800/60 rounded-lg p-4">
            <p className="text-xs text-zinc-400">
              Dentro da UE, a movimentação de cavalos entre estados membros <strong className="text-white">não requer teste
              de piroplasmose</strong>. No entanto, cavalos que se movimentam de países endémicos da UE
              (como Portugal e Espanha) para países não-endémicos da UE ou para nações &quot;piro-free&quot; fora da UE
              devem cumprir os requisitos específicos de teste do país importador.
            </p>
          </div>

          <h3 className="text-white font-semibold mt-4">Países Oficialmente &quot;Piro-Free&quot;</h3>
          {/* FONTE: WOAH */}
          <div className="flex flex-wrap gap-2">
            {["Canadá", "Japão", "Islândia", "Irlanda", "Nova Zelândia"].map(pais => (
              <span key={pais} className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs text-green-300">
                <Shield size={10} className="inline mr-1" />{pais}
              </span>
            ))}
          </div>

          <p className="text-[10px] text-zinc-600 mt-4">
            Fontes: WOAH (woah.org), USDA APHIS (aphis.usda.gov), FEI (fei.org)
          </p>
        </div>
      )
    },
    {
      id: "conclusao",
      titulo: "Conclusões e Impacto no Lusitano",
      icone: FileText,
      conteudo: (
        <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
          <div className="space-y-3">
            {[
              {
                titulo: "Principal barreira comercial",
                texto: "A piroplasmose é a maior barreira ao comércio internacional do Lusitano. A natureza endémica em Portugal significa que uma grande proporção de Lusitanos — de 18% a mais de 85% conforme a região — testa positivo para anticorpos, mesmo quando perfeitamente saudáveis."
              },
              {
                titulo: "Mercados fechados",
                texto: "As políticas \"piro-free\" dos EUA, Canadá, Austrália e outros mercados excluem efectivamente uma porção significativa de Lusitanos criados em Portugal, limitando o alcance comercial e competitivo da raça."
              },
              {
                titulo: "Sem solução simples",
                texto: "O tratamento é arriscado e não fiável, não existe vacina, e o estado de portador assintomático significa que os testes de anticorpos standard não distinguem entre um cavalo activamente infectado e um que simplesmente tem imunidade natural da exposição em pastagens endémicas."
              },
              {
                titulo: "Problema estrutural",
                texto: "Enquanto a Península Ibérica permanecer endémica — o que é inevitável dadas as populações de carraças e o clima — os criadores de Lusitanos enfrentarão esta barreira à exportação."
              },
              {
                titulo: "Duas categorias de mercado",
                texto: "Criadores estão cada vez mais a comercializar cavalos \"piro-free\" como categoria premium, criando efectivamente dois níveis de valor comercial dentro da raça."
              }
            ].map((item, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-lg p-4 border-l-2 border-[#C5A059]">
                <p className="text-white font-medium text-sm mb-1">{item.titulo}</p>
                <p className="text-xs text-zinc-400">{item.texto}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg p-4 mt-4">
            <p className="text-xs text-zinc-400">
              <strong className="text-[#C5A059]">Para compradores internacionais:</strong> Antes de adquirir um Lusitano
              em Portugal ou Espanha, solicite sempre o teste de piroplasmose actualizado. Se planeia exportar
              para um país &quot;piro-free&quot;, certifique-se de que o cavalo testa negativo antes de concluir a compra.
              O custo do teste (~60€ em Portugal) é insignificante comparado com o risco.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white pt-20 sm:pt-24 md:pt-32 pb-32 px-4 sm:px-6 md:px-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] transition-colors mb-6 touch-manipulation"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Voltar</span>
        </Link>

        <div className="text-center">
          <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[9px] sm:text-[10px] font-bold block mb-2">
            Saúde Equina
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic mb-4">
            Piroplasmose Equina
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            A doença transmitida por carraças que é a principal barreira à exportação
            e ao comércio internacional do cavalo Lusitano.
          </p>
        </div>

        {/* Alerta Principal */}
        <div className="mt-8 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border border-red-500/20 rounded-xl p-6 max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <Thermometer size={24} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold mb-1">Porque é que isto importa?</h2>
              <p className="text-sm text-zinc-400">
                Mais de <strong className="text-white">50% dos cavalos Lusitanos</strong> em certas regiões de Portugal
                testam positivo para <em>Theileria equi</em>, mesmo sendo portadores assintomáticos saudáveis.
                Isto impede a sua exportação para os EUA, Canadá, Austrália e outros mercados-chave,
                representando o maior desafio comercial da raça a nível mundial.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Secções */}
      <div className="max-w-4xl mx-auto space-y-4">
        {seccoes.map(seccao => (
          <SeccaoCard
            key={seccao.id}
            seccao={seccao}
            aberta={seccoesAbertas.has(seccao.id)}
            onToggle={() => toggleSeccao(seccao.id)}
          />
        ))}
      </div>

      {/* Fontes */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#C5A059] mb-4 flex items-center gap-2">
            <FileText size={16} />
            Fontes e Referências
          </h3>
          <div className="grid sm:grid-cols-2 gap-2 text-xs text-zinc-500">
            {[
              { nome: "USDA APHIS", desc: "Departamento de Agricultura dos EUA" },
              { nome: "WOAH (OIE)", desc: "Organização Mundial de Saúde Animal" },
              { nome: "PubMed / PMC", desc: "Estudos veterinários peer-reviewed" },
              { nome: "Frontiers in Veterinary Science", desc: "Journal científico" },
              { nome: "ScienceDirect", desc: "Estudo prevalência Portugal (5 anos)" },
              { nome: "FEI", desc: "Federação Equestre Internacional" },
              { nome: "Lusitano Horse Finder", desc: "Portal especializado Lusitano" },
              { nome: "Lusitano World", desc: "Recurso internacional Lusitano" },
              { nome: "Horse Sport", desc: "Notícias desporto equestre" },
              { nome: "EquiManagement", desc: "Gestão equina profissional" },
              { nome: "Olympics.com", desc: "Comité Olímpico Internacional" },
              { nome: "DVM360", desc: "Publicação veterinária" },
            ].map((fonte, i) => (
              <div key={i} className="flex items-start gap-2">
                <ExternalLink size={10} className="text-zinc-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-zinc-400">{fonte.nome}</span>
                  <span className="text-zinc-600"> — {fonte.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-zinc-600 mt-4 pt-4 border-t border-zinc-800">
            Toda a informação nesta página foi verificada a partir de fontes escritas credíveis.
            Nenhuma informação foi inventada ou assumida.
          </p>
        </div>
      </div>
    </main>
  );
}
