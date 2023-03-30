import { chat } from '~/utils/chat'
export default defineEventHandler(async (event) => {
  const { templateKey, input } = await readBody(event)
  try {
    const template = await event.context.prisma.template.findUnique({
      select: { prompt: true },
      where: {
        key: templateKey
      }
    })
    const content = template.prompt
    const { choices, usage } = await chat([{
      content,
      role: 'system'
    }, {
      content: input,
      role: 'user'
    }])
    console.log(usage)
    const { message: data } = choices[0]
    const res = await event.context.prisma.chatLog.create({
      data: {
        Template: {
          connect: {
            key: templateKey
          }
        },
        ChatMessage: {
          create: [{
            content,
            role: 'system'
          }, {
            content: input,
            role: 'user',
            prompt_tokens: usage.prompt_tokens,
            completion_tokens: usage.completion_tokens,
            total_tokens: usage.total_tokens
          }]
        }
      }
    })
    console.log(res)
    return { data }
  } catch (error) {
    console.log(error)
  }
})
