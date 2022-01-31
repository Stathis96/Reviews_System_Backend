import { IsInt } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class PaginationInputData {
  @Field()
  @IsInt()
  page: number

  @Field()
  @IsInt()
  limit: number

  @Field({ nullable: true })
  filter?: string
}
