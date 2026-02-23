-- =============================================
-- UPDATE: Cavalos na Areia — dados completos
-- Correr no Supabase SQL Editor para actualizar
-- a entrada existente com toda a informação
-- =============================================
-- FONTE: https://www.cavalosnaareia.com/pt_pt/about-us
-- FONTE: https://www.visitalentejo.pt/en/catalogue/what-to-do/tourist-activities/cavalos-na-areia/
-- FONTE: https://travelmagg.sapo.pt/o-melhor-de-portugal/artigos/os-passeios-a-cavalo-na-comporta-conquistaram-ronaldo-shakira-e-madonna-saiba-quanto-custam
-- FONTE: https://guiastecnicos.turismodeportugal.pt/pt/equestre/ver/Cavalos-na-Areia
-- VERIFICADO: 2026-02-22
-- =============================================

UPDATE coudelarias SET
  descricao = 'Turismo equestre de referência na Comporta desde 2011. Mais de 70 cavalos e 4 experiências distintas: Guided by Sand (praia da Comporta), Guided by Land (Serra da Arrábida), Guided by Water (Rio Sado com kayak) e Guided by Nature (passeio de 2 dias). Premiada como Melhor Empresa de Animação Turística do Alentejo em 2017.',

  historia = 'O projecto Cavalos na Areia começou na Comporta e foi fundado por José Ribeira em 2011. Para alguém que praticamente cresceu numa sela e começou a montar a cavalo aos 3 anos, o turismo equestre foi a concretização de um sonho.

Começando com apenas doze cavalos alojados num antigo armazém de arroz na aldeia da Torre, a escola e os passeios foram crescendo de forma sustentável e com respeito pelo meio ambiente. Hoje, tem mais de setenta cavalos junto aos arrozais em instalações modernas.

O reconhecimento do projecto deve-se à sua envolvente natural única — um vasto areal rodeado de arrozais, pinhais e dunas, integrado na Reserva Natural do Estuário do Rio Sado onde o turismo de massas ainda não chegou. Este local mantém-se praticamente intocado, preservando as características tradicionais e atraindo viajantes de todo o mundo.

Os cavalos, cuidadosamente seleccionados e treinados, alternam entre trabalhar durante um mês e descansar no seguinte. O veterinário visita-os todas as semanas. À medida que envelhecem, os cavalos continuam a viver na comunidade. Durante os seus períodos de descanso, vagueiam livremente pelos campos.

A expansão trouxe consigo uma responsabilidade acrescida. Um estudo de impacto ambiental que durou quase um ano concluiu que o impacto é insignificante, graças à adesão a trilhos marcados e aos esforços dedicados à limpeza ambiental. Nas proximidades dos trilhos, a fauna e a flora naturais locais desenvolveram-se mais do que em locais mais distantes.

Cavalos na Areia contribui para um turismo de qualidade e envolve-se em projectos de responsabilidade social com escolas e organizações locais.

Hoje, uma empresa mais consolidada, expandiu os seus horizontes e oferece quatro experiências distintas em locais emblemáticos de Portugal:

— Guided by Sand (Comporta): o percurso original, ao longo dos arrozais, atravessando o pinhal e as dunas até à praia — um trecho paradisíaco da costa atlântica praticamente deserto. Passeios de 1h30, de €70 a €110 conforme a época.

— Guided by Land (Serra da Arrábida): na Quinta do Esteval, propriedade da família Palmela desde o séc. XVIII, dentro do Parque Natural da Arrábida, atravessando paisagens agrícolas e zonas selvagens. €95/pessoa em grupo, €110 privado.

— Guided by Water (Rio Sado, Alcácer do Sal): uma combinação de passeio a cavalo e canoagem pelo Rio Sado, partindo da Herdade de Porches junto a Alcácer do Sal. Desde €150/pessoa (2h) até €220/pessoa com piquenique (5h).

— Guided by Nature (2 dias): experiência completa que une praia, rio e serra — inclui almoço na Comporta, kayak no Rio Sado, noite no Hotel Casa Palmela em Setúbal, e cavalgada na Serra da Arrábida. €799/pessoa (mínimo 6 pessoas).

Para além dos passeios, oferece aulas de equitação, aluguer de boxes, organização de eventos especiais, sessões fotográficas profissionais com drone, e vouchers de oferta personalizados (€85 semestral, €110 anual).',

  localizacao = 'Torre, Comporta',
  regiao = 'Alentejo',
  telefone = '+351 913 181 844',
  email = 'info@cavalosnaareia.com',
  website = 'https://www.cavalosnaareia.com',
  instagram = '@cavalosnaareia',
  facebook = 'https://www.facebook.com/Cavalosnaareia/',
  num_cavalos = 70,
  ano_fundacao = 2011,

  especialidades = ARRAY[
    'Turismo Equestre',
    'Passeios a Cavalo',
    'Aulas de Equitação',
    'Experiências Únicas',
    'Responsabilidade Ambiental'
  ],

  premios = ARRAY[
    'Melhor Empresa de Animação Turística 2017 — Turismo do Alentejo',
    'Prémio Mais Sensação — Óscares do Alentejo'
  ],

  servicos = ARRAY[
    'Passeios a cavalo na praia (Comporta)',
    'Passeios na Serra da Arrábida',
    'Passeios pelo Rio Sado com kayak',
    'Experiência de 2 dias (praia + rio + serra)',
    'Aulas de equitação',
    'Aluguer de boxes',
    'Eventos especiais',
    'Sessões fotográficas e vídeo drone',
    'Vouchers de oferta'
  ],

  latitude = 38.3847,
  longitude = -8.7875,

  horario = 'Segunda a Domingo. Verão (Jun-Set): 08:00, 09:30, 11:00, 17:00 (cavalos descansam 12:30-16:30). Inverno (Out-Mai): 11:00, 15:00. Reservas com 48h de antecedência.',

  tags = ARRAY[
    'comporta', 'turismo equestre', 'praia', 'passeios a cavalo',
    'arrozais', 'reserva natural', 'alentejo', 'serra arrabida',
    'alcacer do sal', 'rio sado', 'kayak', 'drone', 'vouchers', 'setubal'
  ],

  status = 'active'

WHERE slug = 'cavalos-na-areia';

-- Verificar resultado
SELECT nome, descricao, telefone, email, horario, array_length(servicos, 1) as num_servicos
FROM coudelarias
WHERE slug = 'cavalos-na-areia';
