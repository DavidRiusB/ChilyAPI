import { createProductDto } from "src/modules/products/createProduct.dto";

export const productsSeed = [
  {
    name: "Yordle Snack",
    description: "La snack más deliciosa de los yordles",
    price: 13500,
    img: "https://example.com/yordle_snack.jpg",
    available: true,
    category: ["SNACKS"],
  },
  {
    name: "Demacian Bread",
    description: "El pan más delicioso de Demacia",
    price: 12000,
    img: "https://example.com/demacian_bread.jpg",
    available: true,
    category: ["BAKERY"],
  },
  {
    name: "Piltover Pie",
    description: "La tarta más exquisita de Piltover",
    price: 15000,
    img: "https://example.com/piltover_pie.jpg",
    available: true,
    category: ["BAKERY"],
  },
  {
    name: "Noxian Stew",
    description: "El estofado más robusto de Noxus",
    price: 20000,
    img: "https://example.com/noxian_stew.jpg",
    available: true,
    category: ["MEALS"],
  },
  {
    name: "Ionia Tea",
    description: "El té más relajante de Ionia",
    price: 10000,
    img: "https://example.com/ionia_tea.jpg",
    available: true,
    category: ["BEVERAGES"],
  },
];
