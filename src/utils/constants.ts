export const ROUTES = {
  HOME: "/",
  SIGNIN: "/signin",
  ROOM: (id: string) => `/room/${id}`,
};

export const getFullUrl = (path: string) => {
  return path;
};
