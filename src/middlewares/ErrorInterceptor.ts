import { ApolloError, AuthenticationError } from 'apollo-server-koa'
import { CustomContext } from 'src/types/interfaces/CustomContext'
import { MiddlewareFn } from 'type-graphql'

export const ErrorInterceptor: MiddlewareFn<CustomContext> = async (_context, next) => {
  try {
    return await next()
  } catch (err) {
    if (err.name === 'NotFoundError') {
      console.log('NotFoundError: ', err.message)
      throw new Error(err.message)
    } else if (err.name === 'UserInputError') {
      console.log('UserInputError: ', err.message)
      throw err
    } else if (err.name === 'AuthenticationError') {
      console.log('AuthenticationError:', err.message)
      throw new AuthenticationError(err.message)
    }

    throw new ApolloError('INTERNAL_ERROR')
  }
}
