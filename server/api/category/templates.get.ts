export default defineEventHandler(event => event.context.prisma.category.findMany({
  select: {
    id: true,
    name: true,
    templates: {
      select: {
        id: true,
        name: true,
        description: true,
        key: true
      }
    }
  }
}))
