import { Query, Resolver } from 'type-graphql'

@Resolver()
export class CoreResolver {
  @Query()
  version (): string {
    return '0.0.1'
  }
}
