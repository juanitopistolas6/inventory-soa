import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from 'src/types/user'
import { CreateUserDto } from './dto/user.dto'

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private UserModel: Model<User>) {}

  async Create(userDto: CreateUserDto) {
    try {
      return await this.UserModel.create({ ...userDto })
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async findUser(user: string) {
    const userFound = await this.UserModel.findOne({ user })

    if (!userFound) throw new NotFoundException()

    return userFound
  }

  async findUserById(id: string) {
    const userFound = await this.UserModel.findById(id)

    if (!userFound) throw new NotFoundException()

    return userFound
  }
}
