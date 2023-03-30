
import axios from 'axios'
const apiKey = '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'
const chat = async (
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
  console.log(res.data)
  return res.data.choices[0].message
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = await chat(body)
  return { data }
})
