import { Enum } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'
import { Status } from '../enums/Status'

@ObjectType()
export class StatusStats {
  @Field()
  value: number

  @Enum(() => Status)
  @Field(() => Status)
  name!: Status // string enum
}
