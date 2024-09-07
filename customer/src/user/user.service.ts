import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from 'src/types/user'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findAll() {
    return await this.userModel.find()
  }

  async Customer(id: string, field?: string) {
    try {
      const user = this.userModel.findOne({ _id: id }).select(field)

      if (!user) throw new NotFoundException()

      return user
    } catch {
      throw new BadRequestException()
    }
  }

  async changePassowrd(id: string, password: string) {
    try {
      return await this.userModel.findByIdAndUpdate(
        id,
        { password },
        { new: true },
      )
    } catch {
      throw new BadRequestException()
    }
  }

  async updateCustomer(id: string, updateUser: UpdateUserDto) {
    try {
      return await this.userModel.findByIdAndUpdate(
        id,
        { $set: updateUser },
        { new: true },
      )
    } catch {
      throw new BadRequestException('Error updating customer!')
    }
  }
}
