import pool from '../config/database.js';

const categoriesHandler = [
  {
    method: 'GET',
    path: '/categories',
    handler: async (request, h) => {
      try {
        const result = await pool.query(
          'SELECT * FROM categories ORDER BY id ASC'
        );
        
        return h.response(result.rows).code(200);
      } catch (error) {
        console.error('Error fetching categories:', error);
        return h.response({
          status: 'error',
          message: 'Failed to fetch categories'
        }).code(500);
      }
    },
  },
  {
    method: 'GET',
    path: '/categories/{id}',
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const result = await pool.query(
          'SELECT * FROM categories WHERE id = $1',
          [id]
        );
        
        if (result.rows.length === 0) {
          return h.response({
            status: 'error',
            message: 'Category not found'
          }).code(404);
        }
        
        return h.response(result.rows[0]).code(200);
      } catch (error) {
        console.error('Error fetching category:', error);
        return h.response({
          status: 'error',
          message: 'Failed to fetch category'
        }).code(500);
      }
    },
  },
  {
    method: 'POST',
    path: '/categories',
    handler: async (request, h) => {
      try {
        const { nama } = request.payload;
        const result = await pool.query(
          'INSERT INTO categories (nama) VALUES ($1) RETURNING *',
          [nama]
        );
        
        return h.response({
          status: 'success',
          message: 'Category created successfully',
          data: result.rows[0]
        }).code(201);
      } catch (error) {
        console.error('Error creating category:', error);
        return h.response({
          status: 'error',
          message: 'Failed to create category'
        }).code(500);
      }
    },
  },
  {
    method: 'PUT',
    path: '/categories/{id}',
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const { nama } = request.payload;
        
        const result = await pool.query(
          'UPDATE categories SET nama = $1 WHERE id = $2 RETURNING *',
          [nama, id]
        );
        
        if (result.rows.length === 0) {
          return h.response({
            status: 'error',
            message: 'Category not found'
          }).code(404);
        }
        
        return h.response({
          status: 'success',
          message: 'Category updated successfully',
          data: result.rows[0]
        }).code(200);
      } catch (error) {
        console.error('Error updating category:', error);
        return h.response({
          status: 'error',
          message: 'Failed to update category'
        }).code(500);
      }
    },
  },
  {
    method: 'DELETE',
    path: '/categories/{id}',
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const result = await pool.query(
          'DELETE FROM categories WHERE id = $1 RETURNING *',
          [id]
        );
        
        if (result.rows.length === 0) {
          return h.response({
            status: 'error',
            message: 'Category not found'
          }).code(404);
        }
        
        return h.response({
          status: 'success',
          message: 'Category deleted successfully'
        }).code(200);
      } catch (error) {
        console.error('Error deleting category:', error);
        return h.response({
          status: 'error',
          message: 'Failed to delete category'
        }).code(500);
      }
    },
  },
];

export default categoriesHandler;