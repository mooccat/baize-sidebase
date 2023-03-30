import { chat } from '~/utils/chat'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    const data = await chat(body)
    return { data }
  } catch (error) {
    console.log(error)
  }
})
