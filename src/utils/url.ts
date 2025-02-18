import { logger } from "./logger";

export const getAppUrl = (): string => {
  // For Vercel deployments, use VITE_PUBLIC_URL if available
  const url = import.meta.env.VITE_PUBLIC_URL || window.location.origin;

  // Remove trailing slash if present
  const cleanUrl = url.replace(/\/$/, "");

  logger.debug("App URL:", cleanUrl);
  return cleanUrl;
};

export const createRoomUrl = (roomId: string): string => {
  if (!roomId) {
    logger.error("Room ID is required");
    throw new Error("Room ID is required");
  }

  const url = `${getAppUrl()}/room/${roomId}`;
  logger.debug("Room URL:", url);
  return url;
};
