export default defineEventHandler(async (event) => {
  const id = event.context.params.id
  const res = event.context.prisma.category.delete({
    where: { id }
  })
  return res
})
