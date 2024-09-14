import { Module } from '@nestjs/common'
import { OrderController } from './order.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { OrderSchema } from './models/Order'
import { CartController } from './cart.controller'
import { CartSchema } from './models'
import { SomeService, OrderService, CartService } from './services'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
  ],
  controllers: [OrderController, CartController],
  providers: [OrderService, SomeService, CartService],
})
export class AppModule {}
