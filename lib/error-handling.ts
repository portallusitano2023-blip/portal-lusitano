/**
 * Error Handling Utilities - Portal Lusitano
 *
 * Biblioteca reutilizável para tratamento de erros consistente em toda a aplicação.
 *
 * @example
 * ```typescript
 * const { data, error } = await fetchWithErrorHandling(
 *   () => client.fetch(query),
 *   { timeout: 10000, fallback: null }
 * );
 *
 * if (error) {
 *   const errorType = getErrorType(error);
 *   toast.error(ERROR_MESSAGES[errorType]);
 * }
 * ```
 */

// ============================================================================
// Error Types
// ============================================================================

/**
 * Tipos de erro possíveis na aplicação
 */
export enum ErrorType {
  /** Recurso não encontrado (404) */
  NOT_FOUND = "NOT_FOUND",

  /** Erro de rede/conexão */
  NETWORK = "NETWORK",

  /** Timeout na requisição */
  TIMEOUT = "TIMEOUT",

  /** Erro de validação (400) */
  VALIDATION = "VALIDATION",

  /** Erro do servidor (500) */
  SERVER = "SERVER",

  /** Erro desconhecido */
  UNKNOWN = "UNKNOWN",
}

/**
 * Mensagens de erro user-friendly para cada tipo
 */
export const ERROR_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.NOT_FOUND]:
    "Conteúdo não encontrado. Pode ter sido removido ou o link está incorreto.",
  [ErrorType.NETWORK]: "Erro de conexão. Verifique sua internet e tente novamente.",
  [ErrorType.TIMEOUT]: "A conexão demorou muito tempo. Tente novamente.",
  [ErrorType.VALIDATION]: "Dados inválidos. Verifique as informações e tente novamente.",
  [ErrorType.SERVER]: "Erro no servidor. Tente novamente em alguns instantes.",
  [ErrorType.UNKNOWN]: "Erro inesperado. Por favor, tente novamente.",
};

// ============================================================================
// Error Type Detection
// ============================================================================

/**
 * Detecta o tipo de erro com base na instância do erro
 *
 * @param error - Erro a ser analisado
 * @returns Tipo de erro classificado
 *
 * @example
 * ```typescript
 * try {
 *   await fetch('/api/data');
 * } catch (err) {
 *   const errorType = getErrorType(err);
 *   console.log(ERROR_MESSAGES[errorType]);
 * }
 * ```
 */
export function getErrorType(error: unknown): ErrorType {
  if (!(error instanceof Error)) {
    return ErrorType.UNKNOWN;
  }

  // Timeout errors
  if (error.name === "AbortError" || error.message.includes("timeout")) {
    return ErrorType.TIMEOUT;
  }

  // Network errors
  if (
    error.message.includes("fetch") ||
    error.message.includes("network") ||
    error.message.includes("NetworkError") ||
    error.message.includes("Failed to fetch")
  ) {
    return ErrorType.NETWORK;
  }

  // HTTP errors (se Error tiver propriedade status)
  const httpError = error as Error & { status?: number };
  if (httpError.status) {
    if (httpError.status === 404) return ErrorType.NOT_FOUND;
    if (httpError.status >= 400 && httpError.status < 500) return ErrorType.VALIDATION;
    if (httpError.status >= 500) return ErrorType.SERVER;
  }

  // Parse HTTP status da mensagem de erro
  const statusMatch = error.message.match(/Erro (\d{3})/);
  if (statusMatch) {
    const status = parseInt(statusMatch[1]);
    if (status === 404) return ErrorType.NOT_FOUND;
    if (status >= 400 && status < 500) return ErrorType.VALIDATION;
    if (status >= 500) return ErrorType.SERVER;
  }

  return ErrorType.UNKNOWN;
}

// ============================================================================
// Fetch with Error Handling
// ============================================================================

/**
 * Opções para fetchWithErrorHandling
 */
export interface FetchWithErrorHandlingOptions<T> {
  /** Valor de fallback caso ocorra erro */
  fallback?: T;

  /** Timeout em milissegundos (padrão: 10000) */
  timeout?: number;

  /** Callback executado antes de fazer fetch (útil para logging) */
  onStart?: () => void;

  /** Callback executado após sucesso */
  onSuccess?: (data: T) => void;

  /** Callback executado após erro */
  onError?: (error: Error, errorType: ErrorType) => void;
}

/**
 * Resultado do fetch com error handling
 */
export interface FetchResult<T> {
  /** Dados retornados (null se houver erro) */
  data: T | null;

  /** Erro ocorrido (null se sucesso) */
  error: Error | null;

  /** Tipo de erro (null se sucesso) */
  errorType: ErrorType | null;
}

/**
 * Wrapper para fetch com error handling robusto e timeout
 *
 * @param fetchFn - Função que retorna Promise com os dados
 * @param options - Opções de configuração
 * @returns Resultado com data/error
 *
 * @example
 * ```typescript
 * // Uso básico
 * const { data, error, errorType } = await fetchWithErrorHandling(
 *   () => fetch('/api/users').then(res => res.json()),
 *   { timeout: 5000 }
 * );
 *
 * // Com callbacks
 * const { data } = await fetchWithErrorHandling(
 *   () => client.fetch(query),
 *   {
 *     timeout: 10000,
 *     fallback: [],
 *     onStart: () => console.log('Fetching...'),
 *     onSuccess: (data) => console.log('Success:', data),
 *     onError: (error, type) => toast.error(ERROR_MESSAGES[type]),
 *   }
 * );
 * ```
 */
export async function fetchWithErrorHandling<T>(
  fetchFn: () => Promise<T>,
  options: FetchWithErrorHandlingOptions<T> = {}
): Promise<FetchResult<T>> {
  const { fallback = null, timeout = 10000, onStart, onSuccess, onError } = options;

  onStart?.();

  try {
    // Setup timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Execute fetch
    const data = await fetchFn();

    // Clear timeout
    clearTimeout(timeoutId);

    onSuccess?.(data);

    return {
      data,
      error: null,
      errorType: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    const errorType = getErrorType(error);

    console.error(`[fetchWithErrorHandling] ${errorType}:`, error);

    onError?.(error, errorType);

    return {
      data: fallback as T,
      error,
      errorType,
    };
  }
}

// ============================================================================
// HTTP Response Error Handler
// ============================================================================

/**
 * Trata resposta HTTP e lança erro apropriado se não for OK
 *
 * @param response - Response do fetch
 * @param customMessages - Mensagens customizadas por status code
 * @returns Response se OK
 * @throws Error com status e mensagem apropriada
 *
 * @example
 * ```typescript
 * const res = await fetch('/api/users');
 * await handleHttpError(res);
 * const data = await res.json();
 * ```
 */
export async function handleHttpError(
  response: Response,
  customMessages?: Partial<Record<number, string>>
): Promise<Response> {
  if (response.ok) {
    return response;
  }

  const status = response.status;
  let message = customMessages?.[status];

  if (!message) {
    if (status === 404) message = "Recurso não encontrado";
    else if (status === 400) message = "Dados inválidos";
    else if (status === 401) message = "Não autorizado";
    else if (status === 403) message = "Acesso negado";
    else if (status === 429) message = "Muitas requisições. Aguarde um momento";
    else if (status >= 500) message = "Erro no servidor";
    else message = "Erro desconhecido";
  }

  const error = new Error(`Erro ${status}: ${message}`) as Error & { status: number };
  error.status = status;

  throw error;
}

// ============================================================================
// Retry Logic
// ============================================================================

/**
 * Opções para retry logic
 */
export interface RetryOptions {
  /** Número máximo de tentativas (padrão: 3) */
  maxRetries?: number;

  /** Delay base em ms entre tentativas (padrão: 1000) */
  baseDelay?: number;

  /** Usar exponential backoff (padrão: true) */
  exponentialBackoff?: boolean;

  /** Callback executado a cada retry */
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Executa função com retry automático em caso de falha
 *
 * @param fn - Função a ser executada
 * @param options - Opções de retry
 * @returns Resultado da função
 *
 * @example
 * ```typescript
 * const data = await withRetry(
 *   () => fetch('/api/data').then(res => res.json()),
 *   {
 *     maxRetries: 3,
 *     exponentialBackoff: true,
 *     onRetry: (attempt, error) => console.log(`Retry ${attempt}:`, error),
 *   }
 * );
 * ```
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, exponentialBackoff = true, onRetry } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // Não fazer retry se for erro de validação ou 404
      const errorType = getErrorType(lastError);
      if (errorType === ErrorType.NOT_FOUND || errorType === ErrorType.VALIDATION) {
        throw lastError;
      }

      // Se não há mais retries, lança erro
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Calcular delay
      const delay = exponentialBackoff ? baseDelay * Math.pow(2, attempt) : baseDelay;

      onRetry?.(attempt + 1, lastError);

      // Aguardar antes de tentar novamente
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Nunca deve chegar aqui, mas TypeScript precisa
  throw lastError || new Error("Unknown error");
}

// ============================================================================
// Utility: Safe JSON Parse
// ============================================================================

/**
 * Parse JSON seguro que retorna fallback em caso de erro
 *
 * @param json - String JSON para parse
 * @param fallback - Valor de fallback
 * @returns Objeto parseado ou fallback
 *
 * @example
 * ```typescript
 * const data = safeJsonParse(response, { default: 'value' });
 * ```
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// ============================================================================
// Utility: Is Network Online
// ============================================================================

/**
 * Verifica se há conexão de rede
 *
 * @returns true se online, false se offline
 *
 * @example
 * ```typescript
 * if (!isNetworkOnline()) {
 *   toast.error('Sem conexão com a internet');
 *   return;
 * }
 * ```
 */
export function isNetworkOnline(): boolean {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}
