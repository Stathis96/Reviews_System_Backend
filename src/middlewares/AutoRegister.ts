import { User } from 'src/types/entities/User'
import { CustomContext } from 'src/types/interfaces/CustomContext'
import { MiddlewareFn } from 'type-graphql'

export const AutoRegister: MiddlewareFn<CustomContext> = async ({ context }, next) => {
  if (context.state.user !== undefined) {
    const em = context.em
    const userData = context.state.user

    const logged = await em.findOne(User, userData.sub)

    let user = logged
    if (!logged) {
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

    context.user = user as User
  }
  await next()
}
