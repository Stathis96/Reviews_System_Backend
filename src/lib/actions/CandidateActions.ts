import { EntityManager } from '@mikro-orm/core'

import { Candidate } from 'src/types/entities/Candidate'
import { CandidateInputData } from 'src/types/classes/CandidateInputData'


export async function getCandidateByIdAction (id: string, em: EntityManager): Promise<Candidate> {
  const candidate = await em.findOneOrFail(Candidate, { id }, ['interviews'])
  return candidate
}

// export async function getCandidatesByStatusAction (status: string, data: PaginationInputData, em: EntityManager): Promise<PaginatedCandidates> {
//   const offset = (data.page - 1) * data.limit
//   console.log('mpika')
//   const [candidates, count] = await em.findAndCount(Candidate, { status }, { populate: ['interviews'], limit: data.limit, offset })
//   console.log('candidates', candidates)
//   console.log('count is ', count)
//   await em.flush()
//   return { context: candidates, total: count }
// }
export async function getCandidatesByStatusAction (status: string, em: EntityManager): Promise<Candidate[]> {
  return await em.find(Candidate, { status }, ['interviews'])
// limit = 10;
// offset = (limit * pageNumber) - limit
}// left to do paginated

export async function createCandidateAction (data: CandidateInputData, em: EntityManager): Promise<Candidate> {
  // if (data.degree === '' || data.email === '' || data.mobile === '' || data.name === '') {
  //   throw new UserInputError('Action Failed! Please fill all the required fields')
  // } form was made 'greedy' so it disables submittion if sth is wrong with my data
  const candidate = em.create(Candidate, { ...data })
  await em.persistAndFlush(candidate)
  return candidate
}

export async function updateCandidateAction (id: string, data: CandidateInputData, em: EntityManager): Promise<Candidate> {
  const candidate = await em.findOneOrFail(Candidate, { id }, ['interviews'])

  candidate.name = data.name
  candidate.email = data.email
  candidate.mobile = data.mobile
  candidate.degree = data.degree
  candidate.position = data.position
  candidate.status = data.status
  candidate.employmentType = data.employmentType

  await em.flush()
  return candidate
}

export async function deleteCandidateAction (id: string, em: EntityManager): Promise<boolean> {
  const candidate = await em.findOneOrFail(Candidate, { id }, ['interviews'])

  await em.removeAndFlush(candidate)
  return true
}
