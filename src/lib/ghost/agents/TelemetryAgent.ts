import { BaseAgent } from './BaseAgent';
import { execSync } from 'child_process';
import os from 'os';

export class TelemetryAgent extends BaseAgent {
  constructor() {
    super('TelemetryAgent');
  }

  async run(): Promise<void> {
    this.log('Starting Telemetry Heartbeat...');

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const loop = async () => {
      try {
        // Calculate CPU
        const cpus = os.cpus();
        const load = cpus.reduce((acc, cpu) => acc + cpu.times.user + cpu.times.sys, 0) / cpus.reduce((acc, cpu) => acc + Object.values(cpu.times).reduce((a, b) => a + b), 0);
        const cpuPercent = Math.round(load * 100);

        // Calculate RAM
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const ramPercent = Math.round(((totalMem - freeMem) / totalMem) * 100);

        // Generate mock interaction count based on active agents (for visual effect)
        const interactions = Math.floor(Math.random() * 10) + 1;

        const payload = {
          cpu: `${cpuPercent}%`,
          ram: `${ramPercent}%`,
          interactions,
          level: 'info',
          message: 'System Ping'
        };

        const res = await fetch(`${siteUrl}/api/telemetry`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          this.log(`Ping sent: CPU ${cpuPercent}%, RAM ${ramPercent}%`);
        } else {
          this.error(`Ping failed: ${res.statusText}`);
        }
      } catch (err) {
        this.error('Telemetry ping error', err);
      }
    };

    // Run once immediately
    await loop();

    // Then run every 30 seconds
    setInterval(loop, 30000);
  }
}
