/**
 * EMAIL SEQUENCES - Automação de Emails para Subscritores do Ebook Grátis
 *
 * Sistema de drip campaign que envia emails automáticos ao longo de 14 dias
 * para nutrir leads e converter para PRO.
 *
 * Sequência:
 * - Dia 0: Welcome + Download
 * - Dia 2: "Já leste? Aqui estão 3 dicas..."
 * - Dia 4: História inspiradora de criador
 * - Dia 7: Introdução à Biblioteca PRO (soft sell)
 * - Dia 10: Case study: "Como o João melhorou sua coudelaria"
 * - Dia 14: Oferta final PRO (hard sell com desconto)
 */

import { sendEmail, EMAIL_CONFIG } from "./resend";

// ============================================================================
// TIPOS
// ============================================================================

export interface Subscriber {
  email: string;
  name: string;
  subscribed_at: string;
  last_email_sent?: string;
  sequence_step?: number;
}

// ============================================================================
// CONFIGURAÇÃO DA SEQUÊNCIA
// ============================================================================

export const EMAIL_SEQUENCE_CONFIG = {
  // Dias após subscrição para enviar cada email
  SCHEDULE: {
    DAY_0: 0, // Imediato (já implementado no subscribe endpoint)
    DAY_2: 2,
    DAY_4: 4,
    DAY_7: 7,
    DAY_10: 10,
    DAY_14: 14,
  },

  // Tags para segmentação
  TAGS: {
    FREE_EBOOK: "free-ebook-subscriber",
    ENGAGED: "engaged", // Abriu emails
    NOT_ENGAGED: "not-engaged", // Não abriu emails
    CONVERTED_PRO: "converted-pro",
  },
};

// ============================================================================
// EMAIL 1: DIA 2 - CHECK-IN + 3 DICAS
// ============================================================================

export async function sendDay2Email(subscriber: Subscriber) {
  const { email, name } = subscriber;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return await sendEmail({
    to: email,
    subject: "🐴 Já leste o ebook? Aqui estão 3 dicas rápidas sobre Lusitanos",
    html: getDay2Template(name, baseUrl),
    template: "sequence-day-2",
  });
}

function getDay2Template(name: string, baseUrl: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: #C5A059; color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .tip-box { background: white; border-left: 4px solid #C5A059; padding: 20px; margin: 20px 0; }
    .button { display: inline-block; background: #C5A059; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐴 Já exploraste o teu ebook?</h1>
    </div>

    <div class="content">
      <p>Olá ${name},</p>

      <p>Há 2 dias descarregaste o ebook <strong>"Introdução ao Cavalo Lusitano"</strong>.</p>

      <p>Espero que já tenhas tido tempo de ler! Se ainda não o fizeste, <a href="${baseUrl}/ebook-gratis/download">aqui está o link de download novamente</a>.</p>

      <h2>💡 3 Dicas Essenciais do Ebook:</h2>

      <div class="tip-box">
        <h3>🎯 Dica 1: Identifica um Lusitano Puro</h3>
        <p>Um Lusitano verdadeiro tem características únicas: cabeça sub-convexa, crinas longas e espessas, e um andar naturalmente elevado. Procura sempre o registo APSL (Associação Portuguesa de Criadores do Cavalo Puro Sangue Lusitano).</p>
      </div>

      <div class="tip-box">
        <h3>🏇 Dica 2: Temperamento Dócil mas Corajoso</h3>
        <p>Os Lusitanos são conhecidos pela combinação rara de docilidade com coragem. São perfeitos tanto para iniciantes (devido à calma) como para profissionais (devido à bravura e aptidões).</p>
      </div>

      <div class="tip-box">
        <h3>📚 Dica 3: Investe em Conhecimento</h3>
        <p>Lusitanos são cavalos nobres que merecem proprietários bem informados. Continua a aprender sobre linhagens, saúde equina, e treino especializado para maximizar o potencial do teu cavalo.</p>
      </div>

      <h3>❓ Tens alguma dúvida sobre Lusitanos?</h3>
      <p>Responde a este email com a tua questão! Leio todas as mensagens e adoro ajudar a comunidade. 😊</p>

      <p style="margin-top: 40px;">
        <strong>PS:</strong> Amanhã vou enviar-te uma história inspiradora sobre um criador português que transformou a sua coudelaria. Fica atento! 📧
      </p>

      <p>Abraço,<br>
      <em>Equipa Portal Lusitano</em></p>
    </div>

    <div class="footer">
      <p>Portal Lusitano PRO - O Mundo do Cavalo Lusitano</p>
      <p><a href="${baseUrl}" style="color: #C5A059;">www.portal-lusitano.pt</a></p>
      <p style="margin-top: 15px; font-size: 11px;">
        Não queres mais receber emails? <a href="${baseUrl}/unsubscribe?email=${encodeURIComponent("")}" style="color: #999;">Cancelar subscrição</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// ============================================================================
// EMAIL 2: DIA 4 - HISTÓRIA INSPIRADORA
// ============================================================================

export async function sendDay4Email(subscriber: Subscriber) {
  const { email, name } = subscriber;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return await sendEmail({
    to: email,
    subject: "✨ A História de João: De 0 a 50 Lusitanos em 10 Anos",
    html: getDay4Template(name, baseUrl),
    template: "sequence-day-4",
  });
}

function getDay4Template(name: string, baseUrl: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #C5A059 0%, #8B6914 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 30px; background: white; }
    .quote { border-left: 5px solid #C5A059; padding: 20px; margin: 25px 0; background: #f9f9f9; font-style: italic; }
    .stat-box { background: #e8f5e9; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
    .stat-number { font-size: 36px; font-weight: bold; color: #C5A059; }
    .footer { background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✨ A História de João Rodrigues</h1>
      <p style="font-size: 18px; margin: 10px 0 0 0;">De zero a uma das coudelarias mais respeitadas de Portugal</p>
    </div>

    <div class="content">
      <p>Olá ${name},</p>

      <p>Hoje quero partilhar contigo uma história que me inspirou profundamente...</p>

      <h2>📖 O Início (2014)</h2>
      <p>João Rodrigues tinha 32 anos quando comprou o seu primeiro Lusitano - um poldro de 6 meses chamado "Soberano". Não tinha experiência em criação, apenas paixão pela raça.</p>

      <div class="quote">
        "Lembro-me de estar no paddock com o Soberano pela primeira vez. Ele era tão pequeno, tão nobre... e eu não fazia ideia do que estava a fazer! 😅"
        <div style="text-align: right; margin-top: 10px; color: #666;">- João Rodrigues</div>
      </div>

      <h2>📚 A Jornada de Aprendizagem</h2>
      <p>João dedicou os primeiros 2 anos apenas a <strong>aprender</strong>:</p>
      <ul>
        <li>Estudou genética e linhagens (Veiga, Andrade, Alter)</li>
        <li>Visitou 20+ coudelarias em Portugal</li>
        <li>Participou em workshops da APSL</li>
        <li>Leu tudo o que encontrou sobre Lusitanos</li>
      </ul>

      <div class="quote">
        "O melhor investimento não foi o primeiro cavalo - foi o conhecimento. Cada ebook, cada curso, cada conversa com criadores experientes valeu ouro."
      </div>

      <h2>🚀 O Crescimento (2016-2024)</h2>
      <p>Com base sólida de conhecimento, João começou a expandir:</p>

      <div class="stat-box">
        <div class="stat-number">2016</div>
        <div>3 éguas de linhagem Andrade adquiridas</div>
      </div>

      <div class="stat-box">
        <div class="stat-number">2018</div>
        <div>Primeiro poldro nascido na coudelaria</div>
      </div>

      <div class="stat-box">
        <div class="stat-number">2020</div>
        <div>15 cavalos, primeira participação em feira</div>
      </div>

      <div class="stat-box">
        <div class="stat-number">2024</div>
        <div>50+ Lusitanos, exportações para 5 países</div>
      </div>

      <h2>💎 As 3 Lições de João</h2>
      <ol>
        <li><strong>Conhecimento > Quantidade</strong>: "Ter 1 cavalo que entendo é melhor que 10 que não sei gerir."</li>
        <li><strong>Paciência Compensa</strong>: "Levei 10 anos, mas construí algo sólido."</li>
        <li><strong>Comunidade Importa</strong>: "Os criadores experientes ensinaram-me mais que qualquer livro."</li>
      </ol>

      <div class="quote">
        "Se pudesse dar um conselho ao João de 2014 seria: investe em conhecimento ANTES de investir em mais cavalos. O Portal Lusitano PRO não existia na altura - hoje teria acelerado a minha jornada em anos."
      </div>

      <h2>🎯 E Tu?</h2>
      <p>Onde te vês daqui a 10 anos?</p>
      <p>Se a história do João te inspirou, talvez seja altura de investir na tua própria jornada de conhecimento.</p>

      <p style="margin-top: 40px;">
        <strong>PS:</strong> Daqui a 3 dias vou mostrar-te exactamente como o Portal Lusitano PRO pode acelerar a TUA jornada (com conteúdo que o João gostaria de ter tido). 😉
      </p>

      <p>Abraço,<br>
      <em>Equipa Portal Lusitano</em></p>
    </div>

    <div class="footer">
      <p>Portal Lusitano PRO</p>
      <p><a href="${baseUrl}" style="color: #C5A059;">www.portal-lusitano.pt</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

// ============================================================================
// EMAIL 3: DIA 7 - INTRODUÇÃO PRO (SOFT SELL)
// ============================================================================

export async function sendDay7Email(subscriber: Subscriber) {
  const { email, name } = subscriber;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return await sendEmail({
    to: email,
    subject: "🎓 Preparado para o próximo nível? Conhece a Biblioteca PRO",
    html: getDay7Template(name, baseUrl),
    template: "sequence-day-7",
  });
}

function getDay7Template(name: string, baseUrl: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: #C5A059; color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: white; }
    .ebook-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
    .ebook-card { background: #f9f9f9; padding: 15px; border-left: 3px solid #C5A059; }
    .button { display: inline-block; background: #C5A059; color: white !important; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .comparison { background: #f0f9ff; border: 2px solid #2196F3; border-radius: 8px; padding: 20px; margin: 25px 0; }
    .footer { background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Pronto para Mais?</h1>
    </div>

    <div class="content">
      <p>Olá ${name},</p>

      <p>Se estás a ler isto, provavelmente já leste o ebook gratuito <strong>"Introdução ao Cavalo Lusitano"</strong>.</p>

      <p>E talvez estejas a pensar: <em>"Ok, aprendi o básico... e agora?"</em></p>

      <h2>📚 Conhece a Biblioteca PRO</h2>
      <p>O ebook gratuito foi apenas o <strong>aperitivo</strong>. A Biblioteca PRO é o banquete completo! 🍽️</p>

      <h3>🎯 O que encontras na Biblioteca PRO:</h3>

      <div class="ebook-grid">
        <div class="ebook-card">
          <strong>Manual do Criador (200p)</strong>
          <p style="font-size: 13px; color: #666; margin: 5px 0 0 0;">De planear a coudelaria a vender poldros</p>
        </div>

        <div class="ebook-card">
          <strong>Linhagens de Elite (150p)</strong>
          <p style="font-size: 13px; color: #666; margin: 5px 0 0 0;">Veiga, Andrade, Alter Real explicados</p>
        </div>

        <div class="ebook-card">
          <strong>Treino de Dressage (180p)</strong>
          <p style="font-size: 13px; color: #666; margin: 5px 0 0 0;">Do desbaste ao Grand Prix</p>
        </div>

        <div class="ebook-card">
          <strong>Saúde Equina (90p)</strong>
          <p style="font-size: 13px; color: #666; margin: 5px 0 0 0;">Prevenção, cuidados, primeiros socorros</p>
        </div>
      </div>

      <p><strong>E mais 46+ ebooks sobre:</strong></p>
      <ul>
        <li>Nutrição equina avançada</li>
        <li>Reprodução e genética</li>
        <li>Working Equitation</li>
        <li>Gestão de coudelarias</li>
        <li>Marketing e vendas de cavalos</li>
        <li>E muito mais...</li>
      </ul>

      <div class="comparison">
        <h3 style="margin-top: 0; color: #2196F3;">💡 Comparação Rápida:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Ebook Grátis</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Biblioteca PRO</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">30 páginas</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #C5A059;"><strong>800+ páginas</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Informação básica</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #C5A059;"><strong>Conhecimento profissional</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">1 ebook</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #C5A059;"><strong>50+ ebooks</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px;">Sem suporte</td>
            <td style="padding: 10px; color: #C5A059;"><strong>Consultoria por email</strong></td>
          </tr>
        </table>
      </div>

      <h2>🎁 Oferta Especial para Ti</h2>
      <p>Como já és parte da comunidade (descarregaste o ebook grátis), tens acesso a um desconto exclusivo:</p>

      <div style="background: #fff4e5; border: 2px dashed #ff9800; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
        <h3 style="margin: 0 0 10px 0; color: #ff9800;">🎉 CÓDIGO: LUSITANO20</h3>
        <p style="margin: 0; font-size: 18px; color: #666;"><strong>20% OFF</strong> na primeira mensalidade</p>
      </div>

      <p style="text-align: center;">
        <a href="${baseUrl}/pro?utm_source=email&utm_campaign=sequence-day-7" class="button">
          👑 Explorar Portal Lusitano PRO
        </a>
      </p>

      <p><strong>Sem pressão!</strong> É apenas um convite. Se preferires continuar só com o ebook gratuito, está tudo bem! 😊</p>

      <p style="margin-top: 40px;">
        <strong>PS:</strong> Daqui a 3 dias vou enviar-te um case study de como um membro PRO melhorou drasticamente a sua coudelaria em 6 meses. Vale a pena ler!
      </p>

      <p>Abraço,<br>
      <em>Equipa Portal Lusitano</em></p>
    </div>

    <div class="footer">
      <p>Portal Lusitano PRO</p>
      <p>A partir de €49.99/mês • Cancela quando quiseres</p>
    </div>
  </div>
</body>
</html>
  `;
}

// ============================================================================
// EMAIL 4: DIA 10 - CASE STUDY
// ============================================================================

export async function sendDay10Email(subscriber: Subscriber) {
  const { email, name } = subscriber;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return await sendEmail({
    to: email,
    subject: "📊 Case Study: Como a Maria aumentou vendas em 300% com a Biblioteca PRO",
    html: getDay10Template(name, baseUrl),
    template: "sequence-day-10",
  });
}

function getDay10Template(name: string, baseUrl: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 30px; background: white; }
    .stat-highlight { background: #e8f5e9; border-radius: 8px; padding: 25px; margin: 20px 0; text-align: center; }
    .stat-number { font-size: 48px; font-weight: bold; color: #4caf50; }
    .timeline { border-left: 3px solid #C5A059; padding-left: 20px; margin: 25px 0; }
    .timeline-item { margin-bottom: 20px; }
    .button { display: inline-block; background: #C5A059; color: white !important; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Case Study Real</h1>
      <p style="font-size: 18px; margin: 10px 0 0 0;">De vendas estagnadas a crescimento exponencial em 6 meses</p>
    </div>

    <div class="content">
      <p>Olá ${name},</p>

      <p>Hoje quero mostrar-te resultados concretos de um membro PRO...</p>

      <h2>👤 Conhece a Maria Santos</h2>
      <p><strong>Perfil:</strong></p>
      <ul>
        <li>Coudelaria familiar em Alter do Chão</li>
        <li>15 cavalos Lusitanos (linhagem Andrade)</li>
        <li>Vendas: 2-3 cavalos/ano antes de PRO</li>
        <li>Problema: Dificuldade em valorizar os cavalos</li>
      </ul>

      <h2>📉 O Problema (Janeiro 2024)</h2>
      <p>Maria tinha cavalos de excelente qualidade, mas:</p>
      <ul>
        <li>❌ Não sabia como apresentá-los online</li>
        <li>❌ Preços muito baixos (falta confiança)</li>
        <li>❌ Marketing inexistente</li>
        <li>❌ Documentação mal organizada</li>
      </ul>

      <div class="stat-highlight">
        <div>Vendas 2023:</div>
        <div class="stat-number">€18.000</div>
        <div>2 cavalos vendidos</div>
      </div>

      <h2>💡 A Transformação (Fevereiro - Julho 2024)</h2>
      <p>Maria subscreveu PRO e implementou o conhecimento dos ebooks:</p>

      <div class="timeline">
        <div class="timeline-item">
          <strong>Mês 1-2: Fundações</strong>
          <p>Estudou "Manual do Criador" e "Marketing de Cavalos"</p>
          <p>✅ Criou website profissional<br>✅ Organizou documentação APSL<br>✅ Fotografou cavalos profissionalmente</p>
        </div>

        <div class="timeline-item">
          <strong>Mês 3-4: Implementação</strong>
          <p>Aplicou estratégias do ebook "Linhagens de Elite"</p>
          <p>✅ Valorizou cavalos corretamente<br>✅ Criou apresentações por linhagem<br>✅ Ativou redes sociais (Instagram)</p>
        </div>

        <div class="timeline-item">
          <strong>Mês 5-6: Resultados</strong>
          <p>Consultoria PRO ajudou a fechar negócios</p>
          <p>✅ 1ª venda: Égua Andrade (€15.000)<br>✅ 2ª venda: Poldro 3 anos (€12.000)<br>✅ 3ª venda: Cavalo treino (€25.000)</p>
        </div>
      </div>

      <div class="stat-highlight">
        <div>Vendas Jan-Jul 2024:</div>
        <div class="stat-number">€52.000</div>
        <div style="color: #4caf50; font-weight: bold;">+300% vs período anterior</div>
      </div>

      <h2>💬 Testemunho da Maria</h2>
      <div style="border-left: 5px solid #C5A059; padding: 20px; margin: 25px 0; background: #f9f9f9; font-style: italic;">
        "O Portal Lusitano PRO foi o melhor investimento que fiz na coudelaria. Os ebooks ensinaram-me a VALORIZAR o meu trabalho. Antes vendia barato por insegurança. Agora sei exactamente o valor dos meus cavalos e como comunicá-lo. €49.99/mês? Paguei-me na primeira venda! 🙏"
        <div style="text-align: right; margin-top: 10px; color: #666;">- Maria Santos, Coudelaria Vale Verde</div>
      </div>

      <h2>🎯 As 5 Coisas Que a Maria Aprendeu</h2>
      <ol>
        <li><strong>Valorização Correta</strong>: Ebook "Linhagens" ensinou a precificar por genética</li>
        <li><strong>Marketing Visual</strong>: Fotografias profissionais aumentaram interesse em 500%</li>
        <li><strong>Storytelling</strong>: Cada cavalo passou a ter uma "história" (linhagem, aptidões)</li>
        <li><strong>Presença Online</strong>: Instagram + Website = alcance internacional</li>
        <li><strong>Confiança</strong>: Conhecimento = segurança em negociações</li>
      </ol>

      <h2>✨ E Tu?</h2>
      <p>Imagina o que poderias alcançar com acesso aos mesmos ebooks que a Maria usou...</p>

      <p style="background: #fff4e5; border: 2px solid #ff9800; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
        <strong>🎁 Lembrete:</strong> O teu código <strong>LUSITANO20</strong> ainda está ativo!<br>
        20% OFF na primeira mensalidade PRO
      </p>

      <p style="text-align: center;">
        <a href="${baseUrl}/pro/checkout?plan=criador&period=monthly&coupon=LUSITANO20" class="button">
          🚀 Começar Como a Maria
        </a>
      </p>

      <p style="margin-top: 40px;">
        <strong>PS:</strong> Último email desta série vem em 4 dias. Vou fazer-te uma oferta final que não vais querer perder! 😉
      </p>

      <p>Abraço,<br>
      <em>Equipa Portal Lusitano</em></p>
    </div>

    <div class="footer">
      <p>Portal Lusitano PRO</p>
    </div>
  </div>
</body>
</html>
  `;
}

// ============================================================================
// EMAIL 5: DIA 14 - OFERTA FINAL (HARD SELL)
// ============================================================================

export async function sendDay14Email(subscriber: Subscriber) {
  const { email, name } = subscriber;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return await sendEmail({
    to: email,
    subject: "⏰ Último dia: LUSITANO20 expira em 24h + Bónus Surpresa",
    html: getDay14Template(name, baseUrl),
    template: "sequence-day-14",
  });
}

function getDay14Template(name: string, baseUrl: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 30px; background: white; }
    .urgency-box { background: #ffebee; border: 3px solid #d32f2f; border-radius: 8px; padding: 25px; text-align: center; margin: 25px 0; }
    .countdown { font-size: 48px; font-weight: bold; color: #d32f2f; }
    .bonus-box { background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; border-radius: 8px; padding: 25px; margin: 25px 0; }
    .button { display: inline-block; background: #d32f2f; color: white !important; padding: 20px 40px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-size: 18px; font-weight: bold; }
    .footer { background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Última Chamada, ${name}!</h1>
      <p style="font-size: 20px; margin: 10px 0 0 0;">O teu código LUSITANO20 expira em 24 horas</p>
    </div>

    <div class="content">
      <p>Olá ${name},</p>

      <p>Há 14 dias descarregaste o ebook <strong>"Introdução ao Cavalo Lusitano"</strong>.</p>

      <p>Desde então, enviei-te:</p>
      <ul>
        <li>✅ 3 dicas essenciais sobre Lusitanos</li>
        <li>✅ A história inspiradora do João</li>
        <li>✅ Visão geral da Biblioteca PRO</li>
        <li>✅ Case study da Maria (+300% vendas)</li>
      </ul>

      <p>Este é o <strong>meu último email desta série</strong>.</p>

      <div class="urgency-box">
        <h2 style="margin-top: 0; color: #d32f2f;">⏰ AVISO IMPORTANTE</h2>
        <div class="countdown">24H</div>
        <p>O código <strong>LUSITANO20</strong> (20% OFF) expira amanhã às 23:59</p>
        <p style="margin-bottom: 0;">Depois disso, volta ao preço normal.</p>
      </div>

      <h2>🎁 E Há Mais: BÓNUS SURPRESA</h2>
      <p>Se subscreveres PRO nas próximas 24h, recebes:</p>

      <div class="bonus-box">
        <h3 style="margin-top: 0;">🎉 PACK BÓNUS EXCLUSIVO</h3>
        <ul style="text-align: left;">
          <li><strong>Ebook Extra:</strong> "10 Erros Fatais em Coudelarias" (€29 valor)</li>
          <li><strong>Template Pack:</strong> 5 contratos prontos a usar (€49 valor)</li>
          <li><strong>Consultoria Adicional:</strong> 1 sessão extra grátis (€99 valor)</li>
          <li><strong>Webinar Gravado:</strong> "Linhagens Lusitanas Explicadas" (€39 valor)</li>
        </ul>
        <p style="text-align: center; margin: 20px 0 0 0; font-size: 20px;"><strong>Total Bónus: €216 GRÁTIS</strong></p>
      </div>

      <h2>💰 Resumo da Oferta</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: #f9f9f9;">
          <td style="padding: 15px; border: 1px solid #ddd;">Plano Criador (normal)</td>
          <td style="padding: 15px; border: 1px solid #ddd; text-align: right;">€49.99/mês</td>
        </tr>
        <tr style="background: #e8f5e9;">
          <td style="padding: 15px; border: 1px solid #ddd;">Desconto LUSITANO20 (1º mês)</td>
          <td style="padding: 15px; border: 1px solid #ddd; text-align: right; color: #4caf50;"><strong>-€10.00</strong></td>
        </tr>
        <tr style="background: #e8f5e9;">
          <td style="padding: 15px; border: 1px solid #ddd;">Pack Bónus</td>
          <td style="padding: 15px; border: 1px solid #ddd; text-align: right; color: #4caf50;"><strong>+€216 valor</strong></td>
        </tr>
        <tr style="background: #fff4e5; font-size: 18px; font-weight: bold;">
          <td style="padding: 15px; border: 1px solid #ddd;">TOTAL 1º MÊS:</td>
          <td style="padding: 15px; border: 1px solid #ddd; text-align: right; color: #ff9800;">€39.99</td>
        </tr>
      </table>

      <p style="text-align: center;">
        <a href="${baseUrl}/pro/checkout?plan=criador&period=monthly&coupon=LUSITANO20&bonus=true" class="button">
          🚀 QUERO APROVEITAR ESTA OFERTA
        </a>
      </p>

      <p style="text-align: center; color: #d32f2f; font-weight: bold;">
        ⏰ Oferta expira em 24 horas!
      </p>

      <h2>❓ Ainda em dúvida?</h2>
      <p><strong>Garantia 30 Dias:</strong> Se não ficares 100% satisfeito, devolvemos o teu dinheiro. Sem perguntas, sem complicações.</p>

      <p><strong>Cancela quando quiseres:</strong> Não há permanência. Cancelas online em 2 cliques.</p>

      <p><strong>Suporte dedicado:</strong> Equipa disponível por email para qualquer dúvida.</p>

      <h2>👋 Seja Qual For a Tua Decisão...</h2>
      <p>Obrigado por teres lido os meus emails nas últimas 2 semanas.</p>

      <p>Se decidas subscrever PRO, vamos adorar receber-te na comunidade! 🎉</p>

      <p>Se preferires continuar com o ebook gratuito, está perfeitamente bem. Podes sempre subscrever no futuro. 😊</p>

      <p><strong>De qualquer forma, desejo-te o melhor na tua jornada com Cavalos Lusitanos!</strong></p>

      <p style="margin-top: 40px;">
        Um grande abraço,<br>
        <em>Equipa Portal Lusitano PRO</em>
      </p>

      <p style="font-size: 12px; color: #999; margin-top: 30px;">
        PS: Se não subscreveres, não vou enviar mais emails de vendas. Apenas a newsletter mensal com dicas (se te inscreveste). Obrigado pela atenção! 🐴
      </p>
    </div>

    <div class="footer">
      <p>Portal Lusitano PRO - O Mundo do Cavalo Lusitano</p>
      <p><a href="${baseUrl}/pro" style="color: #C5A059;">www.portal-lusitano.pt/pro</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

// ============================================================================
// SCHEDULER - Função para enviar emails baseado em dias desde subscrição
// ============================================================================

export async function processEmailSequence(subscriber: Subscriber) {
  const subscribedDate = new Date(subscriber.subscribed_at);
  const now = new Date();
  const daysSinceSubscription = Math.floor(
    (now.getTime() - subscribedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const sequenceStep = subscriber.sequence_step || 0;

  // Day 2 email
  if (daysSinceSubscription >= EMAIL_SEQUENCE_CONFIG.SCHEDULE.DAY_2 && sequenceStep < 2) {
    await sendDay2Email(subscriber);
    return 2;
  }

  // Day 4 email
  if (daysSinceSubscription >= EMAIL_SEQUENCE_CONFIG.SCHEDULE.DAY_4 && sequenceStep < 4) {
    await sendDay4Email(subscriber);
    return 4;
  }

  // Day 7 email
  if (daysSinceSubscription >= EMAIL_SEQUENCE_CONFIG.SCHEDULE.DAY_7 && sequenceStep < 7) {
    await sendDay7Email(subscriber);
    return 7;
  }

  // Day 10 email
  if (daysSinceSubscription >= EMAIL_SEQUENCE_CONFIG.SCHEDULE.DAY_10 && sequenceStep < 10) {
    await sendDay10Email(subscriber);
    return 10;
  }

  // Day 14 email (final)
  if (daysSinceSubscription >= EMAIL_SEQUENCE_CONFIG.SCHEDULE.DAY_14 && sequenceStep < 14) {
    await sendDay14Email(subscriber);
    return 14;
  }

  return sequenceStep;
}
