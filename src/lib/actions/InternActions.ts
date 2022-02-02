import { EntityManager } from '@mikro-orm/core'
import { Stats } from 'src/types/entities/Stats'
import { InternInputData } from 'src/types/classes/InterInputData'
import { Intern } from 'src/types/entities/Intern'
import { User } from 'src/types/entities/User'
import { InternStatus } from 'src/types/enums/InternStatus'

export async function getInternsByStatusAction (internStatus: string, em: EntityManager): Promise<Intern[]> {
  return await em.find(Intern, { internStatus }, ['supervisor', 'reviews'])
}

export async function getInternsAction (internStatus: string, em: EntityManager): Promise<Intern[]> {
  const interns = await em.find(Intern, {}, ['supervisor', 'reviews'])
  return interns.filter((intern) => intern.internStatus !== internStatus)
}

export async function getInternByIdAction (id: string, em: EntityManager): Promise<Intern> {
  const intern = await em.findOneOrFail(Intern, { id }, ['supervisor', 'reviews', 'reviews.supervisor'])
  return intern
}

export async function createInternAction (data: InternInputData, em: EntityManager): Promise<Intern> {
  const user = await em.findOneOrFail(User, { id: data.supervisorId })
  // console.log('USER IS', user)
  const intern = em.create(Intern, { ...data, supervisor: user })
  await em.persistAndFlush(intern)
  return intern
}

export async function updateInternAction (id: string, data: InternInputData, em: EntityManager): Promise<Intern> {
  const user = await em.findOneOrFail(User, { id: data.supervisorId })
  const intern = await em.findOneOrFail(Intern, { id }, ['supervisor', 'reviews'])

  intern.fullname = data.fullname
  intern.email = data.email
  intern.position = data.position
  intern.hiredAt = data.hiredAt
  intern.academicYear = data.academicYear
  intern.dateOfBirth = data.dateOfBirth
  intern.endInternship = data.endInternship
  intern.school = data.school
  intern.supervisor = user

  // eslint-disable-next-line no-self-assign
  intern.internStatus = data.internStatus

  await em.flush()
  return intern
}

export async function updateInternActionOnlyStatus (id: string, internStatus: InternStatus, em: EntityManager): Promise<Intern> {
  const intern = await em.findOneOrFail(Intern, { id }, ['supervisor', 'reviews'])

  intern.internStatus = internStatus
  await em.flush()
  return intern
}

export async function deleteInternAction (id: string, em: EntityManager): Promise<boolean> {
  const intern = await em.findOneOrFail(Intern, { id }, ['supervisor', 'reviews'])

  await em.removeAndFlush(intern)
  return true
}

