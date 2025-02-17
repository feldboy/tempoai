import { logger } from "./logger";

export const getAppUrl = (): string => {
  const url = window.location.origin.includes("localhost")
    ? window.location.origin
    : import.meta.env.VITE_PUBLIC_URL || window.location.origin;

  logger.debug("App URL:", url);
  return url;
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
