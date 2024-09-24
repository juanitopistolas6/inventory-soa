import { NestFactory } from '@nestjs/core'
import { ProductModule } from './product.module'
import { TcpOptions, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ProductModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: new ConfigService().get('PORT'),
    },
  } as TcpOptions)

  await app.listen()
}
bootstrap()
