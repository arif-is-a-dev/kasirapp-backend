const productsHandler = [
  {
    method: 'GET',
    path: '/products',
    handler: (request, h) => {
      const { category } = request.query;

      const products = [
        {
          id: 1,
          nama: 'Nasi Goreng',
          harga: 15000,
          kategori: { nama: 'Makanan' },
          gambar: 'nasi-goreng.jpg',
          kode: 'PRD001',
        },
        {
          id: 2,
          nama: 'Bakso',
          harga: 12000,
          kategori: { nama: 'Makanan' },
          gambar: 'bakso.jpg',
          kode: 'PRD002',
        },
        {
          id: 3,
          nama: 'Sate Ayam',
          harga: 18000,
          kategori: { nama: 'Makanan' },
          gambar: 'sate-ayam.jpg',
          kode: 'PRD003',
        },
      ];

      const filtered = category
        ? products.filter((p) =>
            p.kategori.nama.toLowerCase() === category.toLowerCase()
          )
        : products;

      return h.response(products).code(200);
    },
  },
];

export default productsHandler;
