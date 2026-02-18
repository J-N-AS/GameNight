'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ScenarioOutputSchema = z.object({
  scenario: z.string().describe('A short, absurd or funny scenario in Norwegian.'),
  question: z.string().describe('A question related to the scenario, in Norwegian.'),
  playerPrompt: z.string().describe('A prompt for a player that includes the {player} placeholder, in Norwegian.'),
});
export type ScenarioOutput = z.infer<typeof ScenarioOutputSchema>;

export async function getScenario(): Promise<ScenarioOutput> {
  return scenarioFlow();
}

const scenarioPrompt = ai.definePrompt({
  name: 'scenarioGeneratorPrompt',
  output: { schema: ScenarioOutputSchema },
  prompt: `You are a fun and creative game master for a party game.
Your task is to generate a single, absurd, funny, or thought-provoking scenario.
Then, formulate a question related to the scenario.
Finally, create a prompt for a player.

Your response MUST be in JSON format.

All text must be in Norwegian.
Keep it short and suitable for a party setting.
The question should often start with 'Hva...'.
The player prompt must include the placeholder \`{player}\`.

Example:
{
  "scenario": "Du har byttet kropp med kjæledyret ditt for en dag.",
  "question": "Hva er det første du gjør?",
  "playerPrompt": "{player}, fortell oss planen din!"
}`,
});

const scenarioFlow = ai.defineFlow(
  {
    name: 'scenarioFlow',
    outputSchema: ScenarioOutputSchema,
  },
  async () => {
    const { output } = await scenarioPrompt();
    if (!output) {
      throw new Error('AI did not return a valid scenario.');
    }
    return output;
  }
);
