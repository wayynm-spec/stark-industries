export const featureFlags = {
  NOVA_ENABLED: true,
  FLOW_ENABLED: true,
  FORGE_ENABLED: true,
  MARKET_ENABLED: true,
  CLOUD_ENABLED: false,
  BUSINESS_ENABLED: false,
  CREATOR_ENABLED: false,
  AUTOMATE_ENABLED: false,
  CONNECT_ENABLED: false,
  LEARN_ENABLED: false,
  SHIELD_ENABLED: false,
  DEV_ENABLED: false,
} as const;

export function isFeatureEnabled(feature: keyof typeof featureFlags): boolean {
  return featureFlags[feature];
}
