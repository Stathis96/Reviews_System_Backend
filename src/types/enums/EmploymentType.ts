import { registerEnumType } from 'type-graphql'

export enum EmploymentType {
  FULLTIME = 'fulltime',
  PARTTIME = 'parttime',
  INTERNSHIP = 'internship'
}

registerEnumType(EmploymentType, {
  name: 'EmploymentType' // this one is mandatory
})
