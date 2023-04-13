import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
export const userRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany()
    return users
  }),
  create: publicProcedure.input(
    z.object({
      name: z.string().min(1).max(255),
      email: z.string().email().min(1).max(255),
      password: z.string().min(1).max(255)
    })
  ).mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: input.password,
        nickname: input.name
      }
    })
    return user
  })
})
