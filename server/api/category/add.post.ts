export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log(body)
  const a = await event.context.prisma._getDmmf()
  console.log(a)
  const res = event.context.prisma.category.create({
    data: {
      name: body.name,
      description: body.description
    }
  })
  return res
})
