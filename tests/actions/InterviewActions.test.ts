import '../dbSetup'
import { EntityManager } from '@mikro-orm/core'
import { getConnection } from '../createConnection'

import { v4 } from 'uuid'
import { User } from 'src/types/entities/User'
import { Position } from 'src/types/enums/Position'
import { Candidate } from 'src/types/entities/Candidate'
import { EmploymentType } from 'src/types/enums/EmploymentType'
import { Status } from 'src/types/enums/Status'
import { Interview } from 'src/types/entities/Interview'
import { getInterviewByIdAction, getInterviewsByStatusAction, getScheduledInterviewsAction, getOldInterviewsAction, createInterviewAction, updateInterviewAction, updateInterviewActionOnlyStatus, deleteInterviewAction, findPercentageOfSuccessfulInterviews, findPercentageOfSuccessfulInterviewsPerPeriod } from 'src/lib/actions/InterviewActions'
import { StatusStats } from 'src/types/entities/StatusStats'

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

async function createBasicCandidate (name = 'Senior'): Promise<Candidate> {
  const candidate = em.create(Candidate, {
    id: v4(),
    name: name,
    email: String(Math.floor(Math.random() * 1000 + 1)) + 'newmail@gmail.com',
    mobile: '00000000',
    position: Position.DEV,
    employmentType: EmploymentType.INTERNSHIP,
    degree: 'Cool',
    status: Status.REJECTED
  })

  await em.persistAndFlush(candidate)
  return candidate
}

async function createBasicInterview (): Promise<Interview> {
  const user = await createBasicUser()
  const candidate = await createBasicCandidate()

  const interview = em.create(Interview, {
    id: v4(),
    candidate: candidate,
    interviewer: user,
    startTime: '2021-05-05 10:00:00',
    endTime: '2021-05-05 10:20:00',
    experience: 2,
    degree: 3,
    grading: 4,
    comments: 'A fine lad',
    status: Status.PENDING
  })
  await em.persistAndFlush(interview)
  return interview
}

describe('InterviewActions : getInterviewAction', () => {
  test('can fetch a single interview with valid data given', async () => {
    expect.assertions(1)

    const interv = await createBasicInterview()

    const result = await getInterviewByIdAction(interv.id, em)
    expect(result).toBe(interv)
  })
  test('invalid-id should throw error', async () => {
    expect.assertions(1)

    await createBasicInterview()

    await expect(async () => await getInterviewByIdAction('invalid-id', em))
      .rejects.toThrow('not found')
  })
})

describe('InteviewActions : getInterviewByStatusAction', () => {
  test('can fetch valid interviews according to status', async () => {
    expect.assertions(4)

    const inter1 = await createBasicInterview()
    inter1.status = Status.ACCEPTED
    const inter2 = await createBasicInterview()
    inter2.status = Status.ACCEPTED
    const inter3 = await createBasicInterview()
    inter3.status = Status.STANDBY
    const inter4 = await createBasicInterview()
    inter4.status = Status.PENDING
    await createBasicInterview()

    const result = await getInterviewsByStatusAction('accepted', em)
    // console.log('cand result is', result)
    expect(result).toStrictEqual([inter1, inter2])
    expect(result[0]).toBe(inter1)
    expect(result[1]).toBe(inter2)
    expect(result).toHaveLength(2)
  })
})

describe('InteviewActions : getScheduledInterviewsAction', () => {
  test('can fetch valid scheduled interviews', async () => {
    expect.assertions(4)

    const inter1 = await createBasicInterview()
    inter1.startTime = new Date('2022-05-10 10:00:00')
    const inter2 = await createBasicInterview()
    inter2.startTime = new Date('2023-05-10 10:00:00')
    const inter3 = await createBasicInterview()
    inter3.startTime = new Date('2020-05-10 10:00:00')
    const inter4 = await createBasicInterview()
    inter4.startTime = new Date('2019-05-10 10:00:00')

    const result = await getScheduledInterviewsAction(em)
    // console.log('cand result is', result)
    expect(result).toStrictEqual([inter1, inter2])
    expect(result[0]).toBe(inter1)
    expect(result[1]).toBe(inter2)
    expect(result).toHaveLength(2)
  })
  test('empty, will fetch zero scheduled interviews if none are scheduled', async () => {
    expect.assertions(1)

    const inter1 = await createBasicInterview()
    inter1.startTime = new Date('2012-05-10 10:00:00')
    const inter2 = await createBasicInterview()
    inter2.startTime = new Date('2013-05-10 10:00:00')
    const inter3 = await createBasicInterview()
    inter3.startTime = new Date('2020-05-10 10:00:00')
    const inter4 = await createBasicInterview()
    inter4.startTime = new Date('2019-05-10 10:00:00')

    const result = await getScheduledInterviewsAction(em)
    // console.log('cand result is', result)
    expect(result).toHaveLength(0)
  })
})
describe('InteviewActions : getOldInterviewsAction', () => {
  test('can fetch valid old interviews', async () => {
    expect.assertions(4)

    const inter1 = await createBasicInterview()
    inter1.startTime = new Date('2022-05-10 10:00:00')
    const inter2 = await createBasicInterview()
    inter2.startTime = new Date('2023-05-10 10:00:00')
    const inter3 = await createBasicInterview()
    inter3.startTime = new Date('2020-05-10 10:00:00')
    const inter4 = await createBasicInterview()
    inter4.startTime = new Date('2019-05-10 10:00:00')

    const result = await getOldInterviewsAction(em)
    // console.log('cand result is', result)
    expect(result).toStrictEqual([inter3, inter4])
    expect(result[0]).toBe(inter3)
    expect(result[1]).toBe(inter4)
    expect(result).toHaveLength(2)
  })
  test('empty, will fetch zero old interviews if none were made', async () => {
    expect.assertions(1)

    const inter1 = await createBasicInterview()
    inter1.startTime = new Date('2022-05-10 10:00:00')
    const inter2 = await createBasicInterview()
    inter2.startTime = new Date('2023-05-10 10:00:00')
    const inter3 = await createBasicInterview()
    inter3.startTime = new Date('2022-05-10 10:00:00')
    const inter4 = await createBasicInterview()
    inter4.startTime = new Date('2029-05-10 10:00:00')

    const result = await getOldInterviewsAction(em)
    expect(result).toHaveLength(0)
  })
})

describe('InteviewActions : createInterviewAction', () => {
  test('can create interview with valid data', async () => {
    expect.assertions(5)

    const user = await createBasicUser()
    const candidate = await createBasicCandidate()

    const data = {
      candidateId: candidate.id,
      startTime: new Date('2021-05-05 10:00:00'),
      endTime: new Date('2021-05-05 10:20:00'),
      experience: 2,
      degree: 3,
      grading: 4,
      comments: 'A fine lad',
      status: Status.PENDING
    }

    const result = await createInterviewAction(data, user, em)

    expect(await em.find(Interview, {})).toHaveLength(1)
    expect(result.candidate.id).toBe(data.candidateId)
    expect(result.experience).toBe(data.experience)
    expect(result.grading).toBe(data.grading)
    expect(result.status).toBe(data.status)
  })
  test('cannot create interview with invalid data given', async () => {
    expect.assertions(1)

    const user = await createBasicUser()
    const candidate = await createBasicCandidate()

    const data = {
      candidateId: candidate.id,
      startTime: new Date('2021-05-05 10:00:00'),
      endTime: new Date('2021-05-05 10:20:00'),
      experience: 6,
      degree: 13,
      grading: 14,
      comments: 'A fine lad',
      status: Status.PENDING
    }
    await expect(async () => await createInterviewAction(data, user, em))
      .rejects.toThrow('Action Failed! Input range between 1-5 for Intern`s experience & degree, 1-10 for Intern`s experience')
  })
})

describe('InteviewActions : updateInterviewAction', () => {
  test('Can update interview with valid data', async () => {
    expect.assertions(5)
    const candidate = await createBasicCandidate()

    const result = await createBasicInterview()
    const id = result.id
    const data = {
      candidateId: candidate.id,
      startTime: new Date('2021-05-05 10:00:00'),
      endTime: new Date('2021-05-05 10:20:00'),
      experience: 2,
      degree: 3,
      grading: 4,
      comments: 'A fine lad',
      status: Status.PENDING
    }

    await updateInterviewAction(id, data, result.interviewer, em)
    expect(result.candidate.id).toBe(data.candidateId)
    expect(result.experience).toBe(data.experience)
    expect(result.comments).toBe(data.comments)
    expect(result.status).toBe(data.status)
    expect(result.endTime).toBe(data.endTime)
  })
  test('Cannot update an interview with invalid-id', async () => {
    expect.assertions(1)
    const candidate = await createBasicCandidate()

    const result = await createBasicInterview()
    const id = v4()
    const data = {
      candidateId: candidate.id,
      startTime: new Date('2021-05-05 10:00:00'),
      endTime: new Date('2021-05-05 10:20:00'),
      experience: 2,
      degree: 3,
      grading: 4,
      comments: 'A fine lad',
      status: Status.PENDING
    }
    await expect(async () => await updateInterviewAction(id, data, result.interviewer, em))
      .rejects.toThrow('Interview not found')
  })
  test('Cannot update an interview if logged in user is not the supervisor', async () => {
    expect.assertions(1)
    const candidate = await createBasicCandidate()

    const result = await createBasicInterview()
    const id = result.id
    const data = {
      candidateId: candidate.id,
      startTime: new Date('2021-05-05 10:00:00'),
      endTime: new Date('2021-05-05 10:20:00'),
      experience: 2,
      degree: 3,
      grading: 4,
      comments: 'A fine lad',
      status: Status.PENDING
    }
    const differentUser = await createBasicUser()
    await expect(async () => await updateInterviewAction(id, data, differentUser, em))
      .rejects.toThrow('Action Failed! Logged in user must be also the owner to update an interview')
  })
  test('Cannot update an interview if invalid data is given', async () => {
    expect.assertions(1)
    const candidate = await createBasicCandidate()

    const result = await createBasicInterview()
    const id = result.id
    const data = {
      candidateId: candidate.id,
      startTime: new Date('2021-05-05 10:00:00'),
      endTime: new Date('2021-05-05 10:20:00'),
      experience: 12,
      degree: 13,
      grading: 41,
      comments: 'A fine lad',
      status: Status.PENDING
    }
    await expect(async () => await updateInterviewAction(id, data, result.interviewer, em))
      .rejects.toThrow('Action Failed! Input range between 1-5 for Intern`s experience & degree, 1-10 for Intern`s experience')
  })
})

describe('InteviewActions : updateInterviewOnlyStatusAction', () => {
  test('can update interview`s status with valid data', async () => {
    expect.assertions(2)
    const result = await createBasicInterview()
    const id = result.id

    const check = await updateInterviewActionOnlyStatus(id, Status.ACCEPTED, em)

    expect(check.status).toBe(result.status)
    expect(check.status).toBe('accepted')
  })
})

describe('InteviewActions : deleteInterviewAction', () => {
  test('Can delete a list with valid data given', async () => {
    expect.assertions(1)

    const interv = await createBasicInterview()

    const result = await deleteInterviewAction(interv.id, interv.interviewer, em)

    expect(result).toBe(true)
  })
  test('Cannot delete an interview with invalid-id given', async () => {
    expect.assertions(1)

    const interv = await createBasicInterview()
    const id = v4()
    await expect(async () => await deleteInterviewAction(id, interv.interviewer, em))
      .rejects.toThrow('Interview not found')
  })
  test('Cannot delete an interview if logged in user is not the supervisor of the interview', async () => {
    expect.assertions(1)

    const interv = await createBasicInterview()
    const id = interv.id

    const differentUser = await createBasicUser()
    await expect(async () => await deleteInterviewAction(id, differentUser, em))
      .rejects.toThrow('Action Failed! Logged in user must be also the owner to delete an interview')
  })
})

describe('InterviewActions : findPercentageOfSuccessfull', () => {
  test('Can find correct percentage of interviews', async () => {
    expect.assertions(1)

    const inter1 = await createBasicInterview()
    inter1.status = Status.ACCEPTED
    const inter2 = await createBasicInterview()
    inter2.status = Status.ACCEPTED

    const inter3 = await createBasicInterview()
    inter3.status = Status.REJECTED

    const stats: StatusStats[] = [
      { value: 2, name: Status.ACCEPTED },
      { value: 1, name: Status.REJECTED }
    ]
    const result = await findPercentageOfSuccessfulInterviews(em)
    expect(result).toStrictEqual(stats)
  })
})

describe('InterviewActions : findPercentageOfSuccessfullPerPeriod', () => {
  test('Can find correct percentage of interviews per period', async () => {
    expect.assertions(1)

    const inter1 = await createBasicInterview()
    inter1.status = Status.ACCEPTED
    const inter2 = await createBasicInterview()
    inter2.status = Status.ACCEPTED
    const inter4 = await createBasicInterview()
    inter4.status = Status.ACCEPTED

    const inter3 = await createBasicInterview()
    inter3.status = Status.REJECTED

    const stats: StatusStats[] = [
      { value: 3, name: Status.ACCEPTED },
      { value: 1, name: Status.REJECTED }
    ]
    const result = await findPercentageOfSuccessfulInterviewsPerPeriod(120, em)
    expect(result).toStrictEqual(stats)
  })
})
