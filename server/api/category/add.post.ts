export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log(body)
  const res = event.context.prisma.category.create({
    data: {
      name: body.name,
      description: body.description
    }
  })
  return res
})
