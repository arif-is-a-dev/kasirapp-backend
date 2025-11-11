// handlers/keranjangs.js
const keranjangs = [];

const keranjangsHandler = [
  {
    method: 'GET',
    path: '/keranjangs',
    handler: (request, h) => {
      return h.response(keranjangs).code(200);
    },
  },
  {
    method: 'POST',
    path: '/keranjangs',
    handler: (request, h) => {
      const item = request.payload;
      keranjangs.push(item);

      return h
        .response({
          status: 'success',
          message: 'Item berhasil ditambahkan ke keranjang',
          data: item,
        })
        .code(201);
    },
  },
];

export default keranjangsHandler;
