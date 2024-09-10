import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthGuard } from './guards/auth.guard'
import { AuthController } from './auth.controller'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: 'CUSTOMER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: configService.get<number>('CUSTOMER_PORT'),
          },
        }),
      },
    ]),
  ],
  controllers: [UserController, AuthController],
  providers: [AuthGuard],
})
export class AppModule {}
