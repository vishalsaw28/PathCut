import shortid from "shortid";

export const generateCode = (): string => {
  return shortid.generate();
};
