const isDevelopment = process.env.NODE_ENV === "development";

export const logUrl = (action: string, url: string) => {
  console.log(`[URL ${action}] ${url}`);
  console.log(`[ENV] NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`[ENV] VITE_PUBLIC_URL: ${import.meta.env.VITE_PUBLIC_URL}`);
};

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
  url: logUrl,
};
