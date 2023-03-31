import { Readable } from 'stream'
import { sendStream } from 'h3'
import { chatByStream, parseOpenAIStream } from '~/utils/chat'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    const data = await chatByStream(body)
    return sendStream(event, Readable.from(parseOpenAIStream(data)))
  } catch (error) {
    console.log(error)
  }
})
