import { EntityManager } from '@mikro-orm/core'
import { Next } from 'koa'
import { CustomContext } from 'src/types/interfaces/CustomContext'

import { User } from 'src/types/entities/User'

export function AutoRegister (em: EntityManager): (ctx: CustomContext, next: Next) => Promise<void> {
  // console.log('autoregister')
  return async (ctx: CustomContext, next: Next) => {
    // console.log('ctx', ctx.state)
    if (ctx.state.user !== undefined) {
      const userData = ctx.state.user

      const logged = await em.findOne(User, userData.sub)

      let user = logged
      if (logged == null) {
        user = em.create(User, {
          id: userData.sub,
          email: userData.email,
          name: userData.name
        })

        await em.persistAndFlush(user)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        user!.name = logged.name
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        user!.email = logged.email

        await em.flush()
      }

      ctx.user = user as User
      // console.log('custom user', ctx.user)
    }
    await next()
  }
}
