// handlers/categories.js
const categoriesHandler = [
  {
    method: 'GET',
    path: '/categories',
    handler: (request, h) => {
      const categories = [
        { id: 1, name: 'Makanan' },
        { id: 2, name: 'Minuman' },
        { id: 3, name: 'Snack' },
      ];

      return h.response(categories).code(200);
    },
  },
];

export default categoriesHandler;
