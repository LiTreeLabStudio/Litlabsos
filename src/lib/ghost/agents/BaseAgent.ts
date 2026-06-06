import { GhostConfig, loadConfig } from '../core/config';

export abstract class BaseAgent {
  protected config: GhostConfig;
  protected name: string;

  constructor(name: string) {
    this.name = name;
    this.config = loadConfig();
  }

  abstract run(): Promise<void>;

  protected log(message: string) {
    console.log(`[${this.name}] ${message}`);
  }

  protected error(message: string, err?: unknown) {
    console.error(`❌ [${this.name}] ${message}`, err || '');
  }
}
