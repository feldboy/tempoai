export const getAppUrl = () => {
  return import.meta.env.VITE_PUBLIC_URL || window.location.origin;
};

export const createRoomUrl = (roomId: string) => {
  return `${getAppUrl()}/room/${roomId}`;
};
