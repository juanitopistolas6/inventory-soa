import { Global, Module } from '@nestjs/common'
import { SomeService } from './someService'

@Global()
@Module({
  providers: [SomeService],
  exports: [SomeService],
})
export class SomeModule {}
