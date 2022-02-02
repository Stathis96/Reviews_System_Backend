import { EntityManager } from '@mikro-orm/core'

import { User } from 'src/types/entities/User'

export async function getUsersAction (em: EntityManager): Promise<User[]> {
  return await em.find(User, {}, ['interviews', 'interns', 'reviews'])
}
