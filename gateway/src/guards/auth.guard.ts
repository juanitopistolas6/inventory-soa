import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { IResponse, User } from 'src/interfaces'
import { MessagesAuth } from 'src/types'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('CUSTOMER_SERVICE') private customerServiceClient: ClientProxy,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<boolean>('secured', context.getHandler())

    console.log(`este endpoint esta asegurado?: ${secured}`)

    if (!secured) return true

    const request = context.switchToHttp().getRequest()

    const token = this.extractToken(request)

    if (!token) throw new UnauthorizedException()

    try {
      const payload: IResponse<User> = await firstValueFrom(
        this.customerServiceClient.send(MessagesAuth.VERIFY_TOKEN, { token }),
      )

      request.user = payload.data

      return true
    } catch {
      throw new UnauthorizedException()
    }
  }

  private extractToken(req: Request): string | undefined {
    const [type, token] = req.headers['authorization']?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
