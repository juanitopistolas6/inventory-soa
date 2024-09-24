import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import 'dotenv/config'
import { TcpOptions, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config/dist/config.service'

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: new ConfigService().get('port'),
    },
  } as TcpOptions)

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  await app.listen()
}
bootstrap()
