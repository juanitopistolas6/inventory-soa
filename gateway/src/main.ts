import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { Transport } from '@nestjs/microservices/enums/transport.enum'
import { MicroserviceOptions } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config/dist/config.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const orden = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'orden',
      port: new ConfigService().get('SHOPPING_PORT'),
    },
  })

  const product = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'producto',
      port: new ConfigService().get('PRODUCT_PORT'),
    },
  })

  const customer = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'clientes',
      port: new ConfigService().get('CUSTOMER_PORT'),
    },
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )

  await app.startAllMicroservices()

  app.enableCors()

  await app.listen(3000)
}
bootstrap()
