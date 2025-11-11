// server.js
import Hapi from '@hapi/hapi';
import routes from './routes/index.js';
import Inert from '@hapi/inert';

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


  // daftarkan semua route dari routes/index.js
  server.route(routes);

  await server.start();
  console.log('🚀 Server berjalan pada:', server.info.uri);
};

init();
