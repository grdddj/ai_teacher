import { analyzeGoalCompletion } from './utils/analyzeGoalCompletion'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Test scenarios
const testScenarios = {
  math: {
    goal: 'Solve 3 different quadratic equations of type ax^2 + bx + c using discriminant',
    messages: [
      {
        role: 'system' as const,
        content:
          'Welcome! Your goal: Solve 3 different quadratic equations of type ax^2 + bx + c using discriminant',
        timestamp: new Date('2024-01-01T10:00:00'),
      },
      {
        role: 'user' as const,
        content: 'John: Hi, I need to solve quadratic equations',
        timestamp: new Date('2024-01-01T10:01:00'),
      },
      {
        role: 'user' as const,
        content: 'John: For x^2 + 5x + 6 = 0, I calculate discriminant: b^2 - 4ac = 25 - 24 = 1',
        timestamp: new Date('2024-01-01T10:02:00'),
      },
      {
        role: 'user' as const,
        content: 'John: So x = (-5 ± 1) / 2, which gives x = -2 or x = -3',
        timestamp: new Date('2024-01-01T10:03:00'),
      },
      {
        role: 'user' as const,
        content: 'John: Second equation: 2x^2 - 4x + 2 = 0',
        timestamp: new Date('2024-01-01T10:04:00'),
      },
      {
        role: 'user' as const,
        content: 'John: Discriminant = 16 - 16 = 0, so x = 1 (double root)',
        timestamp: new Date('2024-01-01T10:05:00'),
      },
    ],
  },

  linear_vs_quadratic: {
    goal: 'Explain the difference between linear and quadratic equations',
    messages: [
      {
        role: 'system' as const,
        content:
          'Welcome! Your goal: Explain the difference between linear and quadratic equations',
        timestamp: new Date('2024-01-01T10:00:00'),
      },
      {
        role: 'user' as const,
        content: 'Alice: I think linear equations have x and quadratic have x^2',
        timestamp: new Date('2024-01-01T10:01:00'),
      },
      {
        role: 'user' as const,
        content: 'Alice: Linear equations make straight lines when graphed',
        timestamp: new Date('2024-01-01T10:02:00'),
      },
      {
        role: 'user' as const,
        content: 'Alice: And quadratic equations make parabolas',
        timestamp: new Date('2024-01-01T10:03:00'),
      },
      {
        role: 'user' as const,
        content:
          'Alice: Linear has at most 1 solution, quadratic can have 0, 1, or 2 real solutions',
        timestamp: new Date('2024-01-01T10:04:00'),
      },
    ],
  },

  off_topic: {
    goal: 'Solve 3 different quadratic equations of type ax^2 + bx + c using discriminant',
    messages: [
      {
        role: 'system' as const,
        content:
          'Welcome! Your goal: Solve 3 different quadratic equations of type ax^2 + bx + c using discriminant',
        timestamp: new Date('2024-01-01T10:00:00'),
      },
      {
        role: 'user' as const,
        content: 'Bob: Hey what did you think about the game yesterday?',
        timestamp: new Date('2024-01-01T10:01:00'),
      },
      {
        role: 'user' as const,
        content: 'Bob: I really liked the new movie that came out',
        timestamp: new Date('2024-01-01T10:02:00'),
      },
      {
        role: 'user' as const,
        content: 'Bob: Oh wait, we need to do math',
        timestamp: new Date('2024-01-01T10:03:00'),
      },
      {
        role: 'user' as const,
        content: 'Bob: What was a quadratic equation again?',
        timestamp: new Date('2024-01-01T10:04:00'),
      },
    ],
  },

  history: {
    goal: 'Answer 3 questions about Karel IV: 1. When was Karel IV living? 2. How many wives did he have? 3. Who was his successor on the throne?',
    messages: [
      {
        role: 'system' as const,
        content:
          'Welcome! Your goal: Answer 3 questions about Karel IV: 1. When was Karel IV living? 2. How many wives did he have? 3. Who was his successor on the throne?',
        timestamp: new Date('2024-01-01T10:00:00'),
      },
      {
        role: 'user' as const,
        content: 'Peter: Karel IV lived from 1316 to 1378',
        timestamp: new Date('2024-01-01T10:01:00'),
      },
      {
        role: 'user' as const,
        content: 'Peter: He was the Holy Roman Emperor and King of Bohemia',
        timestamp: new Date('2024-01-01T10:02:00'),
      },
      {
        role: 'user' as const,
        content: 'Peter: I think he had 4 wives during his lifetime',
        timestamp: new Date('2024-01-01T10:03:00'),
      },
      {
        role: 'user' as const,
        content: 'Peter: His first wife was Blanche of Valois',
        timestamp: new Date('2024-01-01T10:04:00'),
      },
      {
        role: 'user' as const,
        content: 'Peter: His successor was his son Wenceslaus IV (Václav IV)',
        timestamp: new Date('2024-01-01T10:05:00'),
      },
      {
        role: 'user' as const,
        content: 'Peter: Wenceslaus became King of Bohemia and later Holy Roman Emperor',
        timestamp: new Date('2024-01-01T10:06:00'),
      },
    ],
  },

  complete: {
    goal: 'Solve 3 different quadratic equations of type ax^2 + bx + c using discriminant',
    messages: [
      {
        role: 'system' as const,
        content:
          'Welcome! Your goal: Solve 3 different quadratic equations of type ax^2 + bx + c using discriminant',
        timestamp: new Date('2024-01-01T10:00:00'),
      },
      {
        role: 'user' as const,
        content: 'Sarah: First equation: x^2 - 4x + 3 = 0',
        timestamp: new Date('2024-01-01T10:01:00'),
      },
      {
        role: 'user' as const,
        content: 'Sarah: Discriminant = 16 - 12 = 4, so x = (4 ± 2) / 2 = 3 or 1',
        timestamp: new Date('2024-01-01T10:02:00'),
      },
      {
        role: 'user' as const,
        content: 'Sarah: Second: 2x^2 + 3x - 2 = 0',
        timestamp: new Date('2024-01-01T10:03:00'),
      },
      {
        role: 'user' as const,
        content: 'Sarah: Discriminant = 9 + 16 = 25, x = (-3 ± 5) / 4 = 0.5 or -2',
        timestamp: new Date('2024-01-01T10:04:00'),
      },
      {
        role: 'user' as const,
        content: 'Sarah: Third: x^2 + 2x + 1 = 0',
        timestamp: new Date('2024-01-01T10:05:00'),
      },
      {
        role: 'user' as const,
        content: 'Sarah: Discriminant = 4 - 4 = 0, x = -1 (double root)',
        timestamp: new Date('2024-01-01T10:06:00'),
      },
      {
        role: 'user' as const,
        content: 'Sarah: All three equations solved using the discriminant method!',
        timestamp: new Date('2024-01-01T10:07:00'),
      },
    ],
  },
}

async function runTest(scenarioName: string) {
  const scenario = testScenarios[scenarioName as keyof typeof testScenarios]
  if (!scenario) {
    console.error(`❌ Scenario "${scenarioName}" not found`)
    console.log('Available scenarios:', Object.keys(testScenarios).join(', '))
    return
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(`Testing: ${scenarioName}`)
  console.log(`Goal: ${scenario.goal}`)
  console.log(`${'='.repeat(60)}\n`)

  console.log('Messages:')
  scenario.messages.forEach((msg, i) => {
    if (msg.role === 'system') {
      console.log(`  [${i}] 📢 System: ${msg.content.substring(0, 50)}...`)
    } else {
      console.log(`  [${i}] 💬 ${msg.content}`)
    }
  })

  console.log('\n⏳ Analyzing goal completion...\n')

  try {
    const result = await analyzeGoalCompletion(scenario.goal, scenario.messages)

    console.log('📊 Results:')
    console.log(`  Completion: ${result.completion}%`)
    console.log(
      `  Progress bar: [${'█'.repeat(Math.floor(result.completion / 10))}${'░'.repeat(10 - Math.floor(result.completion / 10))}]`
    )
    console.log(`  Message: ${result.text}`)
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

async function runAllTests() {
  for (const scenario of Object.keys(testScenarios)) {
    await runTest(scenario)
    console.log('\n')
  }
}

// Check if API key is configured
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY is not set in .env file')
  console.log('Please add ANTHROPIC_API_KEY=your-key-here to your .env file')
  process.exit(1)
}

// Parse command line arguments
const args = process.argv.slice(2)

if (args.length === 0) {
  console.log('Usage: bun run server/test-goal-analysis.ts [scenario-name|all]')
  console.log('Available scenarios:', Object.keys(testScenarios).join(', '), 'all')
  console.log('\nExample: bun run server/test-goal-analysis.ts math')
  console.log('Example: bun run server/test-goal-analysis.ts all')
} else if (args[0] === 'all') {
  runAllTests()
} else {
  runTest(args[0])
}
