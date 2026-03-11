"use client";

import { useState, useMemo } from "react";
import {
  Activity,
  Weight,
  Ruler,
  Minus,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Info,
  Shield,
  Heart,
  Zap,
  Target,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import type { Result } from "@/components/analise-perfil/types";

interface RiderPhysicalTabProps {
  result: Result;
}

type NivelFitness = "sedentario" | "moderado" | "ativo" | "atleta";
type CoreStrength = "fraco" | "moderado" | "forte" | "muito_forte";
type Flexibilidade = "rigido" | "moderado" | "flexivel" | "muito_flexivel";
type Experiencia = "iniciante" | "intermedio" | "avancado" | "profissional";
type FrequenciaEquitacao = "nunca" | "ocasional" | "semanal" | "diario";

interface Warning {
  title: string;
  description: string;
  severity: "critical" | "warning" | "ok";
}

interface PhysicalDimension {
  label: string;
  score: number;
  detail: string;
}

// Reference values — typical Lusitano PSL
const AVG_LUSITANO_WEIGHT_KG = 500;
const AVG_LUSITANO_HEIGHT_CM = 160;
const EQUIPMENT_KG = 5; // saddle + bridle + rider gear

function calcIMC(pesoKg: number, alturaCm: number): number {
  const altM = alturaCm / 100;
  return pesoKg / (altM * altM);
}

export default function RiderPhysicalTab({ result }: RiderPhysicalTabProps) {
  const { language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);

  // Physical measurements
  const [peso, setPeso] = useState(70);
  const [altura, setAltura] = useState(170);
  const [perneira, setPerneira] = useState(80);

  // Fitness dimensions
  const [fitness, setFitness] = useState<NivelFitness>("moderado");
  const [core, setCore] = useState<CoreStrength>("moderado");
  const [flexibilidade, setFlexibilidade] = useState<Flexibilidade>("moderado");

  // Experience
  const [experiencia, setExperiencia] = useState<Experiencia>("intermedio");
  const [frequencia, setFrequencia] = useState<FrequenciaEquitacao>("semanal");

  // Physical limitations (multi-select)
  const [problemas, setProblemas] = useState<string[]>([]);

  // Collapsible plan
  const [showPlan, setShowPlan] = useState(false);

  const toggleProblema = (p: string) => {
    setProblemas((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  // --- Derived calculations ---
  const imc = useMemo(() => calcIMC(peso, altura), [peso, altura]);

  const imcLabel = useMemo(() => {
    if (imc < 18.5) return tr("Abaixo do peso", "Underweight", "Bajo peso");
    if (imc < 25) return tr("Normal", "Normal", "Normal");
    if (imc < 30) return tr("Excesso de peso", "Overweight", "Sobrepeso");
    return tr("Obesidade", "Obesity", "Obesidad");
  }, [imc, tr]);

  const cargaTotal = peso + EQUIPMENT_KG;
  const ratioPercent = Math.round((cargaTotal / AVG_LUSITANO_WEIGHT_KG) * 100);
  const perneiraRatio = perneira / AVG_LUSITANO_HEIGHT_CM;
  const alturaRatio = altura / AVG_LUSITANO_HEIGHT_CM;

  // --- Per-dimension scores (0–100) ---
  const dimensions = useMemo((): PhysicalDimension[] => {
    // 1. Carga
    let cargaScore = 100;
    if (ratioPercent > 25) cargaScore = 15;
    else if (ratioPercent > 20) cargaScore = 45;
    else if (ratioPercent > 17) cargaScore = 72;

    // 2. Proporção física (perneira vs horse height)
    let proporcaoScore = 100;
    if (perneiraRatio < 0.55) proporcaoScore = 35;
    else if (perneiraRatio < 0.65) proporcaoScore = 60;
    else if (perneiraRatio > 0.95) proporcaoScore = 50;
    else if (perneiraRatio > 0.85) proporcaoScore = 75;
    // Altura ratio penalty
    if (alturaRatio > 1.25) proporcaoScore = Math.round(proporcaoScore * 0.75);
    else if (alturaRatio > 1.15) proporcaoScore = Math.round(proporcaoScore * 0.88);

    // 3. Condição física (fitness + core + flexibilidade)
    const fitnessScore = { sedentario: 20, moderado: 55, ativo: 80, atleta: 100 }[fitness];
    const coreScore = { fraco: 20, moderado: 55, forte: 80, muito_forte: 100 }[core];
    const flexScore = { rigido: 30, moderado: 60, flexivel: 85, muito_flexivel: 100 }[flexibilidade];
    const condicaoScore = Math.round((fitnessScore + coreScore + flexScore) / 3);

    // 4. Experiência + frequência
    const expScore = { iniciante: 20, intermedio: 55, avancado: 80, profissional: 100 }[experiencia];
    const freqScore = { nunca: 10, ocasional: 40, semanal: 75, diario: 100 }[frequencia];
    const expTotal = Math.round((expScore + freqScore) / 2);

    // 5. Saúde / limitações
    let saudeScore = 100;
    if (problemas.includes("lombar")) saudeScore -= 30;
    if (problemas.includes("anca")) saudeScore -= 25;
    if (problemas.includes("joelhos")) saudeScore -= 15;
    if (problemas.includes("ombros")) saudeScore -= 10;
    saudeScore = Math.max(15, saudeScore);

    return [
      {
        label: tr("Carga / Peso", "Load / Weight", "Carga / Peso"),
        score: cargaScore,
        detail: `${ratioPercent}% ${tr("do peso do cavalo", "of horse weight", "del peso del caballo")} (${cargaTotal}kg ${tr("total", "total", "total")})`,
      },
      {
        label: tr("Proporção Física", "Physical Proportion", "Proporción Física"),
        score: proporcaoScore,
        detail: tr(
          `Perneira ${perneira}cm / cavalo ${AVG_LUSITANO_HEIGHT_CM}cm — rácio ${perneiraRatio.toFixed(2)}`,
          `Inseam ${perneira}cm / horse ${AVG_LUSITANO_HEIGHT_CM}cm — ratio ${perneiraRatio.toFixed(2)}`,
          `Entrepierna ${perneira}cm / caballo ${AVG_LUSITANO_HEIGHT_CM}cm — ratio ${perneiraRatio.toFixed(2)}`
        ),
      },
      {
        label: tr("Condição Física", "Physical Fitness", "Condición Física"),
        score: condicaoScore,
        detail: tr("Fitness cardiovascular + força de core + flexibilidade", "Cardiovascular fitness + core strength + flexibility", "Fitness cardiovascular + fuerza de core + flexibilidad"),
      },
      {
        label: tr("Experiência Equestre", "Equestrian Experience", "Experiencia Ecuestre"),
        score: expTotal,
        detail: tr("Nível de prática + frequência actual", "Practice level + current frequency", "Nivel de práctica + frecuencia actual"),
      },
      {
        label: tr("Saúde / Limitações", "Health / Limitations", "Salud / Limitaciones"),
        score: saudeScore,
        detail:
          problemas.length === 0
            ? tr("Sem limitações identificadas", "No limitations identified", "Sin limitaciones identificadas")
            : `${problemas.length} ${tr("limitação(ões) activa(s)", "active limitation(s)", "limitación(es) activa(s)")}`,
      },
    ];
  }, [ratioPercent, cargaTotal, perneiraRatio, alturaRatio, perneira, fitness, core, flexibilidade, experiencia, frequencia, problemas, tr]);

  const overallScore = useMemo(
    () => Math.round(dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length),
    [dimensions]
  );

  const scoreLabel = useMemo(() => {
    if (overallScore >= 80) return tr("Excelente", "Excellent", "Excelente");
    if (overallScore >= 65) return tr("Bom", "Good", "Bueno");
    if (overallScore >= 45) return tr("Moderado", "Moderate", "Moderado");
    return tr("Atenção necessária", "Attention needed", "Atención necesaria");
  }, [overallScore, tr]);

  const scoreColor =
    overallScore >= 80 ? "emerald" : overallScore >= 65 ? "blue" : overallScore >= 45 ? "amber" : "red";

  const colorClass = {
    emerald: { bg: "bg-emerald-500", text: "text-emerald-400", border: "border-emerald-500", light: "bg-emerald-500/10" },
    blue: { bg: "bg-blue-500", text: "text-blue-400", border: "border-blue-500", light: "bg-blue-500/10" },
    amber: { bg: "bg-amber-500", text: "text-amber-400", border: "border-amber-500", light: "bg-amber-500/10" },
    red: { bg: "bg-red-500", text: "text-red-400", border: "border-red-500", light: "bg-red-500/10" },
  }[scoreColor];

  // --- Warnings ---
  const warnings = useMemo((): Warning[] => {
    const list: Warning[] = [];

    // Carga excessiva
    if (ratioPercent > 25) {
      list.push({
        title: tr("Carga excessiva para Lusitano de porte médio", "Excessive load for average-build Lusitano", "Carga excesiva para Lusitano de porte medio"),
        description: tr(
          `${cargaTotal}kg total representa ${ratioPercent}% do peso de um Lusitano médio (${AVG_LUSITANO_WEIGHT_KG}kg). A regra dos 20% — amplamente aceite em bem-estar equino — estabelece o máximo de ${Math.round(AVG_LUSITANO_WEIGHT_KG * 0.2)}kg. Considere: (1) Lusitanos de linha Interagro ou Andrade com maior estatura; (2) programa de redução de peso assistido; (3) cavalos de porte superior (165cm+, >550kg).`,
          `${cargaTotal}kg total represents ${ratioPercent}% of an average Lusitano's weight (${AVG_LUSITANO_WEIGHT_KG}kg). The 20% rule — widely accepted in equine welfare — sets the maximum at ${Math.round(AVG_LUSITANO_WEIGHT_KG * 0.2)}kg. Consider: (1) Interagro or Andrade line Lusitanos with greater stature; (2) a supervised weight-reduction programme; (3) larger-framed horses (165cm+, >550kg).`,
          `${cargaTotal}kg total representa ${ratioPercent}% del peso de un Lusitano medio (${AVG_LUSITANO_WEIGHT_KG}kg). La regla del 20% establece el máximo en ${Math.round(AVG_LUSITANO_WEIGHT_KG * 0.2)}kg. Considere: (1) Lusitanos de línea Interagro o Andrade; (2) programa de reducción de peso; (3) caballos de mayor porte (165cm+).`
        ),
        severity: "critical",
      });
    } else if (ratioPercent > 20) {
      list.push({
        title: tr("Carga no limite da regra dos 20%", "Load at the 20% rule threshold", "Carga en el límite de la regla del 20%"),
        description: tr(
          `${cargaTotal}kg (${ratioPercent}%) está no limite máximo recomendado. Prefira Lusitanos com 162–165cm e boa musculatura dorsal. Limite sessões de trabalho intenso a 45 minutos e integre períodos de descanso frequentes.`,
          `${cargaTotal}kg (${ratioPercent}%) is at the recommended maximum threshold. Prefer Lusitanos of 162–165cm with good dorsal musculature. Limit intensive work sessions to 45 minutes and include frequent rest periods.`,
          `${cargaTotal}kg (${ratioPercent}%) está en el límite máximo recomendado. Prefiera Lusitanos de 162–165cm con buena musculatura dorsal. Limite las sesiones de trabajo intenso a 45 minutos.`
        ),
        severity: "warning",
      });
    }

    // IMC elevado
    if (imc >= 30) {
      list.push({
        title: tr("IMC elevado — impacto no bem-estar do cavalo e na qualidade do assento", "High BMI — impact on horse welfare and seat quality", "IMC alto — impacto en el bienestar del caballo y calidad del asiento"),
        description: tr(
          `IMC ${imc.toFixed(1)} (${imcLabel}). Para além da carga física, a massa adicional dificulta a absorção de impacto do trote e o equilíbrio dinâmico. Recomenda-se consulta médica, avaliação nutricional e programa de condicionamento progressivo antes de iniciar equitação regular ou intensiva.`,
          `BMI ${imc.toFixed(1)} (${imcLabel}). Beyond physical load, excess mass impairs trot shock absorption and dynamic balance. A medical consultation, nutritional assessment and progressive conditioning programme are recommended before starting regular or intensive riding.`,
          `IMC ${imc.toFixed(1)} (${imcLabel}). Además de la carga física, la masa adicional dificulta la absorción del trote y el equilibrio dinámico. Se recomienda consulta médica y programa de acondicionamiento progresivo.`
        ),
        severity: "warning",
      });
    }

    // Cavaleiro muito alto
    if (alturaRatio > 1.25) {
      list.push({
        title: tr("Altura muito elevada para Lusitano médio", "Height too tall for average Lusitano", "Altura muy elevada para Lusitano medio"),
        description: tr(
          `Rácio cavaleiro/cavalo de ${alturaRatio.toFixed(2)}. Acima dos 190cm, a maioria dos Lusitanos (155–163cm) parecerá visivelmente desproporcional. Procure especificamente: (1) Lusitanos Interagro com >163cm; (2) linha Coudelaria Nacional com maior estatura; (3) avalie cruzamentos PSL aprovados de maior porte.`,
          `Rider/horse ratio of ${alturaRatio.toFixed(2)}. Above 190cm, most Lusitanos (155–163cm) will appear visibly disproportionate. Look specifically for: (1) Interagro Lusitanos over 163cm; (2) Coudelaria Nacional lines with greater stature; (3) evaluate approved PSL crosses of larger build.`,
          `Ratio jinete/caballo de ${alturaRatio.toFixed(2)}. Por encima de 190cm, la mayoría de los Lusitanos parecerán visiblemente desproporcionados. Busque específicamente Lusitanos de más de 163cm o líneas de mayor estatura.`
        ),
        severity: "warning",
      });
    } else if (alturaRatio > 1.15) {
      list.push({
        title: tr("Cavaleiro alto — preferência por Lusitanos de maior porte", "Tall rider — preference for larger Lusitanos", "Jinete alto — preferencia por Lusitanos de mayor porte"),
        description: tr(
          `Com ${altura}cm, prefira Lusitanos na parte superior da escala (161–165cm). Verifique o comprimento do dorso do cavalo — deve ser proporcional ao comprimento do seu tronco.`,
          `At ${altura}cm, prefer Lusitanos in the upper range (161–165cm). Check the horse's back length — it should be proportional to the length of your torso.`,
          `Con ${altura}cm, prefiera Lusitanos en el rango superior (161–165cm). Verifique la longitud del dorso del caballo.`
        ),
        severity: "warning",
      });
    }

    // Perneira curta
    if (perneiraRatio < 0.62) {
      list.push({
        title: tr("Pernas curtas em relação ao porte do cavalo", "Short legs relative to horse build", "Piernas cortas en relación al porte del caballo"),
        description: tr(
          `Rácio de perneira ${perneiraRatio.toFixed(2)} (${perneira}cm) num cavalo de ${AVG_LUSITANO_HEIGHT_CM}cm. Pode haver dificuldade em envolver o cavalo com as pernas, especialmente em cavalos de costelas largas. Prefira Lusitanos com costelas mais fechadas e barril menos redondo. O selim deve ter flap mais longo.`,
          `Inseam ratio ${perneiraRatio.toFixed(2)} (${perneira}cm) on a ${AVG_LUSITANO_HEIGHT_CM}cm horse. There may be difficulty wrapping the horse with the legs, especially on wide-ribbed horses. Prefer Lusitanos with closer-set ribs and less round barrel. The saddle should have a longer flap.`,
          `Ratio de pierna ${perneiraRatio.toFixed(2)} (${perneira}cm) en caballo de ${AVG_LUSITANO_HEIGHT_CM}cm. Puede haber dificultad en envolver el caballo. Prefiera Lusitanos con costillas más cerradas.`
        ),
        severity: "warning",
      });
    }

    // Lombar + exigência alta
    if (problemas.includes("lombar") && (result.profile === "competidor" || result.profile === "tradicional")) {
      list.push({
        title: tr("Problemas lombares e equitação de alta exigência — risco sério", "Lower back issues and high-demand riding — serious risk", "Problemas lumbares y equitación de alta exigencia — riesgo serio"),
        description: tr(
          "Dressage de competição e equitação de trabalho em trote sentado colocam pressão cíclica intensa na zona lombar. Consulte obrigatoriamente um fisioterapeuta desportivo especializado em equitação antes de retomar ou intensificar treinos. O uso de selim com absorção de impacto e estribos Flex-On é recomendado.",
          "Competition dressage and working equitation in sitting trot place intense cyclical pressure on the lumbar region. Consultation with a sports physiotherapist specialised in equestrian disciplines is mandatory before resuming or intensifying training. Shock-absorbing saddle and Flex-On stirrups are recommended.",
          "La dressage de competición y la equitación de trabajo al trote sentado ejercen presión cíclica intensa en la zona lumbar. Es obligatorio consultar a un fisioterapeuta deportivo especializado antes de reanudar o intensificar entrenamientos."
        ),
        severity: "critical",
      });
    } else if (problemas.includes("lombar")) {
      list.push({
        title: tr("Lombar — adaptações necessárias no equipamento e treino", "Lower back — equipment and training adaptations needed", "Lumbar — adaptaciones en equipo y entrenamiento"),
        description: tr(
          "Use selim com painéis mais macios e maior área de contacto. Estribo com absorção de impacto (Flex-On, Compositi Reflex, Lorenzini). Limite o trote sentado a sessões curtas. Pilates equestre e exercícios de McKenzie são altamente recomendados.",
          "Use a saddle with softer panels and larger contact area. Impact-absorbing stirrups (Flex-On, Compositi Reflex, Lorenzini). Limit sitting trot to short sessions. Equestrian Pilates and McKenzie exercises are highly recommended.",
          "Use una silla con paneles más suaves. Estribos con absorción de impacto (Flex-On, Compositi Reflex). Limite el trote sentado. El Pilates ecuestre y los ejercicios de McKenzie son muy recomendables."
        ),
        severity: "warning",
      });
    }

    if (problemas.includes("anca")) {
      list.push({
        title: tr("Anca / Coxofemoral — impacto directo na simetria do assento", "Hip / Coxofemoral — direct impact on seat symmetry", "Cadera — impacto directo en la simetría del asiento"),
        description: tr(
          "Assimetria na anca transmite tensão ao dorso do cavalo, podendo causar problemas musculares no animal. Trabalhe com fisioterapeuta e instrutor para identificar e corrigir compensações. Exercícios de mobilidade da anca (hip CARs, 90/90 stretch, pigeon pose) são essenciais para cavaleiros.",
          "Hip asymmetry transmits tension to the horse's back, potentially causing muscular issues in the animal. Work with a physiotherapist and instructor to identify and correct compensations. Hip mobility exercises (hip CARs, 90/90 stretch, pigeon pose) are essential for riders.",
          "La asimetría en la cadera transmite tensión al dorso del caballo. Trabaje con fisioterapeuta e instructor. Los ejercicios de movilidad de cadera son esenciales para jinetes."
        ),
        severity: "warning",
      });
    }

    if (problemas.includes("joelhos")) {
      list.push({
        title: tr("Joelhos — atenção ao comprimento e tipo de estribos", "Knees — attention to stirrup length and type", "Rodillas — atención a la longitud y tipo de estribos"),
        description: tr(
          "Problemas nos joelhos são agravados por estribos demasiado curtos (hiperfletir o joelho) ou longos (tensão no ligamento). Considere estribos articulados: Herm Sprenger Dynamic RS, Lorenzini Soft, ou Ophena (magnéticos). Mantenha o calcanhar baixo para absorver impacto.",
          "Knee problems are worsened by stirrups too short (hyperflexing) or too long (ligament strain). Consider jointed stirrups: Herm Sprenger Dynamic RS, Lorenzini Soft, or Ophena (magnetic). Keep heels down to absorb impact.",
          "Los problemas de rodilla se agravan con estribos inadecuados. Considere estribos articulados: Herm Sprenger Dynamic RS, Lorenzini Soft u Ophena. Mantenga el talón bajo para absorber el impacto."
        ),
        severity: "warning",
      });
    }

    if (problemas.includes("ombros")) {
      list.push({
        title: tr("Ombros / Cervical — impacto no contacto com a rédea", "Shoulders / Cervical — impact on rein contact", "Hombros / Cervical — impacto en el contacto con las riendas"),
        description: tr(
          "Tensão nos ombros bloqueia o cotovelo e torna o contacto com a boca do cavalo duro e irregular. Exercícios de mobilidade escapular, rotação cervical e relaxamento do trapézio são prioritários. Evite montar com ombros elevados ou cotovelos afastados do corpo.",
          "Shoulder tension blocks the elbow and makes contact with the horse's mouth hard and irregular. Scapular mobility, cervical rotation and trapezius relaxation exercises are a priority. Avoid riding with raised shoulders or elbows away from the body.",
          "La tensión en los hombros bloquea el codo y hace el contacto con la boca del caballo duro. Los ejercicios de movilidad escapular y relajación del trapecio son prioritarios."
        ),
        severity: "warning",
      });
    }

    // Experiência insuficiente para perfil exigente
    if (experiencia === "iniciante" && (result.profile === "competidor" || result.profile === "tradicional")) {
      list.push({
        title: tr("Experiência insuficiente para o perfil detectado — risco de segurança", "Insufficient experience for detected profile — safety risk", "Experiencia insuficiente para el perfil detectado — riesgo de seguridad"),
        description: tr(
          "O perfil detectado implica Lusitanos de alta formação, muito sensíveis e reactivos. Com menos de 2 anos de prática, a aquisição deste tipo de cavalo representa um risco sério de acidentes. Recomenda-se consolidar 3–5 anos de prática regular com cavalos escoleiros antes de adquirir um PSL de competição.",
          "The detected profile implies highly trained Lusitanos, very sensitive and reactive. With less than 2 years of practice, acquiring this type of horse represents a serious accident risk. Consolidating 3–5 years of regular practice with schoolmaster horses before acquiring a competition PSL is recommended.",
          "El perfil detectado implica Lusitanos de alta formación, muy sensibles. Con menos de 2 años de práctica, adquirir este tipo de caballo representa un riesgo serio de accidentes. Se recomiendan 3–5 años de práctica regular."
        ),
        severity: "critical",
      });
    }

    // Fitness baixo para perfil competição
    if (fitness === "sedentario" && (result.profile === "competidor" || result.profile === "tradicional")) {
      list.push({
        title: tr("Condição física insuficiente para equitação de alta escola", "Physical fitness insufficient for high-school equitation", "Condición física insuficiente para alta escuela"),
        description: tr(
          "Dressage de competição exige core activo, equilíbrio dinâmico fino e resistência cardiovascular. Sem condição física base, o cavaleiro compensa com rigidez, que o cavalo Lusitano (muito sensível) percebe imediatamente. Inicie 3 meses de Pilates + cardio antes de intensificar.",
          "Competition dressage requires active core, fine dynamic balance and cardiovascular endurance. Without base fitness, the rider compensates with stiffness, which the Lusitano (very sensitive) immediately perceives. Start 3 months of Pilates + cardio before intensifying.",
          "La dressage de competición exige core activo, equilibrio dinámico y resistencia cardiovascular. Sin condición física base, el jinete compensa con rigidez. Inicie 3 meses de Pilates + cardio antes de intensificar."
        ),
        severity: "critical",
      });
    }

    // Core fraco
    if (core === "fraco") {
      list.push({
        title: tr("Core insuficiente — estabilidade do assento comprometida", "Weak core — seat stability compromised", "Core insuficiente — estabilidad del asiento comprometida"),
        description: tr(
          "O core é o centro do assento do cavaleiro. Sem core activo, o cavaleiro oscila no dorso do cavalo, transmitindo movimentos parasitas que perturbam o equilíbrio do animal. Pilates equestre específico para cavaleiros é a intervenção mais eficaz.",
          "The core is the centre of the rider's seat. Without an active core, the rider oscillates on the horse's back, transmitting parasitic movements that disturb the animal's balance. Rider-specific equestrian Pilates is the most effective intervention.",
          "El core es el centro del asiento del jinete. Sin core activo, el jinete oscila en el dorso del caballo. El Pilates ecuestre específico para jinetes es la intervención más eficaz."
        ),
        severity: "warning",
      });
    }

    // Flexibilidade rígida
    if (flexibilidade === "rigido") {
      list.push({
        title: tr("Rigidez — absorção de movimento comprometida", "Rigidity — movement absorption compromised", "Rigidez — absorción de movimiento comprometida"),
        description: tr(
          "Cavaleiros rígidos não conseguem absorver o movimento do cavalo através da anca e da lombar. O resultado é um assento duro que bloqueia os movimentos naturais do Lusitano. Alongamento diário das cadeias posterior e adutores (mínimo 20 min/dia) e yoga para cavaleiros são essenciais.",
          "Rigid riders cannot absorb the horse's movement through the hips and lower back. The result is a hard seat that blocks the Lusitano's natural movements. Daily posterior chain and adductor stretching (minimum 20 min/day) and yoga for riders are essential.",
          "Los jinetes rígidos no pueden absorber el movimiento del caballo a través de la cadera y lumbar. El resultado es un asiento duro. El estiramiento diario y el yoga para jinetes son esenciales."
        ),
        severity: "warning",
      });
    }

    if (list.length === 0) {
      list.push({
        title: tr("Perfil físico compatível com os seus objetivos", "Physical profile compatible with your objectives", "Perfil físico compatible con sus objetivos"),
        description: tr(
          `Os seus dados físicos são compatíveis com o tipo de Lusitano recomendado para o perfil ${result.title}. Continue a manter a sua condição física e reveja estes parâmetros periodicamente.`,
          `Your physical data is compatible with the Lusitano type recommended for the ${result.title} profile. Continue maintaining your fitness and periodically review these parameters.`,
          `Sus datos físicos son compatibles con el tipo de Lusitano recomendado para el perfil ${result.title}. Continúe manteniendo su condición física.`
        ),
        severity: "ok",
      });
    }

    return list;
  }, [cargaTotal, ratioPercent, imc, imcLabel, alturaRatio, altura, perneiraRatio, perneira, problemas, fitness, core, flexibilidade, experiencia, result, tr]);

  // --- Training plan ---
  const trainingPlan = useMemo(() => {
    const plan: { area: string; exercises: string[] }[] = [];

    if (fitness === "sedentario" || fitness === "moderado") {
      plan.push({
        area: tr("Condição Cardiovascular", "Cardiovascular Fitness", "Condición Cardiovascular"),
        exercises: [
          tr("Natação 2–3x/semana — ideal para cavaleiros (zero impacto articular, fortalece core e ombros)", "Swimming 2–3x/week — ideal for riders (zero joint impact, strengthens core and shoulders)", "Natación 2–3x/semana — ideal para jinetes (cero impacto articular)"),
          tr("Ciclismo estático 30min/dia (melhora resistência sem impacto nos joelhos)", "Stationary cycling 30min/day (improves endurance without knee impact)", "Ciclismo estático 30min/día (mejora resistencia sin impacto en rodillas)"),
          tr("Caminhada nórdica — activa core e melhora postura", "Nordic walking — activates core and improves posture", "Marcha nórdica — activa el core y mejora la postura"),
        ],
      });
    }

    if (core === "fraco" || core === "moderado") {
      plan.push({
        area: tr("Força de Core (Prioritário para Cavaleiros)", "Core Strength (Priority for Riders)", "Fuerza de Core (Prioritario para Jinetes)"),
        exercises: [
          tr("Pilates equestre — especificamente desenhado para cavaleiros, ideal 2x/semana", "Equestrian Pilates — specifically designed for riders, ideal 2x/week", "Pilates ecuestre — específicamente diseñado para jinetes, ideal 2x/semana"),
          tr("Prancha frontal e lateral: 3×30–45 segundos, 4x/semana", "Front and side plank: 3×30–45 seconds, 4x/week", "Plancha frontal y lateral: 3×30–45 segundos, 4x/semana"),
          tr("Dead bug (anti-extensão) e bird-dog (anti-rotação) — os mais relevantes para equitação", "Dead bug (anti-extension) and bird-dog (anti-rotation) — most relevant for riding", "Dead bug (anti-extensión) y bird-dog (anti-rotación) — los más relevantes para equitación"),
          tr("Pallof press com banda elástica — treino anti-rotação específico", "Pallof press with resistance band — specific anti-rotation training", "Pallof press con banda elástica — entrenamiento anti-rotación específico"),
          tr("TRX row e TRX fallout — instabilidade que simula o movimento do cavalo", "TRX row and TRX fallout — instability simulating horse movement", "TRX row y TRX fallout — inestabilidad que simula el movimiento del caballo"),
        ],
      });
    }

    if (flexibilidade === "rigido" || flexibilidade === "moderado") {
      plan.push({
        area: tr("Flexibilidade — Anca, Lombar e Adutores", "Flexibility — Hip, Lower Back and Adductors", "Flexibilidad — Cadera, Lumbar y Aductores"),
        exercises: [
          tr("Yoga para cavaleiros: 20–30min/dia, foco em anca e cadeia posterior", "Yoga for riders: 20–30min/day, focus on hips and posterior chain", "Yoga para jinetes: 20–30min/día, foco en cadera y cadena posterior"),
          tr("Pigeon pose (3×60seg por lado) — abertura da anca fundamental para o assento", "Pigeon pose (3×60sec per side) — fundamental hip opening for the seat", "Pigeon pose (3×60seg por lado) — apertura de cadera fundamental para el asiento"),
          tr("Low lunge com rotação torácica — abre flexor da anca e melhora rotação do tronco", "Low lunge with thoracic rotation — opens hip flexor and improves trunk rotation", "Low lunge con rotación torácica — abre el flexor de cadera y mejora rotación del tronco"),
          tr("Foam roller: banda iliotibial, isquiotibiais, gémeos — 5min por área", "Foam roller: iliotibial band, hamstrings, calves — 5min per area", "Foam roller: banda iliotibial, isquiotibiales, gemelos — 5min por área"),
          tr("Addutor stretch (borboleta) — essencial para abertura do assento em Lusitanos de barril largo", "Adductor stretch (butterfly) — essential for seat opening on wide-barrelled Lusitanos", "Estiramiento de aductores (mariposa) — esencial para apertura del asiento"),
        ],
      });
    }

    if (problemas.includes("lombar")) {
      plan.push({
        area: tr("Reabilitação Lombar (Consultar Fisioterapeuta)", "Lower Back Rehabilitation (Consult Physiotherapist)", "Rehabilitación Lumbar (Consultar Fisioterapeuta)"),
        exercises: [
          tr("Fisioterapia desportiva especializada em equitação — prioritário antes de qualquer treino", "Sports physiotherapy specialised in equestrian disciplines — priority before any training", "Fisioterapia deportiva especializada en equitación — prioritario antes de cualquier entrenamiento"),
          tr("Série de McKenzie para lombar (extensão progressiva)", "McKenzie series for lower back (progressive extension)", "Serie de McKenzie para lumbar (extensión progresiva)"),
          tr("Pelvic tilts e cat-cow diários — mobilização lombar suave", "Daily pelvic tilts and cat-cow — gentle lumbar mobilisation", "Inclinaciones pélvicas y cat-cow diarios — movilización lumbar suave"),
          tr("Hidroterapia/piscina — alivia pressão intervertebral durante exercício", "Hydrotherapy/pool — relieves intervertebral pressure during exercise", "Hidroterapia/piscina — alivia la presión intervertebral durante el ejercicio"),
          tr("Dead bug (favorece flexão lombar em vez de extensão) — safe para lombar", "Dead bug (promotes lumbar flexion rather than extension) — safe for lower back", "Dead bug (favorece flexión lumbar) — seguro para lumbar"),
        ],
      });
    }

    if (problemas.includes("anca")) {
      plan.push({
        area: tr("Mobilidade da Anca", "Hip Mobility", "Movilidad de Cadera"),
        exercises: [
          tr("Hip CARs (Controlled Articular Rotations) — 10 repetições lentas por lado, diário", "Hip CARs (Controlled Articular Rotations) — 10 slow reps per side, daily", "Hip CARs (Rotaciones articulares controladas) — 10 reps lentas por lado, diario"),
          tr("90/90 hip stretch — 2×90seg por lado", "90/90 hip stretch — 2×90sec per side", "90/90 hip stretch — 2×90seg por lado"),
          tr("Clamshell com banda elástica — fortalece abdutores para simetria do assento", "Clamshell with resistance band — strengthens abductors for seat symmetry", "Clamshell con banda elástica — fortalece abductores para simetría del asiento"),
        ],
      });
    }

    if (plan.length === 0) {
      plan.push({
        area: tr("Manutenção e Optimização", "Maintenance and Optimisation", "Mantenimiento y Optimización"),
        exercises: [
          tr("Pilates equestre 1–2x/semana — manutenção de core específico para equitação", "Equestrian Pilates 1–2x/week — maintenance of equestrian-specific core", "Pilates ecuestre 1–2x/semana — mantenimiento de core específico"),
          tr("Yoga 2x/semana — mobilidade e equilíbrio", "Yoga 2x/week — mobility and balance", "Yoga 2x/semana — movilidad y equilibrio"),
          tr("Treino de força funcional 1x/semana — manutenção geral", "Functional strength training 1x/week — general maintenance", "Entrenamiento de fuerza funcional 1x/semana — mantenimiento general"),
          tr("Mobilidade articular matinal 10min — previne rigidez cumulativa", "Morning joint mobility 10min — prevents cumulative stiffness", "Movilidad articular matutina 10min — previene rigidez acumulativa"),
        ],
      });
    }

    return plan;
  }, [fitness, core, flexibilidade, problemas, tr]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <Activity className="text-emerald-400" size={22} />
        </div>
        <div>
          <h2 className="text-xl font-serif text-[var(--foreground)] mb-1">
            {tr("Perfil Físico do Cavaleiro", "Rider Physical Profile", "Perfil Físico del Jinete")}
          </h2>
          <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
            {tr(
              "Análise completa de compatibilidade física entre cavaleiro e Lusitano. Introduza os seus dados para obter score de compatibilidade, análise de riscos detalhada e plano de preparação física personalizado.",
              "Complete physical compatibility analysis between rider and Lusitano. Enter your data to receive a compatibility score, detailed risk analysis and personalised physical preparation plan.",
              "Análisis completo de compatibilidad física entre jinete y Lusitano. Introduzca sus datos para obtener score de compatibilidad, análisis de riesgos detallado y plan de preparación física personalizado."
            )}
          </p>
        </div>
      </div>

      {/* Context banner */}
      <div className="flex items-start gap-3 px-4 py-3.5 bg-[var(--gold)]/8 border border-[var(--gold)]/20 rounded-xl">
        <Info size={15} className="text-[var(--gold)] shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
          {tr(
            `Perfil detectado: ${result.title}. A análise é personalizada para as exigências físicas específicas deste perfil equestre. Lusitano de referência: ${AVG_LUSITANO_HEIGHT_CM}cm / ${AVG_LUSITANO_WEIGHT_KG}kg.`,
            `Detected profile: ${result.title}. The analysis is personalised for the specific physical demands of this equestrian profile. Reference Lusitano: ${AVG_LUSITANO_HEIGHT_CM}cm / ${AVG_LUSITANO_WEIGHT_KG}kg.`,
            `Perfil detectado: ${result.title}. El análisis está personalizado para las exigencias físicas de este perfil ecuestre. Lusitano de referencia: ${AVG_LUSITANO_HEIGHT_CM}cm / ${AVG_LUSITANO_WEIGHT_KG}kg.`
          )}
        </p>
      </div>

      {/* === FORM === */}
      <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-2xl p-5 sm:p-6 space-y-7">

        {/* Peso + Altura */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Peso */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Weight className="text-emerald-400" size={15} />
              <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-medium">
                {tr("Peso do Cavaleiro", "Rider Weight", "Peso del Jinete")}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPeso((p) => Math.max(40, p - 1))}
                className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--background-card)] flex items-center justify-center hover:border-emerald-500/50 transition-colors">
                <Minus size={14} />
              </button>
              <div className="relative flex-1">
                <input type="number" min={40} max={130} value={peso}
                  onChange={(e) => setPeso(Math.max(40, Math.min(130, Number(e.target.value) || 70)))}
                  className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-center text-lg font-medium focus:border-emerald-500 outline-none transition-colors" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] text-sm pointer-events-none">kg</span>
              </div>
              <button type="button" onClick={() => setPeso((p) => Math.min(130, p + 1))}
                className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--background-card)] flex items-center justify-center hover:border-emerald-500/50 transition-colors">
                <Plus size={14} />
              </button>
            </div>
            <p className="text-[11px] text-[var(--foreground-muted)] mt-1.5">
              {tr("IMC", "BMI", "IMC")}: <span className="font-medium">{imc.toFixed(1)}</span> — {imcLabel}
              {" · "}{tr("Carga total", "Total load", "Carga total")}: <span className={`font-medium ${ratioPercent > 20 ? "text-red-400" : ratioPercent > 17 ? "text-amber-400" : "text-emerald-400"}`}>{cargaTotal}kg ({ratioPercent}%)</span>
            </p>
          </div>

          {/* Altura */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Ruler className="text-emerald-400" size={15} />
              <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-medium">
                {tr("Altura do Cavaleiro", "Rider Height", "Altura del Jinete")}
              </label>
            </div>
            <div className="flex items-center gap-3 mb-1">
              <input type="range" min={140} max={210} value={altura}
                onChange={(e) => setAltura(Number(e.target.value))}
                className="flex-1 accent-emerald-500" />
              <span className="text-lg font-medium tabular-nums w-20 text-right">{altura} cm</span>
            </div>
            <p className="text-[11px] text-[var(--foreground-muted)]">
              {tr("Rácio c/ Lusitano médio", "Ratio vs avg Lusitano", "Ratio con Lusitano medio")}: <span className={`font-medium ${alturaRatio > 1.25 ? "text-red-400" : alturaRatio > 1.15 ? "text-amber-400" : "text-emerald-400"}`}>{alturaRatio.toFixed(2)}</span>
              {" "}({tr("ideal ≤ 1.15", "ideal ≤ 1.15", "ideal ≤ 1.15")})
            </p>
          </div>
        </div>

        {/* Perneira */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Ruler className="text-emerald-400" size={15} />
            <label className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-medium">
              {tr("Comprimento de Perna / Perneira", "Inseam / Inside Leg Length", "Entrepierna")}
            </label>
          </div>
          <p className="text-[11px] text-[var(--foreground-muted)] mb-2 leading-relaxed">
            {tr(
              "Medido do entrepernas ao chão (com sapato plano). Determina a adequação ao porte do cavalo e o comprimento correcto do flap do selim.",
              "Measured from crotch to floor (with flat shoe). Determines fit to horse build and correct saddle flap length.",
              "Medido desde la ingle al suelo (con zapato plano). Determina la adecuación al porte del caballo y la longitud correcta de la solapa de la silla."
            )}
          </p>
          <div className="flex items-center gap-3 mb-1">
            <input type="range" min={60} max={110} value={perneira}
              onChange={(e) => setPerneira(Number(e.target.value))}
              className="flex-1 accent-emerald-500" />
            <span className="text-lg font-medium tabular-nums w-20 text-right">{perneira} cm</span>
          </div>
          <p className="text-[11px] text-[var(--foreground-muted)]">
            {tr("Rácio c/ altura do cavalo", "Ratio vs horse height", "Ratio con altura del caballo")}: <span className={`font-medium ${perneiraRatio < 0.62 ? "text-amber-400" : perneiraRatio > 0.90 ? "text-amber-400" : "text-emerald-400"}`}>{perneiraRatio.toFixed(2)}</span>
            {" "}({tr("ideal: 0.65–0.85", "ideal: 0.65–0.85", "ideal: 0.65–0.85")})
          </p>
        </div>

        {/* Carga total visual */}
        <div className="p-4 bg-[var(--background-card)] border border-[var(--border)] rounded-xl">
          <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-medium mb-2">
            {tr("Carga Total no Cavalo (Regra dos 20%)", "Total Load on Horse (20% Rule)", "Carga Total en el Caballo (Regla del 20%)")}
          </p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-2xl font-bold ${ratioPercent > 20 ? "text-red-400" : ratioPercent > 17 ? "text-amber-400" : "text-emerald-400"}`}>
              {cargaTotal}kg
            </span>
            <span className="text-sm text-[var(--foreground-muted)]">= {ratioPercent}% {tr("do cavalo", "of horse", "del caballo")}</span>
            <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${ratioPercent > 20 ? "bg-red-500/10 text-red-400" : ratioPercent > 17 ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"}`}>
              {ratioPercent > 20 ? tr("Excede limite", "Exceeds limit", "Excede límite") : ratioPercent > 17 ? tr("No limite", "At limit", "En el límite") : tr("OK", "OK", "OK")}
            </span>
          </div>
          <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${ratioPercent > 20 ? "bg-red-500" : ratioPercent > 17 ? "bg-amber-500" : "bg-emerald-500"}`}
              style={{ width: `${Math.min(100, ratioPercent * 4)}%` }}
            />
          </div>
          <p className="text-[10px] text-[var(--foreground-muted)] mt-1.5">
            {tr(
              `Inclui ${EQUIPMENT_KG}kg de equipamento. Lusitano médio: ${AVG_LUSITANO_WEIGHT_KG}kg. Limite seguro: ${Math.round(AVG_LUSITANO_WEIGHT_KG * 0.20)}kg total (20%).`,
              `Includes ${EQUIPMENT_KG}kg of tack. Average Lusitano: ${AVG_LUSITANO_WEIGHT_KG}kg. Safe limit: ${Math.round(AVG_LUSITANO_WEIGHT_KG * 0.20)}kg total (20%).`,
              `Incluye ${EQUIPMENT_KG}kg de equipo. Lusitano medio: ${AVG_LUSITANO_WEIGHT_KG}kg. Límite seguro: ${Math.round(AVG_LUSITANO_WEIGHT_KG * 0.20)}kg total (20%).`
            )}
          </p>
        </div>

        {/* Fitness + Core + Flexibilidade */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Fitness */}
          <div>
            <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5">
              <Heart size={12} className="text-emerald-400" />
              {tr("Condição Cardiovascular", "Cardiovascular Fitness", "Condición Cardiovascular")}
            </p>
            <div className="flex flex-col gap-1.5">
              {([
                { v: "sedentario" as const, l: tr("Sedentário", "Sedentary", "Sedentario"), d: tr("< 1x/semana", "< 1x/week", "< 1x/semana") },
                { v: "moderado" as const, l: tr("Moderado", "Moderate", "Moderado"), d: tr("1–3x/semana", "1–3x/week", "1–3x/semana") },
                { v: "ativo" as const, l: tr("Activo", "Active", "Activo"), d: tr("4–5x/semana", "4–5x/week", "4–5x/semana") },
                { v: "atleta" as const, l: tr("Atleta", "Athlete", "Atleta"), d: tr("Treino diário", "Daily training", "Entrenamiento diario") },
              ]).map((opt) => (
                <button key={opt.v} type="button" onClick={() => setFitness(opt.v)} aria-pressed={fitness === opt.v}
                  className={`flex justify-between items-center px-3 py-2 rounded-lg border text-xs transition-all ${fitness === opt.v ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-[var(--border)] text-[var(--foreground-muted)] hover:border-emerald-500/40"}`}>
                  <span className="font-medium">{opt.l}</span>
                  <span className="text-[10px] opacity-70">{opt.d}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Core */}
          <div>
            <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5">
              <Zap size={12} className="text-emerald-400" />
              {tr("Força de Core", "Core Strength", "Fuerza de Core")}
            </p>
            <div className="flex flex-col gap-1.5">
              {([
                { v: "fraco" as const, l: tr("Fraco", "Weak", "Débil"), d: tr("Sem treino", "No training", "Sin entrenamiento") },
                { v: "moderado" as const, l: tr("Moderado", "Moderate", "Moderado"), d: tr("Treino ocasional", "Occasional", "Ocasional") },
                { v: "forte" as const, l: tr("Forte", "Strong", "Fuerte"), d: tr("Treino regular", "Regular training", "Regular") },
                { v: "muito_forte" as const, l: tr("Muito Forte", "Very Strong", "Muy Fuerte"), d: tr("Pilates/atleta", "Pilates/athlete", "Pilates/atleta") },
              ]).map((opt) => (
                <button key={opt.v} type="button" onClick={() => setCore(opt.v)} aria-pressed={core === opt.v}
                  className={`flex justify-between items-center px-3 py-2 rounded-lg border text-xs transition-all ${core === opt.v ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-[var(--border)] text-[var(--foreground-muted)] hover:border-emerald-500/40"}`}>
                  <span className="font-medium">{opt.l}</span>
                  <span className="text-[10px] opacity-70">{opt.d}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Flexibilidade */}
          <div>
            <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5">
              <Activity size={12} className="text-emerald-400" />
              {tr("Flexibilidade", "Flexibility", "Flexibilidad")}
            </p>
            <div className="flex flex-col gap-1.5">
              {([
                { v: "rigido" as const, l: tr("Rígido", "Rigid", "Rígido"), d: tr("Muito limitado", "Very limited", "Muy limitado") },
                { v: "moderado" as const, l: tr("Moderado", "Moderate", "Moderado"), d: tr("Razoável", "Reasonable", "Razonable") },
                { v: "flexivel" as const, l: tr("Flexível", "Flexible", "Flexible"), d: tr("Boa amplitude", "Good range", "Buena amplitud") },
                { v: "muito_flexivel" as const, l: tr("Muito Flexível", "Very Flexible", "Muy Flexible"), d: tr("Yoga/dança", "Yoga/dance", "Yoga/danza") },
              ]).map((opt) => (
                <button key={opt.v} type="button" onClick={() => setFlexibilidade(opt.v)} aria-pressed={flexibilidade === opt.v}
                  className={`flex justify-between items-center px-3 py-2 rounded-lg border text-xs transition-all ${flexibilidade === opt.v ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-[var(--border)] text-[var(--foreground-muted)] hover:border-emerald-500/40"}`}>
                  <span className="font-medium">{opt.l}</span>
                  <span className="text-[10px] opacity-70">{opt.d}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Experiência + Frequência */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-medium mb-2">
              {tr("Experiência Equestre", "Equestrian Experience", "Experiencia Ecuestre")}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {([
                { v: "iniciante" as const, l: tr("Iniciante", "Beginner", "Principiante"), d: tr("< 2 anos", "< 2 years", "< 2 años") },
                { v: "intermedio" as const, l: tr("Intermédio", "Intermediate", "Intermedio"), d: tr("2–5 anos", "2–5 years", "2–5 años") },
                { v: "avancado" as const, l: tr("Avançado", "Advanced", "Avanzado"), d: tr("5–10 anos", "5–10 years", "5–10 años") },
                { v: "profissional" as const, l: tr("Profissional", "Professional", "Profesional"), d: tr("10+ anos", "10+ years", "10+ años") },
              ]).map((opt) => (
                <button key={opt.v} type="button" onClick={() => setExperiencia(opt.v)} aria-pressed={experiencia === opt.v}
                  className={`flex flex-col gap-0.5 px-3 py-2 rounded-lg border text-xs transition-all ${experiencia === opt.v ? "border-emerald-500 bg-emerald-500/10" : "border-[var(--border)] hover:border-emerald-500/40"}`}>
                  <span className={`font-semibold ${experiencia === opt.v ? "text-emerald-400" : "text-[var(--foreground-secondary)]"}`}>{opt.l}</span>
                  <span className="text-[10px] text-[var(--foreground-muted)]">{opt.d}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-medium mb-2">
              {tr("Frequência de Prática Actual", "Current Practice Frequency", "Frecuencia de Práctica Actual")}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {([
                { v: "nunca" as const, l: tr("Parado", "Not riding", "Parado"), d: tr("Sem equitação", "No riding", "Sin equitación") },
                { v: "ocasional" as const, l: tr("Ocasional", "Occasional", "Ocasional"), d: tr("< 1x/mês", "< 1x/month", "< 1x/mes") },
                { v: "semanal" as const, l: tr("Semanal", "Weekly", "Semanal"), d: tr("1–4x/semana", "1–4x/week", "1–4x/semana") },
                { v: "diario" as const, l: tr("Diário", "Daily", "Diario"), d: tr("5–7x/semana", "5–7x/week", "5–7x/semana") },
              ]).map((opt) => (
                <button key={opt.v} type="button" onClick={() => setFrequencia(opt.v)} aria-pressed={frequencia === opt.v}
                  className={`flex flex-col gap-0.5 px-3 py-2 rounded-lg border text-xs transition-all ${frequencia === opt.v ? "border-emerald-500 bg-emerald-500/10" : "border-[var(--border)] hover:border-emerald-500/40"}`}>
                  <span className={`font-semibold ${frequencia === opt.v ? "text-emerald-400" : "text-[var(--foreground-secondary)]"}`}>{opt.l}</span>
                  <span className="text-[10px] text-[var(--foreground-muted)]">{opt.d}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Limitações físicas */}
        <div>
          <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-medium mb-2">
            {tr("Limitações / Problemas Físicos", "Physical Limitations / Issues", "Limitaciones / Problemas Físicos")}
            <span className="ml-1 normal-case font-normal opacity-70">({tr("selecção múltipla", "multi-select", "selección múltiple")})</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {([
              { v: "lombar", l: tr("Lombar / Coluna", "Lower Back / Spine", "Lumbar / Columna") },
              { v: "joelhos", l: tr("Joelhos", "Knees", "Rodillas") },
              { v: "anca", l: tr("Anca / Coxofemoral", "Hip / Coxofemoral", "Cadera / Coxofemoral") },
              { v: "ombros", l: tr("Ombros / Cervical", "Shoulders / Cervical", "Hombros / Cervical") },
            ]).map((opt) => {
              const sel = problemas.includes(opt.v);
              return (
                <button key={opt.v} type="button" onClick={() => toggleProblema(opt.v)} aria-pressed={sel}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs transition-all ${sel ? "border-red-500/60 bg-red-500/8 text-red-400" : "border-[var(--border)] text-[var(--foreground-muted)] hover:border-red-500/30"}`}>
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-all ${sel ? "border-red-500 bg-red-500" : "border-[var(--border)]"}`}>
                    {sel && <span className="text-[8px] text-white font-bold">✓</span>}
                  </div>
                  <span className="font-medium leading-tight">{opt.l}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* === SCORE GERAL === */}
      <div className={`rounded-2xl border ${colorClass.border}/30 ${colorClass.light} p-5`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-medium">
              {tr("Score de Compatibilidade Física", "Physical Compatibility Score", "Score de Compatibilidad Física")}
            </p>
            <p className={`text-4xl font-bold mt-1 ${colorClass.text}`}>
              {overallScore}<span className="text-lg font-normal">/100</span>
            </p>
          </div>
          <div className={`px-4 py-2 rounded-xl border ${colorClass.border}/30 bg-[var(--background)]/50`}>
            <span className={`text-sm font-semibold ${colorClass.text}`}>{scoreLabel}</span>
          </div>
        </div>
        <div className="h-2.5 bg-[var(--background)]/60 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${colorClass.bg}`}
            style={{ width: `${overallScore}%` }} />
        </div>
      </div>

      {/* === DIMENSÕES === */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.25em] text-[var(--foreground-muted)] flex items-center gap-2">
          <Target size={13} className="text-[var(--gold)]" />
          {tr("Análise por Dimensão", "Analysis by Dimension", "Análisis por Dimensión")}
        </h3>
        <div className="space-y-2.5">
          {dimensions.map((dim) => {
            const c = dim.score >= 75 ? { bar: "bg-emerald-500", text: "text-emerald-400" } : dim.score >= 50 ? { bar: "bg-amber-500", text: "text-amber-400" } : { bar: "bg-red-500", text: "text-red-400" };
            return (
              <div key={dim.label} className="bg-[var(--background-secondary)]/40 border border-[var(--border)] rounded-xl p-3.5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-xs font-semibold text-[var(--foreground-secondary)]">{dim.label}</p>
                    <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">{dim.detail}</p>
                  </div>
                  <span className={`text-sm font-bold shrink-0 ${c.text}`}>{dim.score}/100</span>
                </div>
                <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${c.bar}`} style={{ width: `${dim.score}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* === ANÁLISE DE RISCOS === */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.25em] text-[var(--foreground-muted)] flex items-center gap-2">
          <Shield size={13} className="text-[var(--gold)]" />
          {tr("Análise de Riscos e Recomendações", "Risk Analysis and Recommendations", "Análisis de Riesgos y Recomendaciones")}
        </h3>
        {warnings.map((w, i) => {
          const isOk = w.severity === "ok";
          const isCritical = w.severity === "critical";
          return (
            <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${isOk ? "bg-emerald-500/8 border-emerald-500/25" : isCritical ? "bg-red-500/8 border-red-500/25" : "bg-amber-500/8 border-amber-500/25"}`}>
              {isOk
                ? <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                : <AlertTriangle size={16} className={`shrink-0 mt-0.5 ${isCritical ? "text-red-400" : "text-amber-400"}`} />}
              <div>
                <p className={`text-sm font-semibold mb-1 ${isOk ? "text-emerald-300" : isCritical ? "text-red-300" : "text-amber-300"}`}>
                  {w.title}
                </p>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">{w.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* === PLANO DE PREPARAÇÃO FÍSICA === */}
      <div className="border border-[var(--border)] rounded-2xl overflow-hidden">
        <button type="button" onClick={() => setShowPlan((p) => !p)}
          className="w-full flex items-center justify-between px-5 py-4 bg-[var(--background-secondary)]/50 hover:bg-[var(--background-secondary)] transition-colors">
          <div className="flex items-center gap-3">
            <TrendingUp size={16} className="text-emerald-400 shrink-0" />
            <div className="text-left">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {tr("Plano de Preparação Física Personalizado", "Personalised Physical Preparation Plan", "Plan de Preparación Física Personalizado")}
              </p>
              <p className="text-[11px] text-[var(--foreground-muted)]">
                {tr("Exercícios específicos recomendados com base no seu perfil actual", "Specific exercises recommended based on your current profile", "Ejercicios específicos recomendados basados en su perfil actual")}
              </p>
            </div>
          </div>
          {showPlan ? <ChevronUp size={16} className="text-[var(--foreground-muted)]" /> : <ChevronDown size={16} className="text-[var(--foreground-muted)]" />}
        </button>
        {showPlan && (
          <div className="p-5 space-y-6 border-t border-[var(--border)]">
            {trainingPlan.map((section, i) => (
              <div key={i}>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">{section.area}</p>
                <ul className="space-y-2">
                  {section.exercises.map((ex, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-xs text-[var(--foreground-muted)] leading-relaxed">
                      <span className="text-emerald-400 mt-0.5 shrink-0 font-bold">→</span>
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nota de rodapé */}
      <div className="flex items-start gap-2.5 p-4 bg-[var(--background-secondary)]/30 border border-[var(--border)] rounded-xl">
        <BookOpen size={13} className="text-[var(--foreground-muted)] shrink-0 mt-0.5" />
        <p className="text-[11px] text-[var(--foreground-muted)]/70 leading-relaxed">
          {tr(
            "Esta análise baseia-se em referências técnicas amplamente aceites na equitação portuguesa e internacional: regra dos 20% do peso do cavalo (Harman, 2004; Clayton, 2013), rácios de proporção física cavaleiro/cavalo, e diretrizes de condicionamento físico específico para cavaleiros (Müller, German National Equestrian Federation). Para avaliação completa, consulte um instrutor equestre certificado pela FEP ou APSL e, em caso de limitações físicas, um fisioterapeuta desportivo especializado.",
            "This analysis is based on widely accepted technical references in Portuguese and international equestrian practice: the 20% horse weight rule (Harman, 2004; Clayton, 2013), rider/horse physical proportion ratios, and equestrian-specific conditioning guidelines (Müller, German National Equestrian Federation). For a complete assessment, consult an FEP or APSL certified equestrian instructor and, in case of physical limitations, a specialist sports physiotherapist.",
            "Este análisis se basa en referencias técnicas ampliamente aceptadas en la equitación portuguesa e internacional: regla del 20% del peso del caballo (Harman, 2004; Clayton, 2013), ratios de proporción física jinete/caballo, y directrices de acondicionamiento físico específico para jinetes. Para evaluación completa, consulte un instructor ecuestre certificado y, en caso de limitaciones físicas, un fisioterapeuta deportivo especializado."
          )}
        </p>
      </div>
    </div>
  );
}
