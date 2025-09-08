import { supabase } from './index'
import * as dotenv from 'dotenv'

dotenv.config()

const sampleGroups = [
  {
    owner_id: 'teacher_1',
    name: 'A2 - quadratic equations 1',
    description:
      'solve independently 3 different quadratic equations of type ax^2 + bx + c using discriminant',
  },
  {
    owner_id: 'teacher_1',
    name: 'B3 - linear algebra basics',
    description:
      'understand vector operations and solve systems of linear equations with 2-3 variables',
  },
  {
    owner_id: 'teacher_2',
    name: 'C1 - trigonometry fundamentals',
    description:
      'calculate sine, cosine, and tangent values for basic angles and apply to right triangles',
  },
  {
    owner_id: 'teacher_1',
    name: 'A3 - polynomial functions',
    description:
      'identify polynomial degree, find roots, and sketch graphs of quadratic and cubic functions',
  },
  {
    owner_id: 'teacher_3',
    name: 'D2 - statistics and probability',
    description: 'calculate mean, median, mode, and basic probability for simple events',
  },
  {
    owner_id: 'teacher_2',
    name: 'B1 - geometry proofs',
    description: 'prove congruence of triangles using SSS, SAS, ASA methods',
  },
]

async function seed() {
  try {
    console.log('🌱 Starting database seed...')

    console.log('📝 Deleting existing groups...')
    const { error: deleteError } = await supabase
      .from('groups')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all rows

    if (deleteError) {
      console.log('ℹ️  Delete error (table might be empty):', deleteError.message)
    }

    console.log('🔄 Inserting sample groups...')
    const { data: insertedGroups, error: insertError } = await supabase
      .from('groups')
      .insert(sampleGroups)
      .select()

    if (insertError) {
      throw insertError
    }

    console.log(`✅ Successfully seeded ${insertedGroups?.length || 0} groups:`)
    insertedGroups?.forEach((group, index) => {
      console.log(`   ${index + 1}. ${group.name} (Owner: ${group.owner_id})`)
    })

    console.log('🎉 Database seeding completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
