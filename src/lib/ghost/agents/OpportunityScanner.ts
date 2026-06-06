import { BaseAgent } from './BaseAgent';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class OpportunityScanner extends BaseAgent {
  constructor() {
    super('OpportunityScanner');
  }

  async run(): Promise<void> {
    this.log('Starting opportunity scan...');

    if (!this.config.GEMINI_API_KEY) {
      this.error('No Gemini API key found in configuration');
      return;
    }

    const genAI = new GoogleGenerativeAI(this.config.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a money-making opportunity researcher. Find REAL, CURRENT opportunities from the last 48 hours. 

REPORT SPECIFIC FINDINGS FOR:
1. **Top Freelance Skills in Demand** — What clients are paying RIGHT NOW. Include rates.
2. **Active Hiring Gigs** — Specific platforms/groups hiring. Include links.
3. **AI Monetization** — Ways people make money with AI agents/automation.
4. **Referral Bonuses** — Apps/banks with signup bonuses and amounts.
5. **Learn-to-Earn** — Active Coinbase Earn, Binance, Layer3, Galxe campaigns.
6. **Data/AI Training** — Outlier, DataAnnotation, Remotasks current rates.
7. **Quick Side Hustles** — Fastest ways to make $50-200/day online.

End with: **TOP 3 TO START TODAY** — ranked by effort-to-reward.

RULES:
- Only REAL opportunities with verifiable links
- NO scams, NO deposits, NO 'guaranteed returns', NO MLM
- Be specific with dollar amounts
- Skip categories with no fresh news`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      this.log('Scan complete. Opportunity found:');
      console.log(text.substring(0, 500) + '...');

      // In a real scenario, we'd send this to Telegram or save to DB
      // For now, we're graduating the logic to TypeScript
    } catch (err) {
      this.error('Failed to generate opportunity scan', err);
    }
  }
}
