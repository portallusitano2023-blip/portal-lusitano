import * as React from "react";
import { CONTACT_EMAIL } from "@/lib/constants";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Img,
  Row,
  Column,
} from "@react-email/components";

interface CartItem {
  product_id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartRecoveryEmailProps {
  cartItems: CartItem[];
  cartTotal: number;
  recoveryUrl: string;
  emailType: "first_reminder" | "second_reminder" | "final_offer";
}

export default function CartRecoveryEmail({
  cartItems = [],
  cartTotal = 0,
  recoveryUrl = "https://portal-lusitano.pt/loja",
  emailType = "first_reminder",
}: CartRecoveryEmailProps) {
  const discount = emailType === "final_offer" ? Math.round(cartTotal * 0.1) : 0;
  const finalTotal = cartTotal - discount;

  return (
    <Html>
      <Head />
      <Preview>
        {emailType === "final_offer"
          ? `${discount}€ de desconto! Complete a sua compra`
          : "O seu carrinho está à espera"}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://portal-lusitano.pt/logo.png"
              width="48"
              height="48"
              alt="Portal Lusitano"
              style={logo}
            />
            <Heading style={h1}>PORTAL LUSITANO</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            {emailType === "first_reminder" && (
              <>
                <Heading style={h2}>Esqueceu-se de algo? 🐴</Heading>
                <Text style={text}>
                  Reparámos que deixou alguns produtos no seu carrinho. Ainda estão lá à sua espera!
                </Text>
              </>
            )}

            {emailType === "second_reminder" && (
              <>
                <Heading style={h2}>Ainda está interessado?</Heading>
                <Text style={text}>
                  Os seus produtos favoritos ainda estão disponíveis. Complete a sua compra antes
                  que acabem!
                </Text>
              </>
            )}

            {emailType === "final_offer" && (
              <>
                <Heading style={h2}>🎁 Oferta Especial Para Si!</Heading>
                <Text style={text}>
                  Como agradecimento por ser nosso cliente, oferecemos-lhe{" "}
                  <strong>{discount}€ de desconto</strong> na sua compra.
                </Text>
                <Section style={discountBox}>
                  <Text style={discountText}>DESCONTO DE {discount}€</Text>
                  <Text style={discountSubtext}>Válido por 24 horas</Text>
                </Section>
              </>
            )}
          </Section>

          {/* Cart Items */}
          <Section style={cartSection}>
            <Heading style={h3}>O Seu Carrinho</Heading>
            {cartItems.map((item) => (
              <Row key={item.product_id} style={cartItem}>
                <Column style={cartImageCol}>
                  <Img src={item.image} width="80" height="80" alt={item.name} style={cartImage} />
                </Column>
                <Column style={cartDetailsCol}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemMeta}>
                    Quantidade: {item.quantity} • {item.price.toFixed(2)}€
                  </Text>
                </Column>
                <Column style={cartPriceCol}>
                  <Text style={itemPrice}>{(item.price * item.quantity).toFixed(2)}€</Text>
                </Column>
              </Row>
            ))}

            <Hr style={divider} />

            {/* Totals */}
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Subtotal:</Text>
              </Column>
              <Column>
                <Text style={totalValue}>{cartTotal.toFixed(2)}€</Text>
              </Column>
            </Row>

            {discount > 0 && (
              <Row style={totalRow}>
                <Column>
                  <Text style={discountLabel}>Desconto:</Text>
                </Column>
                <Column>
                  <Text style={discountValue}>-{discount.toFixed(2)}€</Text>
                </Column>
              </Row>
            )}

            <Row style={totalRow}>
              <Column>
                <Text style={finalTotalLabel}>Total:</Text>
              </Column>
              <Column>
                <Text style={finalTotalValue}>{finalTotal.toFixed(2)}€</Text>
              </Column>
            </Row>
          </Section>

          {/* CTA Button */}
          <Section style={buttonSection}>
            <Button href={recoveryUrl} style={button}>
              {emailType === "final_offer" ? "Resgatar Desconto Agora" : "Finalizar Compra"}
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>Este carrinho estará disponível por mais 7 dias.</Text>
            <Text style={footerText}>
              Tem dúvidas? Contacte-nos em{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} style={link}>
                {CONTACT_EMAIL}
              </a>
            </Text>
            <Hr style={divider} />
            <Text style={footerSmall}>
              Portal Lusitano — Marketplace Premium de Cavalos Lusitanos
              <br />© 2026 Portal Lusitano. Todos os direitos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
};

const header = {
  padding: "30px 40px",
  textAlign: "center" as const,
  borderBottom: "1px solid #e5e5e5",
};

const logo = {
  display: "block",
  margin: "0 auto 10px",
};

const h1 = {
  color: "#C5A059",
  fontSize: "16px",
  fontWeight: "bold",
  letterSpacing: "2px",
  margin: "0",
  textAlign: "center" as const,
};

const content = {
  padding: "40px 40px 20px",
};

const h2 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 16px",
  textAlign: "center" as const,
};

const h3 = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 20px",
};

const text = {
  color: "#444444",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 20px",
  textAlign: "center" as const,
};

const discountBox = {
  backgroundColor: "#C5A059",
  borderRadius: "8px",
  padding: "20px",
  textAlign: "center" as const,
  margin: "20px 0",
};

const discountText = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 8px",
};

const discountSubtext = {
  color: "#ffffff",
  fontSize: "14px",
  opacity: 0.9,
  margin: "0",
};

const cartSection = {
  padding: "0 40px",
};

const cartItem = {
  marginBottom: "16px",
};

const cartImageCol = {
  width: "90px",
  verticalAlign: "top" as const,
};

const cartImage = {
  borderRadius: "4px",
  objectFit: "cover" as const,
};

const cartDetailsCol = {
  verticalAlign: "top" as const,
  paddingLeft: "16px",
};

const cartPriceCol = {
  width: "100px",
  verticalAlign: "top" as const,
  textAlign: "right" as const,
};

const itemName = {
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 4px",
};

const itemMeta = {
  color: "#666666",
  fontSize: "14px",
  margin: "0",
};

const itemPrice = {
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0",
};

const divider = {
  borderColor: "#e5e5e5",
  margin: "20px 0",
};

const totalRow = {
  marginBottom: "8px",
};

const totalLabel = {
  color: "#666666",
  fontSize: "14px",
  margin: "0",
};

const totalValue = {
  color: "#1a1a1a",
  fontSize: "14px",
  margin: "0",
  textAlign: "right" as const,
};

const discountLabel = {
  color: "#16a34a",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0",
};

const discountValue = {
  color: "#16a34a",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0",
  textAlign: "right" as const,
};

const finalTotalLabel = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "8px 0 0",
};

const finalTotalValue = {
  color: "#C5A059",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "8px 0 0",
  textAlign: "right" as const,
};

const buttonSection = {
  padding: "30px 40px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#C5A059",
  borderRadius: "6px",
  color: "#000000",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 40px",
};

const footer = {
  padding: "30px 40px",
  borderTop: "1px solid #e5e5e5",
};

const footerText = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 12px",
  textAlign: "center" as const,
};

const footerSmall = {
  color: "#999999",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "16px 0 0",
  textAlign: "center" as const,
};

const link = {
  color: "#C5A059",
  textDecoration: "underline",
};
