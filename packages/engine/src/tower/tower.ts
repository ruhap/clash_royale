import type { Values, Vec2 } from '@game/shared';
import { Entity } from '../entity';
import type { StateMachine } from '../utils/state-machine';
import type { Player } from '../player/player';
import StateMachineBuilder from '../utils/state-machine';
import { TowerIdleState } from './states/idle-state';
import { Interceptable, type inferInterceptor } from '../utils/interceptable';

export type TowerBlueprint = {
  id: string;
  attack: number;
  attackRange: number;
  health: number;
};

const TOWER_STATES = {
  IDLE: 'idle'
} as const;

export type TowerState = Values<typeof TOWER_STATES>;

export type TowerInterceptor = Tower['interceptors'];

export class Tower extends Entity {
  private stateMachine: StateMachine<Tower, TowerState>;

  private pos: Vec2;

  private readonly blueprint: TowerBlueprint;

  readonly player: Player;

  health: number;

  constructor({
    position,
    blueprint,
    player
  }: {
    position: Vec2;
    blueprint: TowerBlueprint;
    player: Player;
  }) {
    super(blueprint.id);
    this.player = player;
    this.blueprint = blueprint;
    this.pos = position;
    this.health = this.blueprint.health;
    this.stateMachine = new StateMachineBuilder<Tower>()
      .add(TOWER_STATES.IDLE, new TowerIdleState())
      .build(this, TOWER_STATES.IDLE);
  }

  private interceptors = {
    attack: new Interceptable<number, Tower>(),
    attackRange: new Interceptable<number, Tower>()
  };

  get attack(): number {
    return this.interceptors.attack.getValue(this.blueprint.attack, this);
  }

  get attackRange(): number {
    return this.interceptors.attackRange.getValue(this.blueprint.attackRange, this);
  }

  get maxHealth() {
    return this.blueprint.health;
  }

  update(delta: number) {
    this.stateMachine.update(delta);
  }

  addInterceptor<T extends keyof TowerInterceptor>(
    key: T,
    interceptor: inferInterceptor<TowerInterceptor[T]>,
    priority?: number
  ) {
    this.interceptors[key].add(interceptor as any, priority);
    return () => this.removeInterceptor(key, interceptor);
  }

  removeInterceptor<T extends keyof TowerInterceptor>(
    key: T,
    interceptor: inferInterceptor<TowerInterceptor[T]>
  ) {
    this.interceptors[key].remove(interceptor as any);
  }
}
