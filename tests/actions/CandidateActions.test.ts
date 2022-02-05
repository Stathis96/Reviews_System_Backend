import '../dbSetup'
import { EntityManager } from '@mikro-orm/core'
import { getConnection } from '../createConnection'

import { v4 } from 'uuid'

import { createCandidateAction, deleteCandidateAction, getCandidateByIdAction, getCandidatesAction, getCandidatesByStatusAction, updateCandidateAction } from 'src/lib/actions/CandidateActions'
import { Candidate } from 'src/types/entities/Candidate'

import { EmploymentType } from 'src/types/enums/EmploymentType'
import { Position } from 'src/types/enums/Position'
import { Status } from 'src/types/enums/Status'

import { CandidateInputData } from 'src/types/classes/CandidateInputData'

let em: EntityManager
beforeEach(async () => {
  em = (await getConnection()).em.fork()

  await em.begin()
})

afterEach(async () => {
  await em.rollback()
})

async function createBasicCandidate (name = 'Senior'): Promise<Candidate> {
  const candidate = em.create(Candidate, {
    id: v4(),
    name: name,
    email: String(Math.floor(Math.random() * 10000 + 1)) + 'newmail@gmail.com',
    mobile: '00000000',
    position: Position.DEV,
    employmentType: EmploymentType.INTERNSHIP,
    degree: 'Cool',
    status: Status.REJECTED
  })

  await em.persistAndFlush(candidate)
  return candidate
}

const candidateData = (
  name = 'NewCandidate',
  email = String(Math.floor(Math.random() * 1000 + 1)) + 'Newmail@sth.com',
  mobile = '123456243345',
  position = Position.STORES,
  employmentType = EmploymentType.PARTTIME,
  status = Status.PENDING,
  degree = 'Fine'
): CandidateInputData => {
  return {
    name,
    mobile,
    email,
    position,
    employmentType,
    status,
    degree
  }
}

describe('CandidateActions : getCandidatesAction', () => {
  test('empty', async () => {
    expect.assertions(1)
    const result = await getCandidatesAction({ page: 1, limit: 0 }, em)

    expect(result).toMatchObject({ context: [], total: 0 })
  })
  test('return all', async () => {
    expect.assertions(1)

    const cand1 = await createBasicCandidate()
    const cand2 = await createBasicCandidate('Candidate two')
    const cand3 = await createBasicCandidate()

    const result = await getCandidatesAction({ page: 1, limit: 0 }, em)

    expect(result).toMatchObject({ context: [cand1, cand2, cand3], total: 3 })
  })
})

describe('CandidateActions : getCandidateAction', () => {
  test('can fetch a single candidate with valid data given', async () => {
    expect.assertions(1)

    const cand1 = await createBasicCandidate()

    const result = await getCandidateByIdAction(cand1.id, em)
    expect(result).toBe(cand1)
  })
  test('invalid-id should throw error', async () => {
    expect.assertions(1)

    await createBasicCandidate()

    await expect(async () => await getCandidateByIdAction('invalid-id', em))
      .rejects.toThrow('not found')
  })
})

describe('CandidateActions : getCandidatesByStatusAction', () => {
  test('can fetch valid candidates according to status', async () => {
    expect.assertions(4)

    const cand1 = await createBasicCandidate()
    cand1.status = Status.ACCEPTED
    const cand2 = await createBasicCandidate()
    cand2.status = Status.ACCEPTED
    const cand3 = await createBasicCandidate()
    cand3.status = Status.STANDBY
    const cand4 = await createBasicCandidate()
    cand4.status = Status.PENDING
    await createBasicCandidate()

    const result = await getCandidatesByStatusAction('accepted', em)
    // console.log('cand result is', result)
    expect(result).toStrictEqual([cand1, cand2])
    expect(result[0]).toBe(cand1)
    expect(result[1]).toBe(cand2)
    expect(result).toHaveLength(2)
  })
  test('empty,will fetch zero candidates if condition is not met', async () => {
    expect.assertions(1)

    const cand1 = await createBasicCandidate()
    cand1.status = Status.ACCEPTED
    const cand2 = await createBasicCandidate()
    cand2.status = Status.ACCEPTED
    const cand3 = await createBasicCandidate()
    cand3.status = Status.STANDBY
    await createBasicCandidate()
    await createBasicCandidate()

    const result = await getCandidatesByStatusAction('pending', em)

    expect(result).toHaveLength(0)
  })
})

describe('ListActions : createCandidateAction', () => {
  test('can create candidate with valid data', async () => {
    expect.assertions(7)

    // const data = {
    //   name: 'NewCandidate',
    //   email: String(Math.floor(Math.random() * 1000 + 1)) + 'Newmail@sth.com',
    //   mobile: '123456243243243243789010000002345',
    //   position: Position.STORES,                              two ways ,either providing the InputDataType as shown in the non commented stuff
    //   employmentType: EmploymentType.PARTTIME,                or this simpler way(shown in comment)  , just declaring data
    //   status: Status.PENDING,
    //   degree: 'Fine'
    // }

    const data = candidateData()

    const result = await createCandidateAction(data, em)

    expect(await em.find(Candidate, {})).toHaveLength(1)
    expect(result.mobile).toBe(data.mobile)
    expect(result.position).toBe(data.position)
    expect(result.degree).toBe(data.degree)
    expect(result.status).toBe(data.status)
    expect(result.employmentType).toBe(data.employmentType)
    expect(result.position).toBe(data.position)
  })
})

