import { Category, Product } from './types';

export const WHATSAPP_PHONE = "5532999846921";

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Todos', image: 'https://picsum.photos/id/431/200/200' },
  { id: 'cakes', name: 'Bolos', image: 'https://picsum.photos/id/1080/200/200' },
  { id: 'tarts', name: 'Tortas', image: 'https://picsum.photos/id/292/200/200' },
  { id: 'croissants', name: 'Viennoiserie', image: 'https://picsum.photos/id/493/200/200' },
  { id: 'macarons', name: 'Macarons', image: 'https://picsum.photos/id/835/200/200' },
  { id: 'cookies', name: 'Cookies', image: 'https://picsum.photos/id/365/200/200' },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Red Velvet Royale',
    description: 'Bolo red velvet clássico com camadas de cream cheese frosting suave e notas de baunilha de Madagascar.',
    price: 180.00,
    categoryId: 'cakes',
    ingredients: 'Farinha de trigo, cacau, buttermilk, vinagre, cream cheese, baunilha.',
    images: [
      'https://picsum.photos/id/1080/800/800',
      'https://picsum.photos/id/488/800/800',
    ]
  },
  {
    id: '2',
    name: 'Tarte au Citron',
    description: 'Torta de limão siciliano com merengue italiano maçaricado. Acidez equilibrada com a doçura do merengue.',
    price: 85.00,
    categoryId: 'tarts',
    ingredients: 'Massa sablée, creme de limão siciliano, merengue italiano.',
    images: [
      'https://picsum.photos/id/292/800/800',
      'https://picsum.photos/id/493/800/800',
    ]
  },
  {
    id: '3',
    name: 'Croissant Au Beurre',
    description: 'Croissant tradicional francês, feito com manteiga AOP e fermentação longa de 48 horas.',
    price: 15.00,
    categoryId: 'croissants',
    ingredients: 'Farinha T45, manteiga extra, fermento natural, leite.',
    images: [
      'https://picsum.photos/id/493/800/800',
    ]
  },
  {
    id: '4',
    name: 'Box Macarons (12 un)',
    description: 'Seleção de macarons sortidos: Pistache, Framboesa, Chocolate Belga e Caramelo Salgado.',
    price: 120.00,
    categoryId: 'macarons',
    ingredients: 'Farinha de amêndoas, claras, açúcar, ganache de chocolate, frutas.',
    images: [
      'https://picsum.photos/id/835/800/800',
      'https://picsum.photos/id/431/800/800',
    ]
  },
  {
    id: '5',
    name: 'Dark Chocolate Cookie',
    description: 'Cookie de chocolate 70% com pedaços de avelã e flor de sal.',
    price: 18.00,
    categoryId: 'cookies',
    images: [
      'https://picsum.photos/id/365/800/800',
    ]
  },
  {
    id: '6',
    name: 'Strawberry Cheesecake',
    description: 'Cheesecake estilo NY com calda de morangos frescos cozidos lentamente.',
    price: 22.00,
    categoryId: 'cakes',
    images: [
      'https://picsum.photos/id/429/800/800',
    ]
  },
];