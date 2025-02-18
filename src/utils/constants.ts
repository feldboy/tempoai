export const BASE_URL = window.location.origin;

export const ROUTES = {
  HOME: "/",
  SIGNIN: "/signin",
  ROOM: (id: string) => `/room/${id}`,
};

export const getFullUrl = (path: string) => {
  return `${BASE_URL}${path}`;
};
