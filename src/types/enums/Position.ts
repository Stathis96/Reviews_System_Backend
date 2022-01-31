import { registerEnumType } from 'type-graphql'

export enum Position {
  SALES = 'sales',
  FINANCIAL = 'financial',
  MARKETING = 'marketing',
  DEV = 'dev',
  NETWORK = 'network',
  STORES = 'stores'
}

registerEnumType(Position, {
  name: 'PositionType' // this one is mandatory
})
