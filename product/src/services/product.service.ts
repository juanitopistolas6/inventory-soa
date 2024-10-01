import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, isValidObjectId } from 'mongoose'
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

    if (!productFound) throw new NotFoundException('Product not found')

    return productFound
  }

  async Products() {
    return await this.productModel.find({})
  }

  async selectedProducts(ids: string[]) {
    try {
      if (!ids.every((id) => isValidObjectId(id)))
        throw new BadRequestException(
          'One or more invalid MongoDB IDs provided',
        )

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
    const session = await this.productModel.db.startSession()

    try {
      session.startTransaction()
      console.log('sesion iniciada...')

      for (const item of products) {
        console.log(item.product)
        const { product, units } = item

        const productFound = await this.productModel
          .findOne({ _id: product._id })
          .session(session)

        console.log('Product found:', productFound)

        if (!productFound)
          throw new NotFoundException(`Product ${product._id} was not found`)

        if (units > productFound.units)
          throw new BadRequestException('Insufficient units available')

        await productFound.updateOne({ $inc: { units: -units } }, { session })

        console.log('producto actualizado')
      }

      await session.commitTransaction()
    } catch (err) {
      console.log('hubo un error jefe')

      await session.abortTransaction()

      throw err
    } finally {
      await session.endSession()
    }
  }
}
