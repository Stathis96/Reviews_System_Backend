import { EntityManager } from '@mikro-orm/core'
import { Ctx, Arg, Query, Resolver, Mutation } from 'type-graphql'

import { Intern } from 'src/types/entities/Intern'
import { createInternAction, deleteInternAction, findPercentageOfSuccessfulInterns, findPercentageOfSuccessfulInternsPerPeriod, getInternByIdAction, getInternsAction, getInternsByStatusAction, updateInternAction, updateInternActionOnlyStatus } from '../actions/InternActions'
import { InternInputData } from 'src/types/classes/InterInputData'
import { InternStatus } from 'src/types/enums/InternStatus'
import { Stats } from 'src/types/entities/Stats'

@Resolver()
export class InternResolver {
  @Query(() => [Intern])
  async getInternsByStatus (
    @Ctx('em') em: EntityManager,
      @Arg('status', () => String) status: string
  ): Promise <Intern[]> {
    return await getInternsByStatusAction(status, em)
  }

  @Query(() => [Intern])
  async getInterns (
    @Ctx('em') em: EntityManager,
      @Arg('status', () => String) status: string
  ): Promise <Intern[]> {
    return await getInternsAction(status, em)
  }

  @Query(() => Intern)
  async getInternById (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string
  ): Promise <Intern> {
    return await getInternByIdAction(id, em)
  }

  @Mutation(() => Intern)
  async createIntern (
    @Ctx('em') em: EntityManager,
      // @Ctx('user') user: User,
      @Arg('data', () => InternInputData) data: InternInputData
  ): Promise<Intern> {
    return await createInternAction(data, em)
  }

  @Mutation(() => Intern)
  async updateIntern (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string,
      @Arg('data', () => InternInputData) data: InternInputData
  ): Promise<Intern> {
    return await updateInternAction(id, data, em)
  }

  @Mutation(() => Intern)
  async updateInternStatus (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string,
      @Arg('internStatus', () => InternStatus) internStatus: InternStatus
  ): Promise<Intern> {
    return await updateInternActionOnlyStatus(id, internStatus, em)
  }

  @Mutation(() => Boolean)
  async deleteIntern (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string
  ): Promise<boolean> {
    return await deleteInternAction(id, em)
  }

