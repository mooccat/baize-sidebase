export default defineEventHandler((event) => {
  const key = event.context.params.key
  return event.context.prisma.template.findUnique({
    select: {
      name: true,
      description: true,
      key: true
    },
    where: {
      key
    }
  })
})
