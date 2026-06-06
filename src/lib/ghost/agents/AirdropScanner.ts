import { BaseAgent } from './BaseAgent';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class AirdropScanner extends BaseAgent {
  constructor() {
    super('AirdropScanner');
  }

  async run(): Promise<void> {
    this.log('Starting airdrop & free crypto scan...');

    if (!this.config.GEMINI_API_KEY) {
      this.error('No Gemini API key found in configuration');
      return;
    }

    const genAI = new GoogleGenerativeAI(this.config.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a crypto airdrop researcher. Find LEGITIMATE, ACTIVE airdrops and free crypto. 

REPORT SPECIFIC FINDINGS FOR:
1. **Active Token Airdrops** — Currently live, NO deposit. Include: Project, What to do, Estimated reward, Link, Chain.
2. **Testnet Rewards** — Testnets that may reward early users. What to do on each.
3. **Points Programs** — DeFi protocols with active points. How to earn.
4. **Learn-to-Earn** — Coinbase Earn, Binance, Layer3, Galxe active campaigns.
5. **Ambassador Programs** — Projects paying community managers. Compensation.
6. **Free NFT Mints** — Gas-only mints on L2s. Chain, cost, potential value.
7. **Retroactive Targets** — Hot protocols without tokens yet. What to do NOW.

End with: **BEST 3 CLAIMS TODAY** — ranked by potential value vs effort.

CRITICAL RULES:
- NEVER include anything requiring a deposit or purchase
- NEVER include mining platforms
- SKIP anything that looks like a scam
- Only real teams with verifiable info
- Be specific with steps and links`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      this.log('Scan complete. Airdrops found:');
      console.log(text.substring(0, 500) + '...');

      // In a real scenario, we'd send this to Telegram or save to DB
    } catch (err) {
      this.error('Failed to generate airdrop scan', err);
    }
  }
}
