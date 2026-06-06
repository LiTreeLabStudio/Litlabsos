import { GhostCore } from './core/engine';
import { OpportunityScanner } from './agents/OpportunityScanner';

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

    case 'scan':
      const scanner = new OpportunityScanner();
      await scanner.run();
      break;

    default:
      console.log('Ghost Engine CLI');
      console.log('Usage: ghost <command> [args]');
      console.log('Commands: sync, save');
      process.exit(1);
  }
}

main();
