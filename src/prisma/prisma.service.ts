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

  // Create order
  async createOrder(userId: string) {
    const user = await this.User(userId);

    if (!user) throw new NotFoundException(`User with ID ${userId} not found.`);

    const cart = await this.prisma.cart.findFirst({
      where: {
        cartId: user.CartId,
      },
      include: {
        products: true,
        CartToProduct: true,
      },
    });

    // Cart is empty
    if (!cart.products.length)
      throw new BadRequestException(`Cart with ID ${cart.cartId} is empty.`);

    let totalPrice = 0;

    // totalPrice = productPrice * productQuantity
    for (let cartToProduct of cart.CartToProduct) {
      const product = await this.prisma.products.findFirst({
        where: {
          productId: cartToProduct.productId,
        },
      });

      if (!product)
        throw new NotFoundException(
          `Product with ID ${product.productId} not found.`,
        );

      totalPrice += cartToProduct.quantity * product.price;
    }

    await this.prisma.orders.create({
      data: {
        price: totalPrice,
        user: {
          connect: {
            userId: userId,
          },
        },
        products: {
          // Connect products from the cart to the order by productId
          connect: cart.products.map((Cart) => ({
            productId: Cart.productId,
          })),
        },
        orderDate: new Date(),
        arrivesAt: new Date(),
      },
    });

    // Clear the products array in the Cart
    await this.prisma.cart.update({
      where: { cartId: cart.cartId },
      data: {
        products: {
          set: [], // Clear the products array by setting it to an empty array
        },
      },
    });

    // Delete all cartAndProduct entries that were associated with the cart
    await this.prisma.cartAndProduct.deleteMany({
      where: {
        cartId: cart.cartId,
      },
    });
  }

  // Retrieve user's order
  async retrieveOrder(orderId: string) {
    const order = await this.prisma.orders.findFirst({
      where: {
        orderId,
      },
    });
    if (!order)
      throw new NotFoundException(`order with ID ${orderId} not found.`);

    return order;
  }

  // Updates order status
  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.prisma.orders.findFirst({
      where: {
        orderId,
      },
    });
    if (!order)
      throw new NotFoundException(`order with ID ${orderId} not found.`);

    await this.prisma.orders.update({
      where: {
        orderId,
      },
      data: {
        status,
      },
    });
  }

  // Add a product to user's cart
  async addToCart(userId: string, productId: string, quantity: number) {
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
      this.updateProductQuantity(productId, cartId, quantity);
    }
  }

  // View the user's cart
  async viewCart(userId: string) {
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
  async updateProductQuantity(productId: string, cartId: string, quantity: number) {
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
      if (!productToCart.quantity) await this.removeFromCart(productId, cartId);

      throw new BadRequestException(
        `Stock is insufficient for the requested quantity (${quantity}) of product ${productId}. Current stock: ${product.stock}.`,
      );
    }

    // If quantity is zero, remove the product from the cart
    if (!quantity) {
      this.removeFromCart(productId, cartId);
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
  async removeFromCart(productId: string, cartId: string) {
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
        cartId,
      },
    });

    return productToCart;
  }
}
