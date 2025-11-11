// server.js
import Hapi from '@hapi/hapi';
import routes from './routes/index.js';
import Inert from '@hapi/inert';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'], // izinkan semua origin (frontend React)
      },
    },
  });

  await server.register(Inert);

  // Route home untuk info API
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.response({
        message: 'Kasir App API',
        version: '1.0.0',
        endpoints: {
          categories: '/categories',
          products: '/products',
          keranjangs: '/keranjangs',
          pesanans: '/pesanans'
        }
      }).code(200);
    }
  });

  // Daftarkan semua route dari routes/index.js
  server.route(routes);

  await server.start();
  console.log('🚀 Server berjalan pada:', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();