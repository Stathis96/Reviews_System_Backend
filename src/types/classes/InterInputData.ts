import { IsDate, IsEnum, IsString } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { InternStatus } from '../enums/InternStatus'
import { Position } from '../enums/Position'
// import { Status } from '../enums/Status'

@InputType()
export class InternInputData {
  @Field()
  @IsString()
  fullname: string

  @Field()
  @IsString()
  email: string

  @Field({ nullable: true })
  @IsDate()
  dateOfBirth: Date

  @Field()
  @IsEnum(Position)
  position: Position

  @Field()
  @IsString()
  school: string

  @Field({ nullable: true })
  @IsDate()
  academicYear: Date

  @Field()
  @IsString()
  supervisorId: string // mporei na mi xreiastei

  @Field({ nullable: true })
  @IsDate()
  hiredAt: Date

  @Field()
  @IsDate()
  endInternship: Date

  @Field()
  @IsEnum(InternStatus)
  internStatus: InternStatus
}
