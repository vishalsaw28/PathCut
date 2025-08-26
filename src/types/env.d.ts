declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI: string;
    BASE_URL: string;
    PORT?: string;
  }
}
