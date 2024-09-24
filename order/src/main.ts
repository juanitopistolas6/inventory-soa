import { NestFactory } from '@nestjs/core'
import { AppModule } from './order.module'
import { TcpOptions, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config/dist/config.service'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: new ConfigService().get('PORT'),
    },
  } as TcpOptions)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )

  await app.listen()
}
bootstrap()
