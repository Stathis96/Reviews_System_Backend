import { Enum } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'
import { InternStatus } from '../enums/InternStatus'

@ObjectType()
export class Stats {
  @Field()
  value: number

  @Enum(() => InternStatus)
  @Field(() => InternStatus)
  name!: InternStatus // string enum
}
