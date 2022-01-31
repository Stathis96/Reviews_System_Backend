import { IsEnum, IsString, Length } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { EmploymentType } from '../enums/EmploymentType'
import { Position } from '../enums/Position'
import { Status } from '../enums/Status'

@InputType()
export class CandidateInputData {
  @Field()
  @IsString()
  name: string

  @Field()
  @IsString()
  email: string

  @Field()
  @Length(1, 13)
  @IsString()
  mobile: string

  @Field()
  @IsEnum(Position)
  position: Position

  @Field()
  @IsEnum(EmploymentType)
  employmentType: EmploymentType

  @Field()
  @IsEnum(Status)
  status: Status

  @Field()
  @IsString()
  degree: string
}
