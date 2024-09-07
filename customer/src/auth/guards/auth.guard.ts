import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const token = this.extractToken(request)

    if (!token) throw new UnauthorizedException()

    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get('SECRET_KEY'),
      })

      request.user = payload

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
