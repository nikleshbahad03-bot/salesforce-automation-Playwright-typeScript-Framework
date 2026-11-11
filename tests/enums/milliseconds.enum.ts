export const MilliSeconds = {
  SHORT: 2_000,
  MEDIUM: 5_000,
  LARGE: 10_000,
  XTRALARGE:20_000,
} as const;

export type MilliSeconds = (typeof MilliSeconds)[keyof typeof MilliSeconds];
