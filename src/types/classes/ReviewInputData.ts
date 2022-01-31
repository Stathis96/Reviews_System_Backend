import { IsDate, IsInt, IsString, Max, Min } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class ReviewInputData {
  @Field()
  @IsString()
  internId: string

  @Field()
  @IsString()
  supervisorId: string

  @Field()
  @IsInt()
  @Min(1)
  @Max(5)
  initiative: number

  @Field()
  @IsInt()
  @Min(1)
  @Max(5)
  cooperation: number

  @Field()
  @IsInt()
  @Min(1)
  @Max(5)
  performance: number

  @Field()
  @IsInt()
  @Min(1)
  @Max(5)
  consistency: number

  @Field()
  @IsInt()
  @Min(1)
  @Max(5)
  total: number

  @Field()
  @IsDate()
  createdAt: Date
}
