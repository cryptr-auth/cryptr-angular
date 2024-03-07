/**
 * Result of tokens response
 */
export interface Tokens {
  /** is token response returns sucessfully */
  valid: boolean;
  /** access token value */
  accessToken?: string;
}

/** @ignore */
export interface AuthResponseError {
  field: string;
  message: string;
}

/**
 * Cryptr User simplest representation
 */
export interface User {
  /** email of end user */
  email: string;
}
