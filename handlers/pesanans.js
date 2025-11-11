import pool from '../config/database.js';

const pesanansHandler = [
  {
    method: 'GET',
    path: '/pesanans',
    handler: async (request, h) => {
      try {
        const result = await pool.query(`
          SELECT 
            p.id,
            p.total_bayar,
            p.status,
            p.created_at,
            json_agg(
              json_build_object(
                'id', pd.id,
                'jumlah', pd.jumlah,
                'total_harga', pd.total_harga,
                'keterangan', pd.keterangan,
                'product', json_build_object(
                  'id', pr.id,
                  'kode', pr.kode,
                  'nama', pr.nama,
                  'harga', pr.harga,
                  'gambar', pr.gambar,
                  'kategori', json_build_object('id', c.id, 'nama', c.nama)
                )
              )
            ) as menus
          FROM pesanans p
          LEFT JOIN pesanan_details pd ON p.id = pd.pesanan_id
          LEFT JOIN products pr ON pd.product_id = pr.id
          LEFT JOIN categories c ON pr.category_id = c.id
          GROUP BY p.id
          ORDER BY p.created_at DESC
        `);

        return h.response(result.rows).code(200);
      } catch (error) {
        console.error('Error fetching pesanans:', error);
        return h.response({
          status: 'error',
          message: 'Failed to fetch pesanans'
        }).code(500);
      }
    },
  },
  {
    method: 'GET',
    path: '/pesanans/{id}',
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const result = await pool.query(`
          SELECT 
            p.id,
            p.total_bayar,
            p.status,
            p.created_at,
            json_agg(
              json_build_object(
                'id', pd.id,
                'jumlah', pd.jumlah,
                'total_harga', pd.total_harga,
                'keterangan', pd.keterangan,
                'product', json_build_object(
                  'id', pr.id,
                  'kode', pr.kode,
                  'nama', pr.nama,
                  'harga', pr.harga,
                  'gambar', pr.gambar,
                  'kategori', json_build_object('id', c.id, 'nama', c.nama)
                )
              )
            ) as menus
          FROM pesanans p
          LEFT JOIN pesanan_details pd ON p.id = pd.pesanan_id
          LEFT JOIN products pr ON pd.product_id = pr.id
          LEFT JOIN categories c ON pr.category_id = c.id
          WHERE p.id = $1
          GROUP BY p.id
        `, [id]);

        if (result.rows.length === 0) {
          return h.response({
            status: 'error',
            message: 'Pesanan not found'
          }).code(404);
        }

        return h.response(result.rows[0]).code(200);
      } catch (error) {
        console.error('Error fetching pesanan:', error);
        return h.response({
          status: 'error',
          message: 'Failed to fetch pesanan'
        }).code(500);
      }
    },
  },
  {
    method: 'POST',
    path: '/pesanans',
    handler: async (request, h) => {
      const client = await pool.connect();
      
      try {
        const { total_bayar, menus } = request.payload;

        // Start transaction
        await client.query('BEGIN');

        // Insert pesanan
        const pesananResult = await client.query(
          `INSERT INTO pesanans (total_bayar, status) 
           VALUES ($1, $2) RETURNING *`,
          [total_bayar, 'completed']
        );

        const pesananId = pesananResult.rows[0].id;

        // Insert pesanan details
        for (const menu of menus) {
          await client.query(
            `INSERT INTO pesanan_details (pesanan_id, product_id, jumlah, total_harga, keterangan)
             VALUES ($1, $2, $3, $4, $5)`,
            [pesananId, menu.product.id, menu.jumlah, menu.total_harga, menu.keterangan || null]
          );
        }

        // Commit transaction
        await client.query('COMMIT');

        // Get full data
        const fullData = await pool.query(`
          SELECT 
            p.id,
            p.total_bayar,
            p.status,
            p.created_at,
            json_agg(
              json_build_object(
                'id', pd.id,
                'jumlah', pd.jumlah,
                'total_harga', pd.total_harga,
                'keterangan', pd.keterangan,
                'product', json_build_object(
                  'id', pr.id,
                  'kode', pr.kode,
                  'nama', pr.nama,
                  'harga', pr.harga,
                  'gambar', pr.gambar,
                  'kategori', json_build_object('id', c.id, 'nama', c.nama)
                )
              )
            ) as menus
          FROM pesanans p
          LEFT JOIN pesanan_details pd ON p.id = pd.pesanan_id
          LEFT JOIN products pr ON pd.product_id = pr.id
          LEFT JOIN categories c ON pr.category_id = c.id
          WHERE p.id = $1
          GROUP BY p.id
        `, [pesananId]);

        return h.response({
          status: 'success',
          message: 'Pesanan berhasil dibuat',
          data: fullData.rows[0]
        }).code(201);
      } catch (error) {
        // Rollback on error
        await client.query('ROLLBACK');
        console.error('Error creating pesanan:', error);
        return h.response({
          status: 'error',
          message: 'Failed to create pesanan'
        }).code(500);
      } finally {
        client.release();
      }
    },
  },
  {
    method: 'PUT',
    path: '/pesanans/{id}',
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const { status } = request.payload;

        const result = await pool.query(
          `UPDATE pesanans SET status = $1 WHERE id = $2 RETURNING *`,
          [status, id]
        );

        if (result.rows.length === 0) {
          return h.response({
            status: 'error',
            message: 'Pesanan not found'
          }).code(404);
        }

        return h.response({
          status: 'success',
          message: 'Pesanan updated successfully',
          data: result.rows[0]
        }).code(200);
      } catch (error) {
        console.error('Error updating pesanan:', error);
        return h.response({
          status: 'error',
          message: 'Failed to update pesanan'
        }).code(500);
      }
    },
  },
  {
    method: 'DELETE',
    path: '/pesanans/{id}',
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const result = await pool.query(
          'DELETE FROM pesanans WHERE id = $1 RETURNING *',
          [id]
        );

        if (result.rows.length === 0) {
          return h.response({
            status: 'error',
            message: 'Pesanan not found'
          }).code(404);
        }

        return h.response({
          status: 'success',
          message: 'Pesanan deleted successfully'
        }).code(200);
      } catch (error) {
        console.error('Error deleting pesanan:', error);
        return h.response({
          status: 'error',
          message: 'Failed to delete pesanan'
        }).code(500);
      }
    },
  },
];

export default pesanansHandler;