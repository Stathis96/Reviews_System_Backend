import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, ID, ObjectType } from 'type-graphql'
import { v4 } from 'uuid'

import { Intern } from './Intern'
import { User } from './User'

@Entity()
@ObjectType()
export class Review {
  @PrimaryKey()
  @Field(() => ID)
  id: string = v4()

  @ManyToOne(() => Intern)
  @Field(() => Intern)
  intern: Intern

  @ManyToOne(() => User)
  @Field(() => User)
  supervisor: User

  @Property()
  @Field()
  initiative: number

  @Property()
  @Field()
  cooperation: number

  @Property()
  @Field()
  performance: number

  @Property()
  @Field()
  consistency: number

  @Property()
  @Field()
  total: number

  @Property()
  @Field()
  createdAt: Date
}
