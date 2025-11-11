import pool from '../config/database.js';

const keranjangsHandler = [
  {
    method: 'GET',
    path: '/keranjangs',
    handler: async (request, h) => {
      try {
        const { 'product.id': productId } = request.query;

        let query = `
          SELECT 
            k.id,
            k.jumlah,
            k.total_harga,
            k.keterangan,
            json_build_object(
              'id', p.id,
              'kode', p.kode,
              'nama', p.nama,
              'harga', p.harga,
              'gambar', p.gambar,
              'kategori', json_build_object('id', c.id, 'nama', c.nama)
            ) as product
          FROM keranjangs k
          JOIN products p ON k.product_id = p.id
          JOIN categories c ON p.category_id = c.id
        `;

        const params = [];

        if (productId) {
          query += ' WHERE k.product_id = $1';
          params.push(productId);
        }

        query += ' ORDER BY k.id DESC';

        const result = await pool.query(query, params);

        return h.response(result.rows).code(200);
      } catch (error) {
        console.error('Error fetching keranjangs:', error);
        return h.response({
          status: 'error',
          message: 'Failed to fetch keranjangs'
        }).code(500);
      }
    },
  },
  {
    method: 'GET',
    path: '/keranjangs/{id}',
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const result = await pool.query(
          `SELECT 
            k.id,
            k.jumlah,
            k.total_harga,
            k.keterangan,
            json_build_object(
              'id', p.id,
              'kode', p.kode,
              'nama', p.nama,
              'harga', p.harga,
              'gambar', p.gambar,
              'kategori', json_build_object('id', c.id, 'nama', c.nama)
            ) as product
          FROM keranjangs k
          JOIN products p ON k.product_id = p.id
          JOIN categories c ON p.category_id = c.id
          WHERE k.id = $1`,
          [id]
        );

        if (result.rows.length === 0) {
          return h.response({
            status: 'error',
            message: 'Keranjang not found'
          }).code(404);
        }

        return h.response(result.rows[0]).code(200);
      } catch (error) {
        console.error('Error fetching keranjang:', error);
        return h.response({
          status: 'error',
          message: 'Failed to fetch keranjang'
        }).code(500);
      }
    },
  },
  {
    method: 'POST',
    path: '/keranjangs',
    handler: async (request, h) => {
      try {
        const { product, jumlah, total_harga, keterangan } = request.payload;
        
        const result = await pool.query(
          `INSERT INTO keranjangs (product_id, jumlah, total_harga, keterangan)
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [product.id, jumlah, total_harga, keterangan || null]
        );

        // Get full data with product info
        const fullData = await pool.query(
          `SELECT 
            k.id,
            k.jumlah,
            k.total_harga,
            k.keterangan,
            json_build_object(
              'id', p.id,
              'kode', p.kode,
              'nama', p.nama,
              'harga', p.harga,
              'gambar', p.gambar,
              'kategori', json_build_object('id', c.id, 'nama', c.nama)
            ) as product
          FROM keranjangs k
          JOIN products p ON k.product_id = p.id
          JOIN categories c ON p.category_id = c.id
          WHERE k.id = $1`,
          [result.rows[0].id]
        );

        return h.response({
          status: 'success',
          message: 'Item berhasil ditambahkan ke keranjang',
          data: fullData.rows[0]
        }).code(201);
      } catch (error) {
        console.error('Error creating keranjang:', error);
        return h.response({
          status: 'error',
          message: 'Failed to create keranjang'
        }).code(500);
      }
    },
  },
  {
    method: 'PUT',
    path: '/keranjangs/{id}',
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const { product, jumlah, total_harga, keterangan } = request.payload;

        const result = await pool.query(
          `UPDATE keranjangs 
           SET product_id = $1, jumlah = $2, total_harga = $3, keterangan = $4
           WHERE id = $5 RETURNING *`,
          [product.id, jumlah, total_harga, keterangan || null, id]
        );

        if (result.rows.length === 0) {
          return h.response({
            status: 'error',
            message: 'Keranjang not found'
          }).code(404);
        }

        // Get full data with product info
        const fullData = await pool.query(
          `SELECT 
            k.id,
            k.jumlah,
            k.total_harga,
            k.keterangan,
            json_build_object(
              'id', p.id,
              'kode', p.kode,
              'nama', p.nama,
              'harga', p.harga,
              'gambar', p.gambar,
              'kategori', json_build_object('id', c.id, 'nama', c.nama)
            ) as product
          FROM keranjangs k
          JOIN products p ON k.product_id = p.id
          JOIN categories c ON p.category_id = c.id
          WHERE k.id = $1`,
          [id]
        );

        return h.response({
          status: 'success',
          message: 'Item berhasil diupdate',
          data: fullData.rows[0]
        }).code(200);
      } catch (error) {
        console.error('Error updating keranjang:', error);
        return h.response({
          status: 'error',
          message: 'Failed to update keranjang'
        }).code(500);
      }
    },
  },
  {
    method: 'DELETE',
    path: '/keranjangs/{id}',
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const result = await pool.query(
          'DELETE FROM keranjangs WHERE id = $1 RETURNING *',
          [id]
        );

        if (result.rows.length === 0) {
          return h.response({
            status: 'error',
            message: 'Keranjang not found'
          }).code(404);
        }

        return h.response({
          status: 'success',
          message: 'Item berhasil dihapus'
        }).code(200);
      } catch (error) {
        console.error('Error deleting keranjang:', error);
        return h.response({
          status: 'error',
          message: 'Failed to delete keranjang'
        }).code(500);
      }
    },
  },
];

export default keranjangsHandler;