// routes/index.js
import categoriesHandler from '../handlers/categories.js';
import productsHandler from '../handlers/products.js';
import keranjangsHandler from '../handlers/keranjangs.js';
import pesanansHandler from '../handlers/pesanans.js';

const routes = [
  ...categoriesHandler,
  ...productsHandler,
  ...keranjangsHandler,
  ...pesanansHandler,
];

export default routes;