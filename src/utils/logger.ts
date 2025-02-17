const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log("[DEBUG]", ...args);
    }
  },
  error: (...args: any[]) => {
    console.error("[ERROR]", ...args);
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info("[INFO]", ...args);
    }
  },
};
