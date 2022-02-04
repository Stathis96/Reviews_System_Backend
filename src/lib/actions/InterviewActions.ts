import { EntityManager } from '@mikro-orm/core'
import { AuthenticationError, UserInputError } from 'apollo-server-koa'

import { InterviewInputData } from 'src/types/classes/InterviewInputData'
import { Candidate } from 'src/types/entities/Candidate'
import { Interview } from 'src/types/entities/Interview'
import { StatusStats } from 'src/types/entities/StatusStats'
import { User } from 'src/types/entities/User'

import { Status } from 'src/types/enums/Status'

export async function getInterviewByIdAction (id: string, em: EntityManager): Promise<Interview> {
  const interview = await em.findOneOrFail(Interview, { id }, ['candidate', 'interviewer'])
  return interview
}

export async function getInterviewsByStatusAction (status: string, em: EntityManager): Promise<Interview[]> {
  return await em.find(Interview, { status }, ['candidate', 'interviewer'])
}

export async function getScheduledInterviewsAction (em: EntityManager): Promise<Interview[]> {
  const interviews = await em.find(Interview, {}, ['candidate', 'interviewer'])
  return interviews.filter(element => element.startTime >= new Date())
}

export async function getOldInterviewsAction (em: EntityManager): Promise<Interview[]> {
  const interviews = await em.find(Interview, {}, ['candidate', 'interviewer'])
  return interviews.filter(element => element.startTime <= new Date())
}

export async function createInterviewAction (data: InterviewInputData, user: User, em: EntityManager): Promise<Interview> {
  // const user = await em.findOneOrFail(User, { id: data.interviewerId })
  const candidate = await em.findOneOrFail(Candidate, { id: data.candidateId })
  // console.log('users id', user.id)
  // console.log('USER IS', user)

  if (data.grading > 10 || data.experience > 5 || data.degree > 5) {
    throw new UserInputError('Action Failed! Input range between 1-5 for Intern`s experience & degree, 1-10 for Intern`s experience')
  }
  // can handle it with InterviewInputData restrictions too(Min(1),Max(10)) , but decided to go this way so i can provide user with extra info about his error.

  const interview = em.create(Interview, { ...data, candidate: candidate, interviewer: user })
  interview.status = Status.PENDING
  await em.persistAndFlush(interview)
  return interview
}

export async function updateInterviewAction (id: string, data: InterviewInputData, user: User, em: EntityManager): Promise<Interview> {
  // const user = await em.findOneOrFail(User, { id: data.interviewerId })
  const candidate = await em.findOneOrFail(Candidate, { id: data.candidateId })
  const interview = await em.findOneOrFail(Interview, { id }, ['candidate', 'interviewer'])

  if (user.id !== interview.interviewer.id) {
    throw new AuthenticationError('Action Failed! Logged in user must be also the owner to update an interview')
  }
  if (data.grading > 10 || data.experience > 5 || data.degree > 5) {
    throw new UserInputError('Action Failed! Input range between 1-5 for Intern`s experience & degree, 1-10 for Intern`s experience')
  }
  // can handle it with InterviewInputData restrictions too(Min(1),Max(10)) , but decided to go this way so i can provide user with extra info about his error.

  interview.candidate = candidate
  interview.interviewer = user
  interview.startTime = data.startTime
  interview.endTime = data.endTime
  interview.experience = data.experience
  interview.degree = data.degree
  interview.comments = data.comments
  interview.grading = data.grading

  // eslint-disable-next-line no-self-assign
  interview.status = data.status

  await em.flush()
  return interview
}

export async function updateInterviewActionOnlyStatus (id: string, status: Status, em: EntityManager): Promise<Interview> {
  const interview = await em.findOneOrFail(Interview, { id }, ['candidate', 'interviewer'])

  interview.status = status
  await em.flush()
  return interview
}

export async function deleteInterviewAction (id: string, user: User, em: EntityManager): Promise<boolean> {
  const interview = await em.findOneOrFail(Interview, { id }, ['candidate', 'interviewer'])

  if (user.id !== interview.interviewer.id) {
    throw new AuthenticationError('Action Failed! Logged in user must be also the owner to delete an interview')
  }

  await em.removeAndFlush(interview)
  return true
}

export async function findPercentageOfSuccessfulInterviews (em: EntityManager): Promise<StatusStats[]> {
  const interviews = await em.find(Interview, {})
  const employed = interviews.filter(element => element.status === 'accepted')
  const dismissed = interviews.filter(element => element.status === 'rejected')
  const stats: StatusStats[] = [
    { value: employed.length, name: Status.ACCEPTED },
    { value: dismissed.length, name: Status.REJECTED }
  ]
  return stats
  // return (employed.length / total) * 100
}

export async function findPercentageOfSuccessfulInterviewsPerPeriod (months: number, em: EntityManager): Promise<StatusStats[]> {
  const interviews = await em.find(Interview, {})
  const employed = interviews.filter(element => element.status === 'accepted')
  const dismissed = interviews.filter(element => element.status === 'rejected')

  const monthEmployed = employed.filter(element => {
    const diff = (new Date().getTime() - element.endTime.getTime()) / 1000 / 60 / 60 / 24 / 30
    return diff < months && diff > 0
  })
  const monthDismissed = dismissed.filter(element => {
    const diff = (new Date().getTime() - element.endTime.getTime()) / 1000 / 60 / 60 / 24 / 30
    return diff < months && diff > 0
  })

  const stats: StatusStats[] = [
    { value: monthEmployed.length, name: Status.ACCEPTED },
    { value: monthDismissed.length, name: Status.REJECTED }
  ]
  return stats
  // return (employed.length / total) * 100
}
