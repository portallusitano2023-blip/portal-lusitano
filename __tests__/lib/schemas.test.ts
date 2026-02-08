import { describe, it, expect } from "vitest";
import {
  newsletterSchema,
  reviewSchema,
  loginSchema,
  contactoSchema,
  coudelariaRegistoSchema,
  parseWithZod,
} from "@/lib/schemas";

describe("newsletterSchema", () => {
  it("accepts valid email", () => {
    const result = newsletterSchema.safeParse({ email: "test@example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = newsletterSchema.safeParse({ email: "invalid" });
    expect(result.success).toBe(false);
  });

  it("rejects empty email", () => {
    const result = newsletterSchema.safeParse({ email: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing email", () => {
    const result = newsletterSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "admin@portal.pt",
      password: "secret123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing password", () => {
    const result = loginSchema.safeParse({ email: "admin@portal.pt" });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "admin@portal.pt",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret",
    });
    expect(result.success).toBe(false);
  });
});

describe("reviewSchema", () => {
  const validReview = {
    coudelaria_id: "abc-123",
    autor_nome: "João Silva",
    avaliacao: 5,
    comentario: "Excelente coudelaria!",
  };

  it("accepts valid review with required fields only", () => {
    const result = reviewSchema.safeParse(validReview);
    expect(result.success).toBe(true);
  });

  it("accepts valid review with all fields", () => {
    const result = reviewSchema.safeParse({
      ...validReview,
      autor_email: "joao@email.com",
      autor_localizacao: "Lisboa",
      titulo: "Visita fantástica",
      data_visita: "2024-01-15",
      tipo_visita: "visita",
      recomenda: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects rating below 1", () => {
    const result = reviewSchema.safeParse({ ...validReview, avaliacao: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects rating above 5", () => {
    const result = reviewSchema.safeParse({ ...validReview, avaliacao: 6 });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer rating", () => {
    const result = reviewSchema.safeParse({ ...validReview, avaliacao: 3.5 });
    expect(result.success).toBe(false);
  });

  it("rejects empty comentario", () => {
    const result = reviewSchema.safeParse({ ...validReview, comentario: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing coudelaria_id", () => {
    const { coudelaria_id: _coudelaria_id, ...rest } = validReview;
    const result = reviewSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("accepts empty string for optional email", () => {
    const result = reviewSchema.safeParse({ ...validReview, autor_email: "" });
    expect(result.success).toBe(true);
  });

  it("defaults recomenda to true", () => {
    const result = reviewSchema.safeParse(validReview);
    if (result.success) {
      expect(result.data.recomenda).toBe(true);
    }
  });
});

describe("contactoSchema", () => {
  it("accepts valid contact", () => {
    const result = contactoSchema.safeParse({
      nome: "Maria",
      email: "maria@email.com",
      mensagem: "Gostaria de mais informações",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing nome", () => {
    const result = contactoSchema.safeParse({
      email: "maria@email.com",
      mensagem: "Olá",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty mensagem", () => {
    const result = contactoSchema.safeParse({
      nome: "Maria",
      email: "maria@email.com",
      mensagem: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional assunto", () => {
    const result = contactoSchema.safeParse({
      nome: "Maria",
      email: "maria@email.com",
      mensagem: "Olá",
      assunto: "Informação sobre cavalos",
    });
    expect(result.success).toBe(true);
  });
});

describe("coudelariaRegistoSchema", () => {
  const validCoudelaria = {
    nome: "Coudelaria Vale do Tejo",
    localizacao: "Golegã",
    regiao: "Ribatejo",
    descricao: "Coudelaria dedicada à criação de cavalos Lusitanos desde 1920",
  };

  it("accepts valid registration", () => {
    const result = coudelariaRegistoSchema.safeParse(validCoudelaria);
    expect(result.success).toBe(true);
  });

  it("rejects short description", () => {
    const result = coudelariaRegistoSchema.safeParse({
      ...validCoudelaria,
      descricao: "Curta",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields", () => {
    const result = coudelariaRegistoSchema.safeParse({
      ...validCoudelaria,
      email: "info@coudelaria.pt",
      telefone: "+351 249 000 000",
      website: "https://coudelaria.pt",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid website URL", () => {
    const result = coudelariaRegistoSchema.safeParse({
      ...validCoudelaria,
      website: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});

describe("parseWithZod", () => {
  it("returns success with parsed data", () => {
    const result = parseWithZod(newsletterSchema, { email: "test@test.com" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("test@test.com");
    }
  });

  it("returns error message on failure", () => {
    const result = parseWithZod(newsletterSchema, { email: "invalid" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("E-mail inválido");
    }
  });

  it("returns first error when multiple failures", () => {
    const result = parseWithZod(loginSchema, {});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(typeof result.error).toBe("string");
      expect(result.error.length).toBeGreaterThan(0);
    }
  });
});
