import { Cascade, Collection, Entity, Enum, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import { Field, ID, ObjectType } from 'type-graphql'

import { v4 } from 'uuid'

import { EmploymentType } from '../enums/EmploymentType'
import { Position } from '../enums/Position'
import { Status } from '../enums/Status'
import { Interview } from './Interview'

@Entity()
@ObjectType()
export class Candidate {
  @PrimaryKey()
  @Field(() => ID)
  id: string = v4()

  @Property()
  @Field()
  name: string

  @Property()
  @Field()
  @Unique()
  email: string

  @Property()
  @Field()
  mobile: string

  @Enum(() => Position)
  @Field(() => Position)
  position!: Position // string enum

  @Enum(() => EmploymentType)
  @Field(() => EmploymentType)
  employmentType!: EmploymentType // string enum

  @Property()
  @Field()
  degree: string

  @Enum(() => Status)
  @Field(() => Status)
  status!: Status // string enum

  @OneToMany(() => Interview, inter => inter.candidate, { cascade: [Cascade.ALL] })
  @Field(() => [Interview])
  interviews = new Collection<Interview>(this)
}
