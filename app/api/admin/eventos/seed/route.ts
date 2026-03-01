import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

// Eventos reais do Cavalo Lusitano pesquisados em fontes oficiais (APSL, etc.)
const eventosReais = [
  // 2025 Events
  {
    titulo: "II Salão do Cavalo Lusitano",
    slug: "ii-salao-cavalo-lusitano-2025",
    descricao:
      "Exposição anual do Cavalo Lusitano com processo de aprovação de garanhões, apresentando os melhores futuros reprodutores.",
    descricao_completa:
      "O II Salão do Cavalo Lusitano realizou-se na Sociedade Hípica Portuguesa em Lisboa. Este evento destacou-se pelo processo de aprovação anual de garanhões da APSL, apresentando mais de 100 garanhões. O evento incluiu também competições do projeto Cavalos Jovens de Dressage.",
    tipo: "exposicao",
    data_inicio: "2025-01-23",
    data_fim: "2025-01-26",
    localizacao: "Sociedade Hípica Portuguesa, Lisboa",
    regiao: "Lisboa",
    organizador: "APSL - Associação Portuguesa de Criadores do Cavalo Puro Sangue Lusitano",
    website: "https://www.cavalo-lusitano.com/pt/agenda",
    preco_entrada: "Consultar",
    destaque: false,
    tags: ["aprovação", "garanhões", "dressage", "APSL"],
  },
  {
    titulo: "Feira de Trofa 2025",
    slug: "feira-trofa-2025",
    descricao:
      "Evento vibrante que celebra o Cavalo Lusitano e a rica cultura da região norte de Portugal.",
    descricao_completa:
      "A Feira de Trofa é um evento tradicional do norte de Portugal que combina a apresentação de Cavalos Lusitanos com a cultura regional. Integrada numa exposição agrícola maior, oferece apresentações de cavalos, artesanato tradicional, gastronomia local e inovações agrícolas.",
    tipo: "feira",
    data_inicio: "2025-02-28",
    data_fim: "2025-03-02",
    localizacao: "Trofa",
    regiao: "Norte",
    organizador: "Câmara Municipal de Trofa",
    website: "https://www.cm-trofa.pt",
    preco_entrada: "Gratuito",
    destaque: false,
    tags: ["feira", "norte", "tradição", "agricultura"],
  },
  {
    titulo: "Aprovação de Éguas - Distrito de Aveiro",
    slug: "aprovacao-eguas-aveiro-2025",
    descricao:
      "A Comissão de Inscrição da Raça Lusitana desloca-se ao Distrito de Aveiro para aprovação de éguas ao Livro de Adultos.",
    descricao_completa:
      "Evento oficial da APSL onde a Comissão de Inscrição da Raça Lusitana avalia e aprova éguas para inscrição no Livro de Adultos do Stud-Book da Raça Lusitana. Momento importante para criadores da região de Aveiro.",
    tipo: "competicao",
    data_inicio: "2025-03-11",
    data_fim: "2025-03-12",
    localizacao: "Distrito de Aveiro",
    regiao: "Centro",
    organizador: "APSL",
    website: "https://www.cavalo-lusitano.com/pt/agenda",
    preco_entrada: "Apenas criadores",
    destaque: false,
    tags: ["aprovação", "éguas", "APSL", "stud-book"],
  },
  {
    titulo: "Aprovação de Éguas - Leiria e Coimbra",
    slug: "aprovacao-eguas-leiria-coimbra-2025",
    descricao: "Aprovação de éguas ao Livro de Adultos nos distritos de Leiria e Coimbra.",
    descricao_completa:
      "A Comissão de Inscrição da Raça Lusitana visita os distritos de Leiria e Coimbra para avaliar e aprovar éguas para o Livro de Adultos do Stud-Book da Raça Lusitana.",
    tipo: "competicao",
    data_inicio: "2025-04-01",
    data_fim: "2025-04-02",
    localizacao: "Distritos de Leiria e Coimbra",
    regiao: "Centro",
    organizador: "APSL",
    website: "https://www.cavalo-lusitano.com/pt/agenda",
    preco_entrada: "Apenas criadores",
    destaque: false,
    tags: ["aprovação", "éguas", "APSL", "stud-book"],
  },
  {
    titulo: "2ª Jornada do Campeonato Nacional de Equitação de Trabalho",
    slug: "2-jornada-campeonato-equitacao-trabalho-2025",
    descricao:
      "Segunda jornada do Campeonato Nacional de Equitação de Trabalho na histórica Golegã.",
    descricao_completa:
      "A 2ª Jornada do Campeonato Nacional de Equitação de Trabalho realiza-se na Golegã, reunindo os melhores cavaleiros e cavalos Lusitanos na modalidade de Equitação de Trabalho, uma disciplina que destaca a versatilidade e tradição equestre portuguesa.",
    tipo: "competicao",
    data_inicio: "2025-04-11",
    data_fim: "2025-04-13",
    localizacao: "Golegã",
    regiao: "Ribatejo",
    organizador: "APSL / Federação Equestre Portuguesa",
    website: "https://www.cavalo-lusitano.com/pt/agenda",
    preco_entrada: "Consultar",
    destaque: false,
    tags: ["equitação de trabalho", "campeonato", "Golegã", "competição"],
  },
  {
    titulo: "Leilão Anual da Coudelaria de Alter Real",
    slug: "leilao-alter-real-2025",
    descricao:
      "Tradição secular da cultura equestre portuguesa com mais de 20 cavalos em leilão, criados pela Alter Real ou Coudelaria Nacional.",
    descricao_completa:
      "O Leilão Anual da Coudelaria de Alter Real é uma tradição secular da cultura equestre portuguesa. Realizado anualmente a 24 de abril, apresenta mais de 20 cavalos criados pela prestigiada Coudelaria de Alter Real ou pela Coudelaria Nacional. Uma oportunidade única para adquirir exemplares de linhagens históricas.",
    tipo: "leilao",
    data_inicio: "2025-04-24",
    data_fim: "2025-04-24",
    localizacao: "Coudelaria de Alter Real, Alter do Chão",
    regiao: "Alentejo",
    organizador: "Coudelaria de Alter Real / Companhia das Lezírias",
    website: "https://alterreal.pt",
    preco_entrada: "Gratuito (licitação mediante registo)",
    destaque: true,
    tags: ["leilão", "Alter Real", "tradição", "coudelaria nacional"],
  },
  {
    titulo: "XXXVI Festival Internacional do Cavalo Lusitano",
    slug: "festival-internacional-cavalo-lusitano-2025",
    descricao:
      "O evento mais importante dedicado ao Cavalo Lusitano, com 250 cavalos em competição e o 2º Campeonato do Mundo de Modelo e Andamentos.",
    descricao_completa:
      "O XXXVI Festival Internacional do Cavalo Lusitano é considerado por muitos o evento do ano para a raça Lusitana. Realizado no Hipódromo Manuel Possolo em Cascais, reúne cerca de 250 cavalos em competições de Modelo e Andamentos, Equitação de Trabalho, Equitação à Portuguesa, Ensino e Espetáculo Equestre. Esta edição inclui o 2º Campeonato do Mundo de Modelo e Andamentos, onde os melhores exemplares competem pelo cobiçado título de Campeão dos Campeões.",
    tipo: "competicao",
    data_inicio: "2025-06-26",
    data_fim: "2025-06-29",
    localizacao: "Hipódromo Manuel Possolo, Cascais",
    regiao: "Lisboa",
    organizador: "APSL com apoio da Câmara Municipal de Cascais",
    website:
      "https://www.cavalo-lusitano.com/pt/agenda/festival-internacional-do-cavalo-lusitano-2025",
    preco_entrada: "Consultar programa",
    destaque: true,
    tags: ["festival", "campeonato mundial", "Cascais", "modelo e andamentos", "APSL"],
  },
  {
    titulo: "XVII Feira do Cavalo de Ponte de Lima",
    slug: "feira-cavalo-ponte-lima-2025",
    descricao:
      "Evento que combina seleção morfológica, competições desportivas e promoção cultural dos cavalos Lusitano e Garrano.",
    descricao_completa:
      "A 17ª edição da Feira do Cavalo de Ponte de Lima realiza-se no centro de exposições Expolima. Este evento combina seleção morfológica, competições desportivas e promoção cultural, com especial atenção aos cavalos Lusitano e Garrano. Um evento imperdível para amantes de cavalos no Minho.",
    tipo: "feira",
    data_inicio: "2025-07-03",
    data_fim: "2025-07-06",
    localizacao: "Expolima, Ponte de Lima",
    regiao: "Minho",
    organizador: "Câmara Municipal de Ponte de Lima",
    website: "https://www.cm-pontedelima.pt",
    preco_entrada: "Consultar",
    destaque: false,
    tags: ["feira", "Ponte de Lima", "Garrano", "Lusitano", "Minho"],
  },
  {
    titulo: "ExpoÉgua 2025",
    slug: "expo-egua-2025",
    descricao:
      "O evento dedicado às melhores éguas e poldras Lusitanas em competições de Modelo e Andamentos.",
    descricao_completa:
      "A ExpoÉgua é o evento por excelência dedicado às éguas da raça Lusitana. Esta feira destaca as melhores éguas e poldras em competições de Modelo e Andamentos, com criadores de todo o país a apresentarem os seus melhores exemplares. Realizada na histórica vila da Golegã, capital do cavalo Lusitano.",
    tipo: "exposicao",
    data_inicio: "2025-09-12",
    data_fim: "2025-09-14",
    localizacao: "Golegã",
    regiao: "Ribatejo",
    organizador: "APSL",
    website: "https://www.cavalo-lusitano.com/pt/agenda",
    preco_entrada: "Consultar",
    destaque: false,
    tags: ["éguas", "poldras", "modelo e andamentos", "Golegã"],
  },
  {
    titulo: "XLIX Feira Nacional do Cavalo - Golegã 2025",
    slug: "feira-nacional-cavalo-golega-2025",
    descricao:
      "A mais icónica feira equestre de Portugal, patrimônio vivo desde 1571, celebrando a Equitação Portuguesa como Património da UNESCO.",
    descricao_completa:
      "A XLIX Feira Nacional do Cavalo e XXVI Feira Internacional do Cavalo Lusitano realiza-se na Golegã, combinada com a centenária Feira de São Martinho - uma tradição viva desde 1571. A edição de 2025 é especial: a Equitação Portuguesa foi recentemente reconhecida como Património Cultural Imaterial da Humanidade pela UNESCO. O evento conta com o Concurso de Modelo e Andamentos da Raça Lusitana, a Taça de Portugal e a Final do Campeonato Nacional de Equitação de Trabalho, além de concursos de Dressage e Saltos de Obstáculos. É o maior encontro de cavalos, cavaleiros e apaixonados pela cultura equestre em Portugal.",
    tipo: "feira",
    data_inicio: "2025-11-07",
    data_fim: "2025-11-16",
    localizacao: "Golegã",
    regiao: "Ribatejo",
    organizador: "Câmara Municipal da Golegã / APSL",
    website: "https://feiranacionaldocavalo.com",
    preco_entrada: "Consultar programa",
    destaque: true,
    tags: ["Golegã", "São Martinho", "UNESCO", "campeonato nacional", "tradição"],
  },
  // 2026 Events - APENAS CONFIRMADOS OFICIALMENTE
  {
    titulo: "III Salão do Cavalo Lusitano 2026",
    slug: "iii-salao-cavalo-lusitano-2026",
    descricao:
      "Terceira edição do Salão do Cavalo Lusitano com 4 dias de atividades intensas onde tradição, conhecimento técnico e visão de futuro se encontram.",
    descricao_completa:
      "A Sociedade Hípica Portuguesa, em Lisboa, será palco da III edição do Salão do Cavalo Lusitano. O evento é organizado pela APSL, prometendo quatro dias intensos de atividade. Com entrada livre, o programa foi desenhado para profissionais do setor, criadores, cavaleiros e público em geral. Inclui aprovação de garanhões, apresentações, projeto de Cavalos Jovens em Dressage e provas de Equitação de Trabalho.",
    tipo: "exposicao",
    data_inicio: "2026-01-29",
    data_fim: "2026-02-01",
    localizacao: "Sociedade Hípica Portuguesa, Lisboa",
    regiao: "Lisboa",
    organizador: "APSL - Associação Portuguesa de Criadores do Cavalo Puro Sangue Lusitano",
    website: "https://www.cavalo-lusitano.com/pt/noticias/iii-salao-do-cavalo-lusitano-2026",
    preco_entrada: "Entrada Livre",
    destaque: true,
    tags: ["APSL", "Lisboa", "aprovação garanhões", "dressage", "exposição"],
  },
  {
    titulo: "XVIII Feira do Cavalo de Ponte de Lima 2026",
    slug: "feira-cavalo-ponte-lima-2026",
    descricao:
      "18ª edição da feira que celebra o Lusitano e o Garrano, com Quiebro das Arcas como embaixador.",
    descricao_completa:
      "A XVIII Feira do Cavalo de Ponte de Lima homenageia Quiebro das Arcas, Campeão dos Campeões de 2025. O cartaz oficial foi apresentado na Feira Nacional da Golegã 2025. A feira fortalece a oferta equestre da região norte, funcionando como entreposto comercial, cultural e desportivo. Combina seleção morfológica, competições desportivas e promoção cultural dos cavalos Lusitano e Garrano.",
    tipo: "feira",
    data_inicio: "2026-07-02",
    data_fim: "2026-07-05",
    localizacao: "Expolima, Ponte de Lima",
    regiao: "Minho",
    organizador: "Câmara Municipal de Ponte de Lima",
    website: "https://www.feiradocavalo.pt",
    preco_entrada: "Consultar",
    destaque: true,
    tags: ["Ponte de Lima", "Garrano", "Lusitano", "Minho", "Quiebro das Arcas"],
  },
  {
    titulo: "Galas da Escola Portuguesa de Arte Equestre 2026",
    slug: "galas-epae-2026",
    descricao:
      "Espetáculos de alta escola com cavalos Alter Real no Picadeiro Henrique Calado, Belém.",
    descricao_completa:
      "As Galas da Escola Portuguesa de Arte Equestre recriam a atmosfera da corte dos séculos XVIII e XIX. Com duração de cerca de 1h30, ao som de música Barroca e Clássica, os cavaleiros vestem traje de gala e os cavalos de raça Lusitana Alter Real apresentam exercícios característicos do período barroco, como os 'ares altos' e os 'jogos da corte'. A Escola é considerada Património Nacional e uma das quatro melhores academias de equitação clássica do mundo.",
    tipo: "exposicao",
    data_inicio: "2026-01-01",
    data_fim: "2026-12-31",
    hora_inicio: "11:00",
    localizacao: "Picadeiro Henrique Calado, Belém, Lisboa",
    regiao: "Lisboa",
    organizador: "Parques de Sintra - Monte da Lua / Escola Portuguesa de Arte Equestre",
    website:
      "https://www.parquesdesintra.pt/pt/programacao/galas-da-escola-portuguesa-de-arte-equestre/",
    preco_entrada: "Consultar bilheteira",
    destaque: false,
    tags: ["arte equestre", "Alter Real", "Belém", "património", "galas"],
  },
];

export async function POST() {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verificar eventos existentes para evitar duplicados
    const { data: existingEvents } = await supabase.from("eventos").select("slug");

    const existingSlugs = new Set(existingEvents?.map((e) => e.slug) || []);

    // Filtrar apenas eventos novos
    const novosEventos = eventosReais.filter((evento) => !existingSlugs.has(evento.slug));

    if (novosEventos.length === 0) {
      return NextResponse.json({
        message: "Todos os eventos já existem na base de dados",
        added: 0,
        total: eventosReais.length,
      });
    }

    // Inserir novos eventos
    const { data, error } = await supabase
      .from("eventos")
      .insert(
        novosEventos.map((evento) => ({
          ...evento,
          status: "active",
          views_count: 0,
        }))
      )
      .select();

    if (error) {
      logger.error("Erro ao inserir eventos:", error);
      return NextResponse.json({ error: "Erro ao inserir eventos" }, { status: 500 });
    }

    return NextResponse.json({
      message: `${data.length} eventos adicionados com sucesso!`,
      added: data.length,
      total: eventosReais.length,
      eventos: data.map((e) => e.titulo),
    });
  } catch (error) {
    logger.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// GET - Listar eventos que serão adicionados (preview)
export async function GET() {
  const email = await verifySession();
  if (!email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  return NextResponse.json({
    message: "Preview dos eventos que serão adicionados",
    count: eventosReais.length,
    eventos: eventosReais.map((e) => ({
      titulo: e.titulo,
      tipo: e.tipo,
      data_inicio: e.data_inicio,
      localizacao: e.localizacao,
      destaque: e.destaque,
    })),
  });
}
