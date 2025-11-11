import pool from '../config/database.js';

const productsHandler = [
  {
    method: 'GET',
    path: '/products',
    handler: async (request, h) => {
      try {
        const { category, kategori } = request.query;
        const categoryFilter = category || kategori;

        let query = `
          SELECT 
            p.id, 
            p.kode, 
            p.nama, 
            p.harga, 
            p.gambar,
            json_build_object('id', c.id, 'nama', c.nama) as kategori
          FROM products p
          JOIN categories c ON p.category_id = c.id
        `;

        const params = [];

        if (categoryFilter) {
          query += ' WHERE LOWER(c.nama) = LOWER($1)';
          params.push(categoryFilter);
        }

        query += ' ORDER BY p.id ASC';

        const result = await pool.query(query, params);

        return h.response(result.rows).code(200);
      } catch (error) {
        console.error('Error fetching products:', error);
        return h.response({
          status: 'error',
          message: 'Failed to fetch products'
        }).code(500);
      }
    },
  },
  {
    method: 'GET',
    path: '/products/{id}',
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const result = await pool.query(
          `SELECT 
            p.id, 
            p.kode, 
            p.nama, 
            p.harga, 
            p.gambar,
            json_build_object('id', c.id, 'nama', c.nama) as kategori
          FROM products p
          JOIN categories c ON p.category_id = c.id
          WHERE p.id = $1`,
          [id]
        );

        if (result.rows.length === 0) {
          return h.response({
            status: 'error',
            message: 'Product not found'
          }).code(404);
        }

        return h.response(result.rows[0]).code(200);
      } catch (error) {
        console.error('Error fetching product:', error);
        return h.response({
          status: 'error',
          message: 'Failed to fetch product'
        }).code(500);
      }
    },
  },
  {
    method: 'POST',
    path: '/products',
    handler: async (request, h) => {
      try {
        const { kode, nama, harga, category_id, gambar } = request.payload;
        
        const result = await pool.query(
          `INSERT INTO products (kode, nama, harga, category_id, gambar) 
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [kode, nama, harga, category_id, gambar]
        );

        return h.response({
          status: 'success',
          message: 'Product created successfully',
          data: result.rows[0]
        }).code(201);
      } catch (error) {
        console.error('Error creating product:', error);
        return h.response({
          status: 'error',
          message: 'Failed to create product'
        }).code(500);
      }
    },
  },
  {
    method: 'PUT',
    path: '/products/{id}',
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const { kode, nama, harga, category_id, gambar } = request.payload;

        const result = await pool.query(
          `UPDATE products 
           SET kode = $1, nama = $2, harga = $3, category_id = $4, gambar = $5
           WHERE id = $6 RETURNING *`,
          [kode, nama, harga, category_id, gambar, id]
        );

        if (result.rows.length === 0) {
          return h.response({
            status: 'error',
            message: 'Product not found'
          }).code(404);
        }

        return h.response({
          status: 'success',
          message: 'Product updated successfully',
          data: result.rows[0]
        }).code(200);
      } catch (error) {
        console.error('Error updating product:', error);
        return h.response({
          status: 'error',
          message: 'Failed to update product'
        }).code(500);
      }
    },
  },
  {
    method: 'DELETE',
    path: '/products/{id}',
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const result = await pool.query(
          'DELETE FROM products WHERE id = $1 RETURNING *',
          [id]
        );

        if (result.rows.length === 0) {
          return h.response({
            status: 'error',
            message: 'Product not found'
          }).code(404);
        }

        return h.response({
          status: 'success',
          message: 'Product deleted successfully'
        }).code(200);
      } catch (error) {
        console.error('Error deleting product:', error);
        return h.response({
          status: 'error',
          message: 'Failed to delete product'
        }).code(500);
      }
    },
  },
];

export default productsHandler;