import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { userModel } from 'src/models'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userModel }])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
