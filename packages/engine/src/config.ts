export type Config = typeof config;
export type ConfigKey = keyof typeof config;

export const config = {
  DEBUG: true,
  TOWER_WIDTH: 1,
  TOWER_HEIGHT: 1,
  OUTER_TOWER_RANGE: 3,
  OUTER_TOWER_HEALTH: 500,
  OUTER_TOWER_ATTACK: 10,
  INNER_TOWER_RANGE: 3,
  INNER_TOWER_ATTACK: 15,
  INNER_TOWER_HEALTH: 800
} as const;