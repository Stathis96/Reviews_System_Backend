import { IsEnum, IsString } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { Position } from '../enums/Position'

@InputType()
export class UserInputData {
  @Field()
  @IsString()
  name: string

  @Field()
  @IsString()
  email: string

  @Field()
  @IsEnum(Position)
  position: Position
}
