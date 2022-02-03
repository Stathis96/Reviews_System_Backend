import { EntityManager } from '@mikro-orm/core'
import { Ctx, Arg, Resolver, Mutation, Query } from 'type-graphql'
import { Review } from 'src/types/entities/Review'
import { createReviewAction, deleteReviewAction, getReviewsAction, getReviewsByStatusAction, getReviewsOfActiveInternsAction, updateReviewAction } from '../actions/ReviewActions'
import { ReviewInputData } from 'src/types/classes/ReviewInputData'

@Resolver()
export class ReviewResolver {
  @Query(() => [Review])
  async getReviews (
    @Ctx('em') em: EntityManager
  ): Promise<Review[]> {
    return await getReviewsAction(em)
  }

  @Query(() => [Review])
  async getReviewsOfActiveInterns (
    @Ctx('em') em: EntityManager
  ): Promise <Review[]> {
    return await getReviewsOfActiveInternsAction(em)
  }

  @Query(() => [Review])
  async getReviewsByStatus (
    @Ctx('em') em: EntityManager,
      @Arg('status', () => String) status: string
  ): Promise <Review[]> {
    return await getReviewsByStatusAction(status, em)
  }

  @Mutation(() => Review)
  async createReview (
    @Ctx('em') em: EntityManager,
      // @Ctx('user') user: User,
      @Arg('data', () => ReviewInputData) data: ReviewInputData
  ): Promise<Review> {
    return await createReviewAction(data, em)
  }

  @Mutation(() => Review)
  async updateReview (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string,
      @Arg('data', () => ReviewInputData) data: ReviewInputData
  ): Promise<Review> {
    return await updateReviewAction(id, data, em)
  }

  @Mutation(() => Boolean)
  async deleteReview (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string
  ): Promise<boolean> {
    return await deleteReviewAction(id, em)
  }
}
