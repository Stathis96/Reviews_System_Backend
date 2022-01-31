import { Property } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'
import { Candidate } from './Candidate'

@ObjectType()
export class PaginatedCandidates {
  @Property()
  @Field(() => [Candidate])
  context: Candidate[]

  @Property()
  @Field()
  total: number
}
