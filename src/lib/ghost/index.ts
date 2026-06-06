import { GhostCore } from './core/engine';
import { OpportunityScanner } from './agents/OpportunityScanner';
import { AirdropScanner } from './agents/AirdropScanner';
import { TelemetryAgent } from './agents/TelemetryAgent';

const engine = new GhostCore();

const command = process.argv[2];
const args = process.argv.slice(3);

async function main() {
  switch (command) {
    case 'sync':
      const syncResult = await engine.sync();
      if (!syncResult.success) {
        console.error(`❌ ${syncResult.message}`);
        process.exit(1);
      }
      console.log(`✅ ${syncResult.message}`);
      break;

    case 'save':
      const message = args.join(' ');
      const saveResult = await engine.save(message);
      if (!saveResult.success) {
        console.error(`❌ ${saveResult.message}`);
        process.exit(1);
      }
      console.log(`✅ ${saveResult.message}`);
      break;

    case 'sync-pc':
      const syncPcResult = await engine.syncPc();
      if (!syncPcResult.success) {
        console.error(`❌ ${syncPcResult.message}`);
        process.exit(1);
      }
      console.log(`✅ ${syncPcResult.message}`);
      break;

    case 'scan':
      const scanner = new OpportunityScanner();
      await scanner.run();
      break;

    case 'airdrop':
      const airdrop = new AirdropScanner();
      await airdrop.run();
      break;

    case 'heartbeat':
      const telemetry = new TelemetryAgent();
      await telemetry.run();
      break;

    default:
      console.log('Ghost Engine CLI');
      console.log('Usage: ghost <command> [args]');
      console.log('Commands: sync, sync-pc, save, scan, airdrop, heartbeat');
      process.exit(1);
  }
}

main();
