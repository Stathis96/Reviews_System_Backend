import { EntityManager } from '@mikro-orm/core'

import { Ctx, Arg, Query, Resolver, Mutation } from 'type-graphql'

import { createInterviewAction, deleteInterviewAction, findPercentageOfSuccessfulInterviews, findPercentageOfSuccessfulInterviewsPerPeriod, getInterviewByIdAction, getInterviewsByStatusAction, getOldInterviewsAction, getScheduledInterviewsAction, updateInterviewAction, updateInterviewActionOnlyStatus } from '../actions/InterviewActions'
import { Interview } from 'src/types/entities/Interview'
// import { User } from 'src/types/entities/User'
import { InterviewInputData } from 'src/types/classes/InterviewInputData'
import { Status } from 'src/types/enums/Status'
import { StatusStats } from 'src/types/entities/StatusStats'
import { User } from 'src/types/entities/User'
import { CustomContext } from 'src/types/interfaces/CustomContext'

@Resolver()
export class InterviewResolver {
  @Query(() => Interview)
  async getInterviewById (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string
  ): Promise <Interview> {
    return await getInterviewByIdAction(id, em)
  }

  @Query(() => [Interview])
  async getInterviewsByStatus (
    @Ctx('em') em: EntityManager,
      @Arg('status', () => String) status: string
  ): Promise <Interview[]> {
    return await getInterviewsByStatusAction(status, em)
  }

  @Query(() => [Interview])
  async getScheduledInterviews (
    @Ctx('em') em: EntityManager
  ): Promise <Interview[]> {
    return await getScheduledInterviewsAction(em)
  }

  @Query(() => [Interview])
  async getOldInterviews (
    @Ctx('em') em: EntityManager
  ): Promise <Interview[]> {
    return await getOldInterviewsAction(em)
  }

  @Mutation(() => Interview)
  async createInterview (
    @Ctx('em') em: EntityManager,
      @Ctx('ctx') ctx: CustomContext,
      @Arg('data', () => InterviewInputData) data: InterviewInputData
  ): Promise<Interview> {
    return await createInterviewAction(data, ctx.user as User, em)
  }

  @Mutation(() => Interview)
  async updateInterview (
    @Ctx('em') em: EntityManager,
      @Ctx('ctx') ctx: CustomContext,
      @Arg('id', () => String) id: string,
      @Arg('data', () => InterviewInputData) data: InterviewInputData
  ): Promise<Interview> {
    return await updateInterviewAction(id, data, ctx.user as User, em)
  }

  @Mutation(() => Interview)
  async updateInterviewStatus (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string,
      @Arg('status', () => Status) status: Status
  ): Promise<Interview> {
    return await updateInterviewActionOnlyStatus(id, status, em)
  }

  @Mutation(() => Boolean)
  async deleteInterview (
    @Ctx('em') em: EntityManager,
      @Ctx('ctx') ctx: CustomContext,
      @Arg('id', () => String) id: string
  ): Promise<boolean> {
    return await deleteInterviewAction(id, ctx.user as User, em)
  }

  @Query(() => [StatusStats])
  async findPercentageOfInterviews (
    @Ctx('em') em: EntityManager
  ): Promise<StatusStats[]> {
    return await findPercentageOfSuccessfulInterviews(em)
  }

  @Query(() => [StatusStats])
  async findPercentageOfInterviewsMonthly (
    @Ctx('em') em: EntityManager,
      @Arg('months', () => Number) months: number
  ): Promise<StatusStats[]> {
    return await findPercentageOfSuccessfulInterviewsPerPeriod(months, em)
  }
}
