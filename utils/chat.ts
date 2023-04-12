
import { Duplex, Readable } from 'stream'
import axios from 'axios'
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser'
import { fetch } from 'undici'

export interface IMessage {
    role: 'system' | 'user' |'assistant',
    content: string
}
const apiKey = process.env.OPENAPI_KEY
export const chat = async (
  messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Who won the world series in 2020?' }
  ]
) => {
  const res = await axios.post(
    'https://chat.fishliu.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.6,
      stream: false
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    }
  )
  return res.data
}

export const chatByStream = async (messages = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Who won the world series in 2020?' }
]) => {
  const res = await fetch(
    'https://chat.fishliu.com/v1/chat/completions',
    {
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.6,
        stream: true
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      method: 'POST'
    }
  )
  return res
}

export const parseOpenAIStream = (rawResponse: Response) => {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const stream = new ReadableStream({
    async start (controller) {
      const streamParser = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data
          if (data === '[DONE]') {
            controller.close()
            return
          }
          try {
            // response = {
            //   id: 'chatcmpl-6pULPSegWhFgi0XQ1DtgA3zTa1WR6',
            //   object: 'chat.completion.chunk',
            //   created: 1677729391,
            //   model: 'gpt-3.5-turbo-0301',
            //   choices: [
            //     { delta: { content: '你' }, index: 0, finish_reason: null }
            //   ],
            // }
            const json = JSON.parse(data)
            const text = json.choices[0].delta?.content || ''
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          } catch (e) {
            controller.error(e)
          }
        }
      }

      const parser = createParser(streamParser)
      for await (const chunk of rawResponse.body as any) {
        parser.feed(decoder.decode(chunk))
      }
    }
  })

  return stream
}

export const parseOpenAIStreamToRes = async (rawResponse: Response) => {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const stream = new Duplex({
    write (chunk, encoding, callback) {
      console.log(chunk)
      callback()
    },
    read () {

    }
  })

  const streamParser = (event: ParsedEvent | ReconnectInterval) => {
    if (event.type === 'event') {
      const data = event.data
      if (data === '[DONE]') {
        return
      }
      try {
        const json = JSON.parse(data)
        const text = json.choices[0].delta?.content || ''
        const queue = encoder.encode(text)
        stream.write(queue)
      } catch (e) {
        // controller.error(e)
      }
    }
  }

  const parser = createParser(streamParser)
  for await (const chunk of rawResponse.body as any) {
    parser.feed(decoder.decode(chunk))
  }
  return stream
}
