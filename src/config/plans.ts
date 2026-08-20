export const plans = {
  FREE: {
    name: "Free",
    price: 0,
    features: {
      projects: 3,
      storage: 1000,
      aiMessages: 10,
      productListings: 0,
    },
  },
  PRO: {
    name: "Pro",
    price: 29,
    features: {
      projects: 50,
      storage: 100000,
      aiMessages: 500,
      productListings: 10,
    },
  },
  CREATOR: {
    name: "Creator",
    price: 59,
    features: {
      projects: 100,
      storage: 500000,
      aiMessages: 2000,
      productListings: 100,
    },
  },
  BUSINESS: {
    name: "Business",
    price: 199,
    features: {
      projects: "unlimited" as const,
      storage: "unlimited" as const,
      aiMessages: "unlimited" as const,
      productListings: "unlimited" as const,
      teamMembers: 10,
      advancedAnalytics: true,
    },
  },
} as const;
