import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

// Mock AI responses - Replace with real OpenAI/Anthropic API calls
// To use real AI: npm install openai
// import OpenAI from "openai";
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface AIRequest {
  task: "generate_description" | "suggest_subject" | "analyze_sentiment" | "best_time" | "improve_text";
  input: {
    type?: string;
    name?: string;
    features?: string[];
    text?: string;
    reviews?: any[];
  };
}

export async function POST(request: NextRequest) {
  const email = await verifySession();
  if (!email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body: AIRequest = await request.json();
    const { task, input } = body;

    let result: any = {};

    switch (task) {
      case "generate_description":
        result = await generateDescription(input);
        break;

      case "suggest_subject":
        result = await suggestEmailSubject(input);
        break;

      case "analyze_sentiment":
        result = await analyzeSentiment(input);
        break;

      case "best_time":
        result = await suggestBestTime(input);
        break;

      case "improve_text":
        result = await improveText(input);
        break;

      default:
        return NextResponse.json({ error: "Task desconhecida" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao processar pedido de IA" },
      { status: 500 }
    );
  }
}

// ========================================
// AI FUNCTIONS (Mock - Replace with real AI)
// ========================================

async function generateDescription(input: any) {
  // Mock - In production, use OpenAI:
  /*
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "És um especialista em cavalos Lusitanos. Cria descrições eloquentes e profissionais."
      },
      {
        role: "user",
        content: `Cria uma descrição para um cavalo Lusitano chamado ${input.name} com as seguintes características: ${input.features?.join(", ")}.`
      }
    ],
    temperature: 0.7,
  });
  return { text: response.choices[0].message.content };
  */

  // Mock response
  const descriptions = [
    `${input.name} é um magnífico exemplar da raça Lusitana, destacando-se pela sua elegância e presença imponente. ${input.features ? `Com ${input.features.join(", ")}, ` : ""}este cavalo combina perfeitamente a tradição equestre portuguesa com aptidões modernas. Ideal para praticantes exigentes que procuram excelência.`,
    `Apresentamos ${input.name}, um cavalo Lusitano de linhas nobres que incorpora o melhor da raça. ${input.features ? `As suas qualidades incluem ${input.features.join(", ")}, ` : ""}tornando-o numa escolha excepcional para diversas disciplinas. Um verdadeiro embaixador da equitação portuguesa.`,
    `${input.name} é um cavalo Lusitano de características notáveis, fruto de uma seleção rigorosa. ${input.features ? `Distingue-se por ${input.features.join(", ")}, ` : ""}sendo uma excelente opção tanto para competição como para alta escola. A sua morfologia e temperamento refletem o melhor da tradição lusitana.`,
  ];

  return {
    text: descriptions[Math.floor(Math.random() * descriptions.length)],
    suggestions: [
      "Adicionar informação sobre linhagem",
      "Mencionar disciplinas recomendadas",
      "Incluir características temperamentais",
    ],
  };
}

async function suggestEmailSubject(input: any) {
  // Mock - In production, use OpenAI with prompt engineering

  const { type, text } = input;

  const subjects = {
    newsletter: [
      "🐴 Novidades do Portal Lusitano - Cavalos em Destaque",
      "✨ Esta Semana: Cavalos Lusitanos Excecionais",
      "🏆 Os Melhores Cavalos Lusitanos do Mês",
      "📰 Newsletter Portal Lusitano - Não Percas!",
    ],
    promotion: [
      "🔥 Oportunidade Única: Cavalos Lusitanos Premium",
      "💎 Cavalos Selecionados com Condições Especiais",
      "⭐ Oferta Limitada: Cavalos de Topo ao Teu Alcance",
      "🎯 Última Chamada: Cavalos Lusitanos de Elite",
    ],
    event: [
      "📅 Evento Imperdível: Cavalos Lusitanos em Destaque",
      "🎪 Vem Conhecer os Melhores Cavalos Lusitanos",
      "🗓️ Marca na Agenda: Exposição de Cavalos Premium",
      "🏇 Grande Evento: O Melhor da Raça Lusitana",
    ],
  };

  const typeSubjects = subjects[type as keyof typeof subjects] || subjects.newsletter;
  const selected = typeSubjects[Math.floor(Math.random() * typeSubjects.length)];

  return {
    subject: selected,
    alternatives: typeSubjects.filter((s) => s !== selected).slice(0, 3),
    openRatePrediction: "28-35%",
    tips: [
      "Usar emojis aumenta abertura em 15%",
      "Subject lines com 40-50 caracteres performam melhor",
      "Personalização com nome aumenta engagement",
    ],
  };
}

async function analyzeSentiment(input: any) {
  // Mock sentiment analysis - In production, use OpenAI or specialized API

  const reviews = input.reviews || [];

  if (reviews.length === 0) {
    return {
      overall: "neutral",
      positive: 0,
      negative: 0,
      neutral: 0,
      insights: ["Sem reviews para analisar"],
    };
  }

  // Simple mock analysis
  const sentiments = reviews.map((review: any) => {
    const text = (review.comment || "").toLowerCase();
    const positiveWords = ["excelente", "ótimo", "bom", "recomendo", "fantástico", "maravilhoso"];
    const negativeWords = ["mau", "péssimo", "terrível", "não recomendo", "fraco"];

    const positiveCount = positiveWords.filter((w) => text.includes(w)).length;
    const negativeCount = negativeWords.filter((w) => text.includes(w)).length;

    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  });

  const positive = sentiments.filter((s: string) => s === "positive").length;
  const negative = sentiments.filter((s: string) => s === "negative").length;
  const neutral = sentiments.filter((s: string) => s === "neutral").length;

  const total = reviews.length;
  const overall =
    positive > total * 0.6 ? "positive" : negative > total * 0.3 ? "negative" : "neutral";

  return {
    overall,
    positive,
    negative,
    neutral,
    percentages: {
      positive: ((positive / total) * 100).toFixed(1),
      negative: ((negative / total) * 100).toFixed(1),
      neutral: ((neutral / total) * 100).toFixed(1),
    },
    insights: [
      overall === "positive"
        ? "Reviews maioritariamente positivas - Ótima reputação"
        : overall === "negative"
        ? "Atenção: Sentimento negativo detetado - Investigar problemas"
        : "Sentimento misto - Oportunidade de melhoria",
      `${positive} reviews positivas de ${total}`,
      negative > 0 ? `${negative} reviews negativas requerem atenção` : "Sem reviews negativas",
    ],
  };
}

async function suggestBestTime(input: any) {
  // Mock - In production, analyze historical email open rates

  const dayRecommendations = {
    "Segunda-feira": { time: "10:00", openRate: "18%", reason: "Pessoas a organizar a semana" },
    "Terça-feira": { time: "14:00", openRate: "32%", reason: "Pico de engagement semanal" },
    "Quarta-feira": { time: "11:00", openRate: "29%", reason: "Meio da semana, atenção alta" },
    "Quinta-feira": { time: "15:00", openRate: "26%", reason: "Preparação fim de semana" },
    "Sexta-feira": { time: "09:00", openRate: "15%", reason: "Manhã antes do weekend" },
    "Sábado": { time: "12:00", openRate: "8%", reason: "Baixo engagement - evitar" },
    "Domingo": { time: "19:00", openRate: "12%", reason: "Noite de preparação semana" },
  };

  const best = "Terça-feira";
  const recommendation = dayRecommendations[best];

  return {
    bestDay: best,
    bestTime: recommendation.time,
    expectedOpenRate: recommendation.openRate,
    reason: recommendation.reason,
    alternatives: [
      { day: "Quarta-feira", time: "11:00", openRate: "29%" },
      { day: "Quinta-feira", time: "15:00", openRate: "26%" },
    ],
    avoid: ["Sábado", "Domingo"],
  };
}

async function improveText(input: any) {
  // Mock text improvement - In production, use OpenAI

  const { text } = input;

  if (!text) {
    return { error: "Texto não fornecido" };
  }

  // Simple mock improvements
  let improved = text
    .replace(/\b(\w+)\b(\s+\1\b)+/gi, "$1") // Remove duplicates
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();

  // Capitalize first letter
  improved = improved.charAt(0).toUpperCase() + improved.slice(1);

  // Add period if missing
  if (!/[.!?]$/.test(improved)) {
    improved += ".";
  }

  return {
    original: text,
    improved,
    changes: [
      { type: "grammar", description: "Capitalização corrigida" },
      { type: "style", description: "Pontuação melhorada" },
      { type: "clarity", description: "Espaços normalizados" },
    ],
    readabilityScore: {
      before: 68,
      after: 82,
      improvement: "+14 pontos",
    },
  };
}
