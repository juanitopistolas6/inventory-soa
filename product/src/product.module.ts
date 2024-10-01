import { Module } from '@nestjs/common'
import { ProductController } from './product.controller'
import { ProductService, SomeService } from './services'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { productSchema } from './models/product'
import { ClientsModule } from '@nestjs/microservices'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'ORDER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          options: {
            host: 'orden',
            port: configService.get<number>('ORDER_PORT'),
          },
        }),
      },
    ]),
    MongooseModule.forFeature([{ name: 'Product', schema: productSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService, SomeService],
})
export class ProductModule {}
