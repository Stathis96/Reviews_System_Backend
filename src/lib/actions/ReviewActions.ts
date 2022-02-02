import { EntityManager, QueryOrder } from '@mikro-orm/core'
import { ReviewInputData } from 'src/types/classes/ReviewInputData'
import { Intern } from 'src/types/entities/Intern'
import { Review } from 'src/types/entities/Review'
import { User } from 'src/types/entities/User'
import { InternStatus } from 'src/types/enums/InternStatus'

export async function getReviewsAction (em: EntityManager): Promise<Review[]> {
  return await em.find(Review, {}, ['intern', 'supervisor'], { createdAt: QueryOrder.DESC })
}

export async function getReviewsOfActiveInternsAction (em: EntityManager): Promise<Review[]> {
  const reviews = await em.find(Review, {}, ['intern', 'supervisor'])
  return reviews.filter(element => element.intern.internStatus === InternStatus.ACTIVE)
}

export async function getReviewsByStatusAction (status: string, em: EntityManager): Promise<Review[]> {
  const reviews = await em.find(Review, {}, ['intern', 'supervisor'])
  return reviews.filter(element => element.intern.internStatus === status)
}

export async function createReviewAction (data: ReviewInputData, em: EntityManager): Promise<Review> {
  const user = await em.findOneOrFail(User, { id: data.supervisorId })
  const intern = await em.findOneOrFail(Intern, { id: data.internId })
  // console.log('USER IS', user)
  const review = em.create(Review, { ...data, intern: intern, supervisor: user })
  await em.persistAndFlush(review)
  return review
}

export async function updateReviewAction (id: string, data: ReviewInputData, em: EntityManager): Promise<Review> {
  const user = await em.findOneOrFail(User, { id: data.supervisorId })
  const intern = await em.findOneOrFail(Intern, { id: data.internId })
  const review = await em.findOneOrFail(Review, { id }, ['intern', 'supervisor'])

  review.consistency = data.consistency
  review.cooperation = data.cooperation
  review.initiative = data.initiative
  review.performance = data.performance
  review.total = data.total
  review.createdAt = data.createdAt
  review.intern = intern
  review.supervisor = user

  await em.flush()
  return review
}

export async function deleteReviewAction (id: string, em: EntityManager): Promise<boolean> {
  const review = await em.findOneOrFail(Review, { id }, ['intern', 'supervisor'])

  await em.removeAndFlush(review)
  return true
}
