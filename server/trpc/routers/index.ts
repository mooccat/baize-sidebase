import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { userRouter } from './user'
import { dictRouter } from './dict'

export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string().nullish()
      })
    )
    .query(({ ctx, input }) => {
      return {
        greeting: `hello1 ${input?.text ?? 'world'}`,
        time: new Date()
      }
    }),
  example: publicProcedure.query(({ ctx }) => { return { greeting: ctx.prisma.example.findMany() } }),
  user: userRouter,
  dict: dictRouter
})

// export type definition of API
export type AppRouter = typeof appRouter;
