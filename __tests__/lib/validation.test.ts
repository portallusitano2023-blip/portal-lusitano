import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  isValidPhone,
  isValidCreditCard,
  getPasswordStrength,
  sanitizeInput,
  isValidUrl,
  isValidNIF,
  isValidPrice,
  isValidDate,
  validateForm,
} from "@/lib/validation";

describe("isValidEmail", () => {
  it("should return true for valid emails", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user.name@domain.org")).toBe(true);
    expect(isValidEmail("user+tag@example.co.uk")).toBe(true);
  });

  it("should return false for invalid emails", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("invalid")).toBe(false);
    expect(isValidEmail("@domain.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("user@domain")).toBe(false);
    expect(isValidEmail("user name@domain.com")).toBe(false);
  });
});

describe("isValidPhone", () => {
  it("should return true for valid Portuguese phone numbers", () => {
    expect(isValidPhone("912345678")).toBe(true);
    expect(isValidPhone("+351912345678")).toBe(true);
    expect(isValidPhone("351912345678")).toBe(true);
    expect(isValidPhone("912 345 678")).toBe(true);
  });

  it("should return false for invalid phone numbers", () => {
    expect(isValidPhone("")).toBe(false);
    expect(isValidPhone("12345")).toBe(false);
    expect(isValidPhone("1234567890123")).toBe(false);
    expect(isValidPhone("abcdefghi")).toBe(false);
  });
});

describe("isValidCreditCard", () => {
  it("should return true for valid credit card numbers (Luhn check)", () => {
    // Test Visa card
    expect(isValidCreditCard("4532015112830366")).toBe(true);
    // With spaces
    expect(isValidCreditCard("4532 0151 1283 0366")).toBe(true);
  });

  it("should return false for invalid credit card numbers", () => {
    expect(isValidCreditCard("")).toBe(false);
    expect(isValidCreditCard("1234567890123456")).toBe(false);
    expect(isValidCreditCard("abcd1234abcd1234")).toBe(false);
    expect(isValidCreditCard("4532015112830367")).toBe(false); // Invalid Luhn
  });
});

describe("getPasswordStrength", () => {
  it("should return low score for weak passwords", () => {
    const result = getPasswordStrength("abc");
    expect(result.score).toBeLessThan(3);
  });

  it("should return high score for strong passwords", () => {
    const result = getPasswordStrength("MyStr0ng!Pass123");
    expect(result.score).toBeGreaterThanOrEqual(5);
  });

  it("should provide feedback for weak passwords", () => {
    const result = getPasswordStrength("short");
    expect(result.feedback).toContain("Adicione:");
  });

  it("should recognize all password criteria", () => {
    // Only lowercase
    expect(getPasswordStrength("abcdefgh").score).toBe(2);
    // Lowercase + uppercase
    expect(getPasswordStrength("Abcdefgh").score).toBe(3);
    // Lowercase + uppercase + numbers
    expect(getPasswordStrength("Abcdefg1").score).toBe(4);
    // All criteria + length
    expect(getPasswordStrength("Abcdefg1!abc").score).toBe(6);
  });
});

describe("sanitizeInput", () => {
  it("should escape HTML special characters", () => {
    expect(sanitizeInput("<script>")).toBe("&lt;script&gt;");
    expect(sanitizeInput('alert("xss")')).toBe("alert(&quot;xss&quot;)");
    expect(sanitizeInput("it's")).toBe("it&#x27;s");
    expect(sanitizeInput("a/b")).toBe("a&#x2F;b");
  });

  it("should handle empty strings", () => {
    expect(sanitizeInput("")).toBe("");
  });

  it("should not modify safe strings", () => {
    expect(sanitizeInput("Hello World")).toBe("Hello World");
    expect(sanitizeInput("123456")).toBe("123456");
  });
});

describe("isValidUrl", () => {
  it("should return true for valid URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("http://localhost:3000")).toBe(true);
    expect(isValidUrl("https://sub.domain.com/path?query=1")).toBe(true);
  });

  it("should return false for invalid URLs", () => {
    expect(isValidUrl("")).toBe(false);
    expect(isValidUrl("not a url")).toBe(false);
    expect(isValidUrl("example.com")).toBe(false);
    expect(isValidUrl("//missing-protocol.com")).toBe(false);
  });
});

describe("isValidNIF", () => {
  it("should return true for valid Portuguese NIF", () => {
    // Valid NIF examples with correct check digits
    expect(isValidNIF("123456789")).toBe(true); // check digit 9 is valid
    expect(isValidNIF("501442600")).toBe(true); // known valid company NIF
  });

  it("should return false for invalid NIF", () => {
    expect(isValidNIF("")).toBe(false);
    expect(isValidNIF("12345678")).toBe(false); // Too short
    expect(isValidNIF("1234567890")).toBe(false); // Too long
    expect(isValidNIF("abcdefghi")).toBe(false);
    expect(isValidNIF("123456781")).toBe(false); // Wrong check digit (should be 9)
  });
});

describe("isValidPrice", () => {
  it("should return true for valid prices", () => {
    expect(isValidPrice("0")).toBe(true);
    expect(isValidPrice("10")).toBe(true);
    expect(isValidPrice("10.99")).toBe(true);
    expect(isValidPrice("1000.5")).toBe(true);
    expect(isValidPrice("0.01")).toBe(true);
  });

  it("should return false for invalid prices", () => {
    expect(isValidPrice("")).toBe(false);
    expect(isValidPrice("-10")).toBe(false);
    expect(isValidPrice("10.999")).toBe(false); // More than 2 decimals
    expect(isValidPrice("abc")).toBe(false);
    expect(isValidPrice("10,99")).toBe(false); // Wrong decimal separator
  });
});

describe("isValidDate", () => {
  it("should return true for valid dates", () => {
    expect(isValidDate("2024-01-01")).toBe(true);
    expect(isValidDate("2024-12-31")).toBe(true);
    expect(isValidDate("2000-06-15")).toBe(true);
  });

  it("should return false for invalid dates", () => {
    expect(isValidDate("")).toBe(false);
    expect(isValidDate("01-01-2024")).toBe(false); // Wrong format
    expect(isValidDate("2024/01/01")).toBe(false); // Wrong separator
    expect(isValidDate("2024-13-01")).toBe(false); // Invalid month
    expect(isValidDate("2024-00-01")).toBe(false); // Invalid month
    expect(isValidDate("invalid")).toBe(false);
  });
});

describe("validateForm", () => {
  it("should return valid for correct data", () => {
    const data = { email: "test@example.com", name: "John" };
    const rules = {
      email: (v: string) => (isValidEmail(v) ? null : "Invalid email"),
      name: (v: string) => (v.length >= 2 ? null : "Name too short"),
    };

    const result = validateForm(data, rules);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it("should return errors for invalid data", () => {
    const data = { email: "invalid", name: "J" };
    const rules = {
      email: (v: string) => (isValidEmail(v) ? null : "Invalid email"),
      name: (v: string) => (v.length >= 2 ? null : "Name too short"),
    };

    const result = validateForm(data, rules);
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe("Invalid email");
    expect(result.errors.name).toBe("Name too short");
  });

  it("should handle partial rules", () => {
    const data = { email: "test@example.com", name: "John", extra: "value" };
    const rules = {
      email: (v: string) => (isValidEmail(v) ? null : "Invalid email"),
    };

    const result = validateForm(data, rules);
    expect(result.isValid).toBe(true);
  });
});
