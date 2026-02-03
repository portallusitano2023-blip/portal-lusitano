# Como Configurar Google AdSense no Portal Lusitano

## Passo 1: Criar Conta Google AdSense

1. Vai a: https://www.google.com/adsense/
2. Clica em "Começar"
3. Inicia sessão com a tua conta Google
4. Introduz o URL do site: `https://portal-lusitano.pt`
5. Escolhe o país (Portugal)
6. Aceita os termos

## Passo 2: Verificar o Site

O Google vai dar-te um código para verificar que és dono do site.
Será algo como:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

## Passo 3: Adicionar o Código ao Site

Abre o ficheiro `app/layout.tsx` e adiciona o código no `<head>`:

```tsx
// No ficheiro app/layout.tsx, dentro do <head>:
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

**IMPORTANTE:** Substitui `ca-pub-XXXXXXXXXXXXXXXX` pelo teu ID real do AdSense.

## Passo 4: Aguardar Aprovação

- O Google vai analisar o teu site
- Demora normalmente 1-14 dias
- Recebes email quando for aprovado

## Passo 5: Criar Blocos de Anúncios

Depois de aprovado:
1. Vai ao painel do AdSense
2. Clica em "Anúncios" > "Por bloco de anúncios"
3. Escolhe o tipo (Display, In-feed, In-article)
4. Copia o código do anúncio

## Passo 6: Adicionar Anúncios às Páginas

Cria um componente para os anúncios:

```tsx
// components/AdBanner.tsx
"use client";

import { useEffect } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle";
}

export default function AdBanner({ slot, format = "auto" }: AdBannerProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
```

## Passo 7: Usar o Componente

```tsx
import AdBanner from "@/components/AdBanner";

// Na página onde queres o anúncio:
<AdBanner slot="1234567890" />
```

---

## Requisitos do Google AdSense

Para ser aprovado, o site precisa de:

- [x] Conteúdo original e de qualidade
- [x] Política de Privacidade (já tens em /privacidade)
- [x] Termos de Serviço (já tens em /termos)
- [x] Navegação clara
- [x] Pelo menos 20-30 páginas de conteúdo
- [x] Site ativo há pelo menos 3 meses (em alguns países)

---

## Ganhos Esperados

| Tráfego Mensal | Ganho Estimado |
|----------------|----------------|
| 1.000 visitas | €1-5 |
| 5.000 visitas | €10-30 |
| 10.000 visitas | €25-75 |
| 50.000 visitas | €150-400 |

*Valores aproximados. Depende do nicho (equestre paga bem) e localização dos visitantes.*

---

## Dicas Importantes

1. **NÃO cliques nos teus próprios anúncios** - Resulta em ban permanente
2. **NÃO peças a amigos para clicar** - O Google deteta
3. **Coloca anúncios em locais visíveis** mas não intrusivos
4. **Melhores locais:** Após o primeiro parágrafo, sidebar, entre secções

---

## Precisa de Ajuda?

Quando tiveres o código do AdSense, posso ajudar-te a integrá-lo corretamente no site.
