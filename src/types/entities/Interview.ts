import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, ID, ObjectType } from 'type-graphql'
import { v4 } from 'uuid'

import { Status } from '../enums/Status'
import { Candidate } from './Candidate'
import { User } from './User'

@Entity()
@ObjectType()
export class Interview {
  @PrimaryKey()
  @Field(() => ID)
  id: string = v4()

  @ManyToOne(() => Candidate)
  @Field(() => Candidate)
  candidate: Candidate

  @ManyToOne(() => User)
  @Field(() => User)
  interviewer: User

  @Property()
  @Field()
  startTime: Date

  @Property()
  @Field()
  endTime: Date

  @Property()
  @Field()
  experience: number

  @Property()
  @Field()
  degree: number

  @Property({ nullable: true })
  @Field()
  comments: string

  @Property()
  @Field()
  grading: number

  @Enum(() => Status)
  @Field(() => Status)
  status!: Status // string enum
}
