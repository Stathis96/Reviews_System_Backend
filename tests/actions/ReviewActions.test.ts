import '../dbSetup'
import { EntityManager } from '@mikro-orm/core'
import { getConnection } from '../createConnection'

import { v4 } from 'uuid'
import { createReviewAction, deleteReviewAction, getReviewsAction, getReviewsByStatusAction, getReviewsOfActiveInternsAction, updateReviewAction } from 'src/lib/actions/ReviewActions'
import { User } from 'src/types/entities/User'
import { Review } from 'src/types/entities/Review'

import { Position } from 'src/types/enums/Position'
import { InternStatus } from 'src/types/enums/InternStatus'
import { Intern } from 'src/types/entities/Intern'

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
    email: String(Math.floor(Math.random() * 10000 + 1)) + 'newmail@gmail.com',
    position: Position.STORES
  })

  await em.persistAndFlush(user)
  return user
}

async function createBasicIntern (fullname = 'Mister'): Promise<Intern> {
  const user = await createBasicUser()

  const intern = em.create(Intern, {
    id: v4(),
    fullname: fullname + String(Math.floor(Math.random() * 1000 + 1)),
    email: String(Math.floor(Math.random() * 10000 + 1)) + 'newmail@gmail.com',
    dateOfBirth: '1997-05-10 10:00:00',
    position: Position.MARKETING,
    school: 'FineSchool',
    academicYear: '2016-05-10 10:00:00',
    hiredAt: '2020-01-01 10:00:00',
    endInternship: '2020-06-06 10:00:00',
    internStatus: InternStatus.DISMISSED,
    supervisor: user
  })
  await em.persistAndFlush(intern)
  return intern
}

async function createBasicReview (): Promise<Review> {
  const user = await createBasicUser()
  const intern = await createBasicIntern()

  const review = em.create(Review, {
    id: v4(),
    intern: intern,
    supervisor: user,
    initiative: 3,
    cooperation: 2,
    performance: 2,
    consistency: 3,
    total: 4,
    createdAt: new Date()
  })
  await em.persistAndFlush(review)
  return review
}

describe('ReviewActions : getReviewAction', () => {
  test('empty', async () => {
    expect.assertions(1)
    const result = await getReviewsAction(em)

    expect(result).toHaveLength(0)
  })
  test('return all', async () => {
    expect.assertions(1)

    await createBasicReview()
    await createBasicReview()
    await createBasicReview()

    const result = await getReviewsAction(em)

    expect(result).toHaveLength(3)
  })
})

describe('ReviewActions : getReviewsOfActiveInternsAction', () => {
  test('fetch review for active interns', async () => {
    expect.assertions(1)

    const rev1 = await createBasicReview()
    rev1.intern.internStatus = InternStatus.ACTIVE
    const rev2 = await createBasicReview()
    rev2.intern.internStatus = InternStatus.ACTIVE
    const rev3 = await createBasicReview()
    rev3.intern.internStatus = InternStatus.DISMISSED
    const rev4 = await createBasicReview()
    rev4.intern.internStatus = InternStatus.EMPLOYED
    const result = await getReviewsOfActiveInternsAction(em)

    expect(result).toHaveLength(2)
  })
})

describe('ReviewActions : getReviewsOfInternsAction', () => {
  test('fetch review for interns by status', async () => {
    expect.assertions(2)

    const rev1 = await createBasicReview()
    rev1.intern.internStatus = InternStatus.ACTIVE
    const rev2 = await createBasicReview()
    rev2.intern.internStatus = InternStatus.EMPLOYED
    const rev3 = await createBasicReview()
    rev3.intern.internStatus = InternStatus.DISMISSED
    const rev4 = await createBasicReview()
    rev4.intern.internStatus = InternStatus.EMPLOYED

    const result = await getReviewsByStatusAction('employed', em)

    expect(result[0]).toBe(rev2)
    expect(result).toHaveLength(2)
  })
  test('fetch nothing when criteria is not met', async () => {
    expect.assertions(2)

    const rev1 = await createBasicReview()
    rev1.intern.internStatus = InternStatus.ACTIVE
    const rev2 = await createBasicReview()
    rev2.intern.internStatus = InternStatus.EMPLOYED
    const rev3 = await createBasicReview()
    rev3.intern.internStatus = InternStatus.DISMISSED
    const rev4 = await createBasicReview()
    rev4.intern.internStatus = InternStatus.EMPLOYED

    const result = await getReviewsByStatusAction('standby', em)

    expect(result).toStrictEqual([])
    expect(result).toHaveLength(0)
  })
})

describe('ReviewActions : createReviewAction', () => {
  test('can create review with valid data', async () => {
    expect.assertions(7)
    const user = await createBasicUser()
    const intern = await createBasicIntern()

    const data = {
      internId: intern.id,
      supervisorId: user.id,
      initiative: 3,
      cooperation: 2,
      performance: 2,
      consistency: 3,
      total: 4,
      createdAt: new Date()
    }

    const result = await createReviewAction(data, em)

    expect(await em.find(Intern, {})).toHaveLength(1)
    expect(result.initiative).toBe(data.initiative)
    expect(result.total).toBe(data.total)
    expect(result.intern.id).toStrictEqual(data.internId)
    expect(result.performance).toBe(data.performance)
    expect(result.supervisor.id).toBe(data.supervisorId)
    expect(result.cooperation).toBe(data.cooperation)
  })
})
