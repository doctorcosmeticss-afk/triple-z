import { json } from '@tanstack/react-start/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET - Get all products
export async function GET({ request }: { request: Request }) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');

    let query: any = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create product
export async function POST({ request }: { request: Request }) {
  try {
    const data = await request.json();

    await connectDB();

    const product = new Product(data);
    await product.save();

    return json({ success: true, product });
  } catch (error: any) {
    console.error('Create product error:', error);
    if (error.code === 11000) {
      return json({ error: 'Product with this slug already exists' }, { status: 400 });
    }
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update product
export async function PUT({ request }: { request: Request }) {
  try {
    const { id, ...data } = await request.json();

    if (!id) {
      return json({ error: 'Product ID is required' }, { status: 400 });
    }

    await connectDB();

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    if (!product) {
      return json({ error: 'Product not found' }, { status: 404 });
    }

    return json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete product
export async function DELETE({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return json({ error: 'Product ID is required' }, { status: 400 });
    }

    await connectDB();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return json({ error: 'Product not found' }, { status: 404 });
    }

    return json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
