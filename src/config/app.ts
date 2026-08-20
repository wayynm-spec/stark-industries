export const appConfig = {
  name: "Stark Industries",
  tagline: "Build. Automate. Create. Sell. Scale.",
  description: "Digital ecosystem for creators, entrepreneurs, and businesses",
  version: "0.0.1",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};

export const products = {
  STARK_ID: "stark-id",
  STARK_ONE: "stark-one",
  NOVA: "nova",
  FLOW: "flow",
  FORGE: "forge",
  MARKET: "market",
  CLOUD: "cloud",
  CREATOR: "creator",
  BUSINESS: "business",
  AUTOMATE: "automate",
  CONNECT: "connect",
  LEARN: "learn",
  DEV: "dev",
  SHIELD: "shield",
} as const;

export const routes = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
  PROFILE: "/profile",
  APPS: "/apps",
  SEARCH: "/search",
  NOTIFICATIONS: "/notifications",
} as const;
