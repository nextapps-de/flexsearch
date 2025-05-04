import { Document } from 'flexsearch'
import '../index'

const document = new Document<{
  title: string
  description: string
  tags: string[]
}>({})

async function test() {
  const doc = await document.searchAsync('test', {
    enrich: true,
    pluck: 'test',
  })
}

