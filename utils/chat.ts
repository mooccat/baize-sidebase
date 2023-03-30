import axios from 'axios'
const apiKey = ''
export interface IMessage {
    role: 'system' | 'user' |'assistant',
    content: string
}
const chat = async (
  messages:IMessage[] = [
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
  return res.data
}
