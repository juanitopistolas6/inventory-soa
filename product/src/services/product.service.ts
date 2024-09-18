import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, startSession } from 'mongoose'
import { IProductObject, IProductParam } from '../interfaces'
import { IProductSqueme } from '../models/product'

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private productModel: Model<IProductSqueme>,
  ) {}

  async createProduct(product: IProductParam) {
    return await this.productModel.create({ ...product })
  }

  async Product(id: string) {
    const productFound = await this.productModel.findOne({ _id: id })

    if (!productFound) throw new NotFoundException()

    return productFound
  }

  async Products() {
    return await this.productModel.find({})
  }

  async selectedProducts(ids: string[]) {
    try {
      return await this.productModel.find({ _id: { $in: ids } })
    } catch (e) {
      throw new NotFoundException(e.message)
    }
  }

  async productsByCategory(category: string) {
    const products = await this.productModel.find({ category })

    if (!products)
      throw new NotFoundException(`The category ${category} is empty`)

    return products
  }

  async checkAvailability(id: string, units: number) {
    const product = await this.productModel.findOne({ _id: id })

    if (!product) throw new NotFoundException('Product not found')

    if (product.units < units)
      throw new BadRequestException(
        'Units exceed the amount of available items in stock',
      )

    return { product, units }
  }

  async processOrder(products: IProductObject[]) {
    const session = await startSession()

    session.startTransaction()

    try {
      for (const item of products) {
        const { product, units } = item

        const productFound = await this.productModel
          .findOne({ _id: product._id })
          .session(session)

        if (!productFound)
          throw new NotFoundException(`Product ${product._id} was not found`)

        if (units > productFound.units)
          throw new BadRequestException('Insufficient units available')

        await productFound.updateOne({ $inc: { units: -units } })
      }

      await session.commitTransaction()
    } catch {
      await session.abortTransaction()
    } finally {
      session.endSession()
    }
  }
}
