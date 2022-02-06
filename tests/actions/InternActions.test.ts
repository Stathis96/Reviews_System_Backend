import '../dbSetup'
import { EntityManager } from '@mikro-orm/core'
import { getConnection } from '../createConnection'

import { v4 } from 'uuid'
import { Intern } from 'src/types/entities/Intern'
import { Position } from 'src/types/enums/Position'
import { InternStatus } from 'src/types/enums/InternStatus'
import { User } from 'src/types/entities/User'
import { createInternAction, deleteInternAction, findPercentageOfSuccessfulInterns, findPercentageOfSuccessfulInternsPerPeriod, getInternByIdAction, getInternsAction, getInternsByStatusAction, updateInternAction, updateInternActionOnlyStatus } from 'src/lib/actions/InternActions'
import { Stats } from 'src/types/entities/Stats'

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
  // console.log('usermade:', user)
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
  // console.log('intern`s supervisor is :', user)
  await em.persistAndFlush(intern)
  return intern
}

describe('InternActions : getInternsByStatusAction', () => {
  test('can fetch valid interns according to internStatus', async () => {
    expect.assertions(3)

    const intern1 = await createBasicIntern()
    intern1.internStatus = InternStatus.ACTIVE
    const intern2 = await createBasicIntern()
    intern2.internStatus = InternStatus.ACTIVE
    const intern3 = await createBasicIntern()
    intern3.internStatus = InternStatus.STANDBY
    // console.log('his status is', intern3.internStatus)
    const intern4 = await createBasicIntern()
    intern4.internStatus = InternStatus.EMPLOYED
    await createBasicIntern()

    // console.log(intern1, intern2, intern3)
    const result = await getInternsByStatusAction('active', em)
    // console.log('result is', result)
    expect(result[0]).toBe(intern1)
    expect(result).toStrictEqual([intern1, intern2])
    expect(result).toHaveLength(2)
  })
  test('empty,will fetch zero interns if condition is not met', async () => {
    expect.assertions(1)

    const cand1 = await createBasicIntern()
    cand1.internStatus = InternStatus.EMPLOYED
    const cand2 = await createBasicIntern()
    cand2.internStatus = InternStatus.EMPLOYED
    const cand3 = await createBasicIntern()
    cand3.internStatus = InternStatus.STANDBY
    await createBasicIntern()
    await createBasicIntern()

    const result = await getInternsByStatusAction('active', em)

    expect(result).toHaveLength(0)
  })
})

describe('InternActions : getInternsAction', () => {
  test('can fetch valid interns according to opposite of internStatus given', async () => {
    expect.assertions(3)

    const intern1 = await createBasicIntern()
    intern1.internStatus = InternStatus.ACTIVE
    const intern2 = await createBasicIntern()
    intern2.internStatus = InternStatus.ACTIVE
    const intern3 = await createBasicIntern()
    intern3.internStatus = InternStatus.STANDBY
    // console.log('his status is', intern3.internStatus)
    const intern4 = await createBasicIntern()
    intern4.internStatus = InternStatus.EMPLOYED
    const intern5 = await createBasicIntern()

    // console.log(intern1, intern2, intern3)
    const result = await getInternsAction('active', em)
    // console.log('result is', result)
    expect(result[0]).toBe(intern3)
    expect(result).toStrictEqual([intern3, intern4, intern5])
    expect(result).toHaveLength(3)
  })
})

describe('InternActions : getInternAction', () => {
  test('can fetch a single intern with valid data given', async () => {
    expect.assertions(1)

    const intern1 = await createBasicIntern()

    const result = await getInternByIdAction(intern1.id, em)
    expect(result).toBe(intern1)
  })
  test('invalid-id should throw error', async () => {
    expect.assertions(1)

    await createBasicIntern()

    await expect(async () => await getInternByIdAction('invalid-id', em))
      .rejects.toThrow('not found')
  })
})

describe('InternActions : createInternAction', () => {
  test('can create intern with valid data', async () => {
    expect.assertions(7)
    const user = await createBasicUser()

    const data = {
      fullname: 'NewName' + String(Math.floor(Math.random() * 1000 + 1)),
      email: String(Math.floor(Math.random() * 1000 + 1)) + 'newmail@gmail.com',
      dateOfBirth: new Date('1997-05-10 10:00:00'),
      position: Position.NETWORK,
      school: 'FineSchool123',
      academicYear: new Date('2016-05-10 10:00:00'),
      hiredAt: new Date('2020-01-01 10:00:00'),
      endInternship: new Date('2020-06-06 10:00:00'),
      internStatus: InternStatus.ACTIVE,
      supervisorId: user.id
    }

    const result = await createInternAction(data, em)

    expect(await em.find(Intern, {})).toHaveLength(1)
    expect(result.fullname).toBe(data.fullname)
    expect(result.position).toBe(data.position)
    expect(result.hiredAt).toStrictEqual(data.hiredAt)
    expect(result.internStatus).toBe(data.internStatus)
    expect(result.supervisor.id).toBe(data.supervisorId)
    expect(result.position).toBe(data.position)
  })
})

describe('InternActions : updateInternAction', () => {
  test('Can update intern with valid data', async () => {
    expect.assertions(3)
    const user = await createBasicUser()

    const result = await createBasicIntern()
    const id = result.id
    const data = {
      fullname: 'NewName' + String(Math.floor(Math.random() * 1000 + 1)),
      email: String(Math.floor(Math.random() * 1000 + 1)) + 'newmail@gmail.com',
      dateOfBirth: new Date('1997-05-10 10:00:00'),
      position: Position.NETWORK,
      school: 'FineSchool123',
      academicYear: new Date('2016-05-10 10:00:00'),
      hiredAt: new Date('2020-01-01 10:00:00'),
      endInternship: new Date('2020-06-06 10:00:00'),
      internStatus: InternStatus.ACTIVE,
      supervisorId: user.id
    }

    await updateInternAction(id, data, em)
    expect(result.fullname).toBe(data.fullname)
    expect(result.position).toBe(data.position)
    expect(result.internStatus).toBe(data.internStatus)
  })
  test('Cannot update an intern with invalid-id', async () => {
    expect.assertions(1)
    const user = await createBasicUser()

    const id = v4()
    const data = {
      fullname: 'NewName' + String(Math.floor(Math.random() * 1000 + 1)),
      email: String(Math.floor(Math.random() * 1000 + 1)) + 'newmail@gmail.com',
      dateOfBirth: new Date('1997-05-10 10:00:00'),
      position: Position.NETWORK,
      school: 'FineSchool123',
      academicYear: new Date('2016-05-10 10:00:00'),
      hiredAt: new Date('2020-01-01 10:00:00'),
      endInternship: new Date('2020-06-06 10:00:00'),
      internStatus: InternStatus.ACTIVE,
      supervisorId: user.id
    }
    await expect(async () => await updateInternAction(id, data, em))
      .rejects.toThrow('Intern not found')
  })
})

describe('InternActions : updateInternActionStatus', () => {
  test('Can update intern with valid data for status only', async () => {
    expect.assertions(1)

    const result = await createBasicIntern()
    const id = result.id

    await updateInternActionOnlyStatus(id, InternStatus.ACTIVE, em)
    expect(result.internStatus).toBe('active')
  })
})

describe('InternActions : deleteInternAction', () => {
  test('Can delete an intern with valid data given', async () => {
    expect.assertions(1)

    const inter = await createBasicIntern()

    const result = await deleteInternAction(inter.id, em)

    expect(result).toBe(true)
  })
  test('Cannot delete a candidate with invalid-id given', async () => {
    expect.assertions(1)

    const id = v4()
    await expect(async () => await deleteInternAction(id, em))
      .rejects.toThrow('Intern not found')
  })
})

describe('InternActions : findPercentageOfSuccessfull', () => {
  test('Can find correct percentage of interns', async () => {
    expect.assertions(1)

    const inter1 = await createBasicIntern()
    inter1.internStatus = InternStatus.EMPLOYED
    const inter2 = await createBasicIntern()
    inter2.internStatus = InternStatus.EMPLOYED

    const inter3 = await createBasicIntern()
    inter3.internStatus = InternStatus.DISMISSED

    const stats: Stats[] = [
      { value: 2, name: InternStatus.EMPLOYED },
      { value: 1, name: InternStatus.DISMISSED }
    ]
    const result = await findPercentageOfSuccessfulInterns(em)
    expect(result).toStrictEqual(stats)
  })
})

describe('InternActions : findPercentageOfSuccessfullPerPeriod', () => {
  test('Can find correct percentage of interns per period', async () => {
    expect.assertions(1)

    const inter1 = await createBasicIntern()
    inter1.internStatus = InternStatus.EMPLOYED
    const inter2 = await createBasicIntern()
    inter2.internStatus = InternStatus.EMPLOYED
    const inter4 = await createBasicIntern()
    inter4.internStatus = InternStatus.EMPLOYED

    const inter3 = await createBasicIntern()
    inter3.internStatus = InternStatus.DISMISSED

    const stats: Stats[] = [
      { value: 3, name: InternStatus.EMPLOYED },
      { value: 1, name: InternStatus.DISMISSED }
    ]
    const result = await findPercentageOfSuccessfulInternsPerPeriod(120, em)
    expect(result).toStrictEqual(stats)
  })
})
