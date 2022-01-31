import { registerEnumType } from 'type-graphql'

export enum Status {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  STANDBY = 'standby'
}

registerEnumType(Status, {
  name: 'StatusType' // this one is mandatory
})
