import { Context } from 'koa'
import { EntityManager } from '@mikro-orm/core'

import { AuthUser } from './AuthUser'
import { User } from '../entities/User'

export interface CustomContext {
  ctx: Context

  em: EntityManager

  state: {
    user?: AuthUser
  }

  user?: User
}
