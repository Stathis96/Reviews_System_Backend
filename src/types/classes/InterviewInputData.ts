import { IsDate, IsEnum, IsInt, IsString } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { Status } from '../enums/Status'

@InputType()
export class InterviewInputData {
  @Field()
  @IsString()
  candidateId: string

  // @Field()
  // @IsString()
  // interviewerId: string // mporei na mi xreiastei

  @Field()
  @IsDate()
  startTime: Date

  @Field()
  @IsDate()
  endTime: Date

  @Field()
  @IsInt()
  // @Min(1)
  // @Max(5)
  experience: number

  @Field()
  @IsInt()
  // @Min(1)
  // @Max(5)
  degree: number

  @Field()
  @IsString()
  comments: string

  @Field()
  @IsInt()
  // @Min(1)
  // @Max(10)
  grading: number

  @Field()
  @IsEnum(Status)
  status: Status
}
