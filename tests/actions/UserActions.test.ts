import '../dbSetup'
import { EntityManager } from '@mikro-orm/core'
import { getConnection } from '../createConnection'

import { v4 } from 'uuid'
import { User } from 'src/types/entities/User'
import { Position } from 'src/types/enums/Position'
import { getUsersAction } from 'src/lib/actions/UserActions'

let em: EntityManager
beforeEach(async () => {
  em = (await getConnection()).em.fork()

  await em.begin()
})

afterEach(async () => {
  await em.rollback()
})

async function createBasicUser (name = 'Senior'): Promise<User> {
  const user = em.create(User, {
    id: v4(),
    name: name,
    email: String(Math.floor(Math.random() * 1000 + 1)) + 'newmail@gmail.com',
    position: Position.STORES
  })

  await em.persistAndFlush(user)
  // console.log('usermade:', user)
  return user
}

describe('UserActions : getUsersAction', () => {
  test('can fetch users', async () => {
    expect.assertions(3)

    const user1 = await createBasicUser()
    const user2 = await createBasicUser()
    const user3 = await createBasicUser()

    const result = await getUsersAction(em)
    expect(result[0]).toBe(user1)
    expect(result).toStrictEqual([user1, user2, user3])
    expect(result).toHaveLength(3)
  })
})
