import { analyzeGoalCompletion } from './utils/analyzeGoalCompletion'
import dotenv from 'dotenv'
import * as readline from 'readline'

// Load environment variables
dotenv.config()

// Check if API key is configured
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY is not set in .env file')
  console.log('Please add ANTHROPIC_API_KEY=your-key-here to your .env file')
  process.exit(1)
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function showProgress(result: { completion: number; text: string }) {
  console.log('\n' + '─'.repeat(50))
  const filled = Math.floor(result.completion / 5)
  const empty = 20 - filled
  console.log(`📈 Progress: [${'█'.repeat(filled)}${'░'.repeat(empty)}] ${result.completion}%`)
  console.log(`💬 Feedback: ${result.text}`)
  console.log('─'.repeat(50) + '\n')
}

async function runInteractiveTest() {
  console.log('\n🎯 Interactive Goal Completion Analyzer (Real-time)')
  console.log('='.repeat(50))

  // Get the goal
  const goal = await question('\nEnter the learning goal:\n> ')

  // Collect messages
  const messages: Array<{ role: 'system' | 'user'; content: string; timestamp: Date }> = []

  // Add system welcome message
  messages.push({
    role: 'system',
    content: `Welcome! Your goal: ${goal}`,
    timestamp: new Date(),
  })

  console.log('\n📝 Enter student messages (type "done" to finish, "quit" to exit):')
  console.log('Format: [nickname]: [message]')
  console.log('Example: John: I solved the first equation')
  console.log('\n✨ Progress will be evaluated after each message!\n')

  let messageCount = 1
  while (true) {
    const input = await question(`Message ${messageCount}: `)

    if (input.toLowerCase() === 'done') {
      break
    }

    if (input.toLowerCase() === 'quit') {
      console.log('Goodbye!')
      rl.close()
      process.exit(0)
    }

    if (input.trim()) {
      messages.push({
        role: 'user',
        content: input,
        timestamp: new Date(),
      })

      // Analyze progress after each message
      console.log('\n⏳ Analyzing current progress...')
      try {
        const result = await analyzeGoalCompletion(goal, messages)
        // console.log(result)
        await showProgress(result)

        // Check if goal is completed
        if (result.completion === 100) {
          console.log('🎉 Congratulations! Goal completed!\n')
          const continueChat = await question('Continue adding messages? (yes/no): ')
          if (continueChat.toLowerCase() !== 'yes' && continueChat.toLowerCase() !== 'y') {
            break
          }
        }
      } catch (error) {
        console.error('⚠️ Could not analyze progress:', error)
      }

      messageCount++
    }
  }

  if (messages.length === 1) {
    console.log('\n⚠️  No student messages provided.')
    rl.close()
    return
  }

  // Show final summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Final Analysis:')
  console.log('='.repeat(50))

  try {
    const finalResult = await analyzeGoalCompletion(goal, messages)
    console.log(`\n✅ Final Completion: ${finalResult.completion}%`)

    const filled = Math.floor(finalResult.completion / 5)
    const empty = 20 - filled
    console.log(
      `📈 Progress: [${'█'.repeat(filled)}${'░'.repeat(empty)}] ${finalResult.completion}%`
    )

    console.log(`\n💬 Final Feedback: ${finalResult.text}`)
    console.log('\n' + '='.repeat(50))
  } catch (error) {
    console.error('❌ Error in final analysis:', error)
  }

  // Ask if they want to test again
  const again = await question('\nTest another scenario? (yes/no): ')
  if (again.toLowerCase() === 'yes' || again.toLowerCase() === 'y') {
    await runInteractiveTest()
  } else {
    console.log('Goodbye!')
    rl.close()
  }
}

console.log('\n🚀 Starting Interactive Goal Completion Analyzer...')
runInteractiveTest()
