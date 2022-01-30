import { Cascade, Collection, Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import { Field, ID, ObjectType } from 'type-graphql'

import { v4 } from 'uuid'

import { Position } from '../enums/Position'
import { User } from './User'
import { Review } from './Review'
import { InternStatus } from '../enums/InternStatus'

@Entity()
@ObjectType()
export class Intern {
  @PrimaryKey()
  @Field(() => ID)
  id: string = v4()

  @Property()
  @Field()
  @Unique()
  fullname: string

  @Property()
  @Field()
  @Unique()
  email: string

  @Property()
  @Field()
  dateOfBirth: Date

  @Enum(() => Position)
  @Field(() => Position)
  position!: Position // string enum

  @Property()
  @Field()
  school: string

  @Property({ nullable: true })
  @Field({ nullable: true })
  academicYear: Date

  @ManyToOne(() => User)
  @Field(() => User)
  supervisor: User

  @Property({ nullable: true })
  @Field({ nullable: true })
  hiredAt: Date

  @Property({ nullable: true })
  @Field({ nullable: true })
  endInternship: Date

  @Enum(() => InternStatus)
  @Field(() => InternStatus)
  internStatus!: InternStatus // string enum

  @OneToMany(() => Review, rev => rev.intern, { cascade: [Cascade.ALL] })
  @Field(() => [Review])
  reviews = new Collection<Review>(this)
}
