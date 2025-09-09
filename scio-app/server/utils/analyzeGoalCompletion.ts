import Anthropic from '@anthropic-ai/sdk'

interface Goal {
  goal: string
  completed: boolean
}

interface AnalysisResult {
  goals?: Goal[]
  completion: number
  text: string
  explanation?: string
}

interface MessageWithRole {
  role: 'system' | 'user'
  content: string
  timestamp?: Date
}

export async function analyzeGoalCompletion(
  goalDescription: string,
  messages: MessageWithRole[]
): Promise<AnalysisResult> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  })

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured')
  }

  const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-20241022'

  const systemPrompt = `You are an educational assistant analyzing student progress toward a learning goal.

Goal: ${goalDescription}

Analyze the conversation and determine:
1. What percentage of the goal has been completed (0-100)
2. Provide an encouraging message that includes the percentage and motivates the student

Consider:
- Quality of understanding shown
- Completeness of work
- Whether key concepts were grasped
- Progress toward the specific goal

How to calculate:
- if there is only one goal, the completion is either 0% or 100%
- if there are multiple goals/steps, divide it into equal parts and assign completion accordingly
- so for 3 questions, assign the completion as either 0%, 33%, 67%, or 100%, based on how many were answered correctly
- also, always mention which parts of the goal are not yet completed

DO NOT:
- mention the correct answer to any question (you can tell that they are getting closer and that the answer is on the right track)

Respond in JSON format:
{
  "goals": <Array[{goal: string, completed: boolean}]>,
  "completion": <number between 0 and 100>,
  "text": "<encouraging message incorporating the percentage>",
  "explanation": "<brief explanation of how you arrived at this conclusion>"
}
and do not include any other text outside the JSON.

Example:

goal: "Learn the capitals of France, Germany, and Italy."
messages:
1. System: "Welcome! Your goal is to learn the capitals of France, Germany, and Italy."
2. User: "I know that the capital of France is Paris."

Response:
{
  "goals": [
    {"goal": "Know the capital of France", "completed": true},
    {"goal": "Know the capital of Germany", "completed": false},
    {"goal": "Know the capital of Italy", "completed": false}
  ],
  "completion": 33,
  "text": "Great start! You've mastered the capital of France. Keep going to learn Germany and Italy's capitals!",
  "explanation": "The student correctly identified France's capital, but did not mention Germany or Italy yet."
}
`

  const formattedMessages = messages
    .map((msg) => {
      if (msg.role === 'system') {
        return `[System Message]: ${msg.content}`
      }
      return `[Student]: ${msg.content}`
    })
    .join('\n\n')

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 1024,
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Here is the conversation to analyze:\n\n${formattedMessages}\n\nProvide your analysis in the requested JSON format.`,
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic API')
    }

    try {
      const result = JSON.parse(content.text) as AnalysisResult

      // Validate the response
      if (
        typeof result.completion !== 'number' ||
        result.completion < 0 ||
        result.completion > 100
      ) {
        throw new Error('Invalid completion percentage')
      }
      if (typeof result.text !== 'string' || !result.text) {
        throw new Error('Invalid text message')
      }

      return result
    } catch {
      console.error('Failed to parse AI response:', content.text)
      // Fallback response
      return {
        completion: 0,
        text: 'Keep working on the goal. You can do it!',
      }
    }
  } catch (error) {
    console.error('Error calling Anthropic API:', error)
    throw new Error('Failed to analyze goal completion')
  }
}
