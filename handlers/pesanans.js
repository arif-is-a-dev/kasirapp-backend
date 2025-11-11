// handlers/pesanans.js
const pesanans = [];

const pesanansHandler = [
  {
    method: 'GET',
    path: '/pesanans',
    handler: (request, h) => {
      return h.response(pesanans).code(200);
    },
  },
  {
    method: 'POST',
    path: '/pesanans',
    handler: (request, h) => {
      const order = request.payload;
      pesanans.push(order);

      return h
        .response({
          status: 'success',
          message: 'Pesanan berhasil dibuat',
          data: order,
        })
        .code(201);
    },
  },
];

export default pesanansHandler;
