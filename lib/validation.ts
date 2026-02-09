// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (Portuguese format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+351|351)?[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

// Credit card validation (Luhn algorithm)
export function isValidCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, "");
  if (!/^\d+$/.test(cleaned)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// Password strength
export function getPasswordStrength(password: string): {
  score: number;
  feedback: string;
} {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score++;
  else feedback.push("Pelo menos 8 caracteres");

  if (password.length >= 12) score++;

  if (/[a-z]/.test(password)) score++;
  else feedback.push("Letras minúsculas");

  if (/[A-Z]/.test(password)) score++;
  else feedback.push("Letras maiúsculas");

  if (/[0-9]/.test(password)) score++;
  else feedback.push("Números");

  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else feedback.push("Caracteres especiais");

  const strengthText = ["Muito fraca", "Fraca", "Razoável", "Boa", "Forte", "Muito forte"][score];

  return {
    score,
    feedback: feedback.length > 0 ? `Adicione: ${feedback.join(", ")}` : strengthText,
  };
}

// Sanitize input (prevent XSS)
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Validate URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Validate Portuguese NIF (tax ID)
export function isValidNIF(nif: string): boolean {
  const cleaned = nif.replace(/\s/g, "");
  if (cleaned.length !== 9 || !/^\d+$/.test(cleaned)) return false;

  const check = parseInt(cleaned[8], 10);
  let sum = 0;

  for (let i = 0; i < 8; i++) {
    sum += parseInt(cleaned[i], 10) * (9 - i);
  }

  const mod = sum % 11;
  const expected = mod < 2 ? 0 : 11 - mod;

  return check === expected;
}

// Validate price format
export function isValidPrice(price: string): boolean {
  const priceRegex = /^\d+(\.\d{1,2})?$/;
  return priceRegex.test(price) && parseFloat(price) >= 0;
}

// Validate date (YYYY-MM-DD)
export function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}

// Form validation helper
export function validateForm<T extends Record<string, unknown>>(
  data: T,
  rules: Partial<Record<keyof T, (value: T[keyof T]) => string | null>>
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } {
  const errors: Partial<Record<keyof T, string>> = {};

  for (const field in rules) {
    const rule = rules[field];
    if (rule) {
      const error = rule(data[field]);
      if (error) {
        errors[field] = error;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
