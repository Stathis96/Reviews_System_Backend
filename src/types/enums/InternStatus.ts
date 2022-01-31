import { registerEnumType } from 'type-graphql'

export enum InternStatus {
  ACTIVE = 'active',
  EMPLOYED = 'employed',
  DISMISSED = 'dismissed',
  STANDBY = 'standby'
}

registerEnumType(InternStatus, {
  name: 'InternStatusType' // this one is mandatory
})
