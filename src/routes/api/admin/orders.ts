import { json } from '@tanstack/react-start/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

// GET - Get all orders
export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find().sort({ createdAt: -1 });

    return json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update order status
export async function PUT({ request }: { request: Request }) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return json({ error: 'Order not found' }, { status: 404 });
    }

    return json({ success: true, order });
  } catch (error) {
    console.error('Update order error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete order
export async function DELETE({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return json({ error: 'Order ID is required' }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return json({ error: 'Order not found' }, { status: 404 });
    }

    return json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
