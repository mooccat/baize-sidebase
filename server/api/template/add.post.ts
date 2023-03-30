export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log(body)
  const res = event.context.prisma.template.create({
    data: {
      name: body.name,
      description: body.description,
      categoryId: body.categoryId,
      prompt: body.prompt
    }
  })
  return res
})
