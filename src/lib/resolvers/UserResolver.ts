import { EntityManager } from '@mikro-orm/core'
import { Ctx, Query, Resolver } from 'type-graphql'
import { User } from 'src/types/entities/User'

import { getUsersAction } from '../actions/UserActions'

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async getUsers (
    @Ctx('em') em: EntityManager
  ): Promise<User[]> {
    return await getUsersAction(em)
  }
}
