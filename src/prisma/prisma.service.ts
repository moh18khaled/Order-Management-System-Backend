import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  constructor(private prisma: PrismaClient) {}

  async onModuleInit() {
    await this.prisma.$connect();
    console.log('database connected.');
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
    console.log('database disconnected');
  }

  // Add a product to the user's cart
  async add(userId: string, productId: string, quantity: number) {
    const user = await this.User(userId);

    if (!user) throw new NotFoundException(`User with ID ${userId} not found.`);

    const product = await this.Product(productId);

    if (!product)
      throw new NotFoundException(`Product with ID ${productId} not found.`);

    const cartId = user.CartId;

    let productToCart = await this.ProductToCart(productId, cartId);

    if (!productToCart) {

      // Check if the requested quantity exceeds available stock
      if (quantity > product.stock) {
        throw new BadRequestException(
          `Stock is insufficient for the requested quantity (${quantity}) of product ${productId}. Current stock: ${product.stock}.`,
        );
      }

      productToCart = await this.prisma.cartAndProduct.create({
        data: {
          productId,
          cartId,
          quantity,
        },
      });

      // Add product to products array
      await this.prisma.cart.update({
        where: {
          cartId,
        },
        data: {
          products: {
            connect: { productId: productId },
          },
        },
      });

      // Decrease product stock
      await this.prisma.products.update({
        where: {
          productId,
        },
        data: {
          stock: {
            decrement: quantity,
          },
        },
      });
    } else {
      // If product is already in cart, update the quantity
      this.Update(productId, cartId, quantity);
    }
  }

  // View the user's cart
  async view(userId: string) {
    const user = await this.User(userId);

    if (!user) throw new NotFoundException(`User with ID ${userId} not found.`);

    // Retrieve the user's cart including products, relations and user
    const cart = await this.prisma.cart.findFirst({
      where: {
        cartId: user.CartId,
      },
      include: {
        user: true,
        products: true,
        CartToProduct: true,
      },
    });

    return cart;
  }

  // Update a product's quantity in the cart
  async Update(productId: string, cartId: string, quantity: number) {
    const product = await this.Product(productId);

    if (!product)
      throw new NotFoundException(`Product with ID ${productId} not found.`);

    const cart = await this.Cart(cartId);

    if (!cart) throw new NotFoundException(`Cart with ID ${cartId} not found.`);

    const productToCart = await this.ProductToCart(productId, cartId);

    if (!productToCart) {
      throw new NotFoundException(`Product ${productId} is not in the cart.`);
    }

    // Check if the requested quantity exceeds available stock
    if (quantity > product.stock + productToCart.quantity) {
      // Check if the product is not currently in the cart
      if (!productToCart.quantity) await this.remove(productId, cartId);

      throw new BadRequestException(
        `Stock is insufficient for the requested quantity (${quantity}) of product ${productId}. Current stock: ${product.stock}.`,
      );
    }

    // If quantity is zero, remove the product from the cart
    if (!quantity) {
      this.remove(productId, cartId);
    } else {
      // Update product stock
      await this.prisma.products.update({
        where: {
          productId,
        },
        data: {
          stock: {
            increment: productToCart.quantity,
          },
        },
      });

      // Update product stock
      await this.prisma.products.update({
        where: {
          productId,
        },
        data: {
          stock: {
            decrement: quantity,
          },
        },
      });

      // Update quantity
      await this.prisma.cartAndProduct.update({
        where: {
          id: productToCart.id,
        },
        data: {
          quantity,
        },
      });
    }
  }

  // Remove a product from the cart
  async remove(productId: string, cartId: string) {
    const cart = await this.Cart(cartId);
    if (!cart) throw new NotFoundException(`Cart with ID ${cartId} not found.`);

    const product = await this.Product(productId);
    if (!product)
      throw new NotFoundException(`Product with ID ${productId} not found.`);

    const productToCart = await this.ProductToCart(productId, cartId);
    if (!productToCart)
      throw new NotFoundException(`Product ${productId} is not in the cart.`);

    await this.prisma.cart.update({
      where: {
        cartId,
      },
      data: {
        products: {
          disconnect: {
            productId, // Remove product from the array
          },
        },
      },
    });

    // Return product quantity to the stock
    await this.prisma.products.update({
      where: {
        productId,
      },
      data: {
        stock: {
          increment: productToCart.quantity,
        },
      },
    });

    await this.prisma.cartAndProduct.delete({
      where: {
        id: productToCart.id,
      },
    });
  }

  // return user
  async User(userId: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        userId,
      },
    });

    return user;
  }

  // return product
  async Product(productId: string) {
    const productToCart = await this.prisma.products.findFirst({
      where: {
        productId,
      },
    });

    return productToCart;
  }

  // return cart
  async Cart(cartId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: {
        cartId,
      },
    });

    return cart;
  }

  // return productToCart
  async ProductToCart(productId: string, cartId: string) {
    const productToCart = await this.prisma.cartAndProduct.findFirst({
      where: {

        productId,
        cartId
      },
    });

    return productToCart;
  }
}
