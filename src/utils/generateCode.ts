import shortid from "shortid";

/**
 * Generates a unique short code for a URL.
 * You can later replace this with a custom algorithm.
 */
export const generateCode = (): string => {
  return shortid.generate();
};
