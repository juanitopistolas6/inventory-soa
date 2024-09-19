import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthGuard } from './guards/auth.guard'
import {
  AuthController,
  UserController,
  CartController,
  ProductController,
} from './controllers'

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
    ClientsModule.registerAsync([
      {
        name: 'SHOPPING_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: configService.get<number>('SHOPPING_PORT'),
          },
        }),
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: 'PRODUCT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: configService.get<number>('PRODUCT_PORT'),
          },
        }),
      },
    ]),
  ],
  controllers: [
    UserController,
    AuthController,
    CartController,
    ProductController,
  ],
  providers: [AuthGuard],
})
export class AppModule {}
