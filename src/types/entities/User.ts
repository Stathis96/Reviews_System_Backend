import { Cascade, Collection, Entity, Enum, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import { Field, ID, ObjectType } from 'type-graphql'
import { v4 } from 'uuid'

import { Position } from '../enums/Position'
import { Intern } from './Intern'
import { Interview } from './Interview'
import { Review } from './Review'

@Entity()
@ObjectType()
export class User {
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

  @Enum(() => Position)
  @Field(() => Position)
  position!: Position // string enum

  @Field(() => [Intern])
  @OneToMany(() => Intern, intern => intern.supervisor, { cascade: [Cascade.ALL] })
  interns = new Collection<Intern>(this)

  @Field(() => [Interview])
  @OneToMany(() => Interview, int => int.interviewer, { cascade: [Cascade.ALL] })
  interviews = new Collection<Interview>(this)

  @Field(() => [Review])
  @OneToMany(() => Review, review => review.supervisor, { cascade: [Cascade.ALL] })
  reviews = new Collection<Review>(this)
}

// @Field(() => [Item])
//   @OneToMany({ entity: () => Item, mappedBy: 'group', cascade: [Cascade.ALL] })
//   items = new Collection<Item>(this)
