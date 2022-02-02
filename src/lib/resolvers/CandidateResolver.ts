import { EntityManager } from '@mikro-orm/core'
import { CandidateInputData } from 'src/types/classes/CandidateInputData'
import { PaginationInputData } from 'src/types/classes/PaginationInputData'
import { Candidate } from 'src/types/entities/Candidate'
import { PaginatedCandidates } from 'src/types/entities/PaginatedCandidates'

import { Ctx, Arg, Query, Resolver, Mutation } from 'type-graphql'

import { createCandidateAction, deleteCandidateAction, getCandidateByIdAction, getCandidatesAction, getCandidatesByStatusAction, updateCandidateAction } from '../actions/CandidateActions'

@Resolver()
export class CandidateResolver {
  @Query(() => Candidate)
  async getCandidateById (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string
  ): Promise <Candidate> {
    return await getCandidateByIdAction(id, em)
  }

  @Query(() => [Candidate])
  async getCandidatesByStatus (
    @Ctx('em') em: EntityManager,
      @Arg('status', () => String) status: string
  ): Promise <Candidate[]> {
    return await getCandidatesByStatusAction(status, em)
  }// left to do paginated

  @Mutation(() => Candidate)
  async createCandidate (
    @Ctx('em') em: EntityManager,
      @Arg('data', () => CandidateInputData) data: CandidateInputData
  ): Promise<Candidate> {
    return await createCandidateAction(data, em)
  }

  @Mutation(() => Candidate)
  async updateCandidate (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string,
      @Arg('data', () => CandidateInputData) data: CandidateInputData
  ): Promise<Candidate> {
    return await updateCandidateAction(id, data, em)
  }

  @Mutation(() => Boolean)
  async deleteCandidate (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string
  ): Promise<boolean> {
    return await deleteCandidateAction(id, em)
  }
}
