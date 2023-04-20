import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
export const dictRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const dicts = await ctx.prisma.dict.findMany()
    return dicts
  }),
  create: publicProcedure.input(
    z.object({
      dict_code: z.string().min(1).max(255),
      dict_desc: z.string().min(1).max(255)
    })
  ).mutation(async ({ ctx, input }) => {
    const dict = await ctx.prisma.dict.create({
      data: {
        dict_code: input.dict_code,
        dict_desc: input.dict_desc
      }
    })
    return dict
  })
})
