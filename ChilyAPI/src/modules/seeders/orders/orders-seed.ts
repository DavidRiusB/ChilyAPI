export const ordersSeed = [
  {
    productsInOrder: [
      {
        productId: 1,
        quantity: 1,
        price: 15.4,
        name: "Burrito",
      },
      {
        productId: 5,
        quantity: 2,
        price: 5.9,
        name: "Tacos",
      },
    ],
    couponId: "",
    couponDiscount: 1,
    userId: 4,
    addressId: 1,
    total: 21.3,
    formBuy: "tarjeta",
    orderInstructions: "Sin cebolla",
  },
  {
    productsInOrder: [
      {
        productId: 2,
        quantity: 3,
        price: 7.5,
        name: "Quesadilla",
      },
    ],
    couponId: "",
    couponDiscount: 0,
    userId: 9,
    addressId: 3,
    total: 22.5,
    formBuy: "efectivo",
    orderInstructions: "Con extra queso",
  },
  // Genera más órdenes aquí
  {
    productsInOrder: [
      {
        productId: 3,
        quantity: 2,
        price: 10.0,
        name: "Enchiladas",
      },
      {
        productId: 6,
        quantity: 1,
        price: 8.5,
        name: "Guacamole",
      },
    ],
    couponId: "",
    couponDiscount: 0,
    userId: 5,
    addressId: 2,
    total: 18.5,
    formBuy: "efectivo",
    orderInstructions: "Picante medio",
  },
  // Añade más órdenes según el patrón especificado
];

// Generar 47 órdenes más con userIds del 4 al 9 y addressIds asignados en pares
for (let i = 0; i < 47; i++) {
  const userId = Math.floor(Math.random() * 6) + 4; // Genera userIds del 4 al 9
  const addressId = userId * 2 - 1; // Calcula el addressId según el patrón

  const order = {
    productsInOrder: [
      {
        productId: Math.floor(Math.random() * 10) + 1, // IDs de productos de ejemplo
        quantity: Math.floor(Math.random() * 3) + 1, // Cantidad aleatoria entre 1 y 3
        price: Math.random() * 20, // Precio aleatorio
        name: "Producto de ejemplo",
      },
      {
        productId: Math.floor(Math.random() * 10) + 1,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: Math.random() * 20,
        name: "Otro producto",
      },
    ],
    couponId: "",
    couponDiscount: 0,
    userId: userId,
    addressId: addressId,
    total: Math.random() * 50, // Total aleatorio
    formBuy: Math.random() < 0.5 ? "tarjeta" : "efectivo", // Forma de compra aleatoria
    orderInstructions: "Instrucciones de la orden",
  };

  ordersSeed.push(order);
}

// console.log(ordersSeed); // Muestra los datos generados en la consola
