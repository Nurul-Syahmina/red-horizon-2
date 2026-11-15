import { INITIAL_RESOURCES } from '../data/missions.js';

export class ResourceManager {
  constructor() { this.values = { ...INITIAL_RESOURCES }; }
  deduct(resource, amount = 15) {
    if (!Object.hasOwn(this.values, resource)) throw new Error(`Unknown resource: ${resource}`);
    this.values[resource] = Math.max(0, Math.min(100, this.values[resource] - amount));
    return this.values[resource];
  }
  reset() { this.values = { ...INITIAL_RESOURCES }; }
  snapshot() { return { ...this.values }; }
}
