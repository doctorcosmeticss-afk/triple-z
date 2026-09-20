import { json } from '@tanstack/react-start/server';
import { createAPIFileRoute } from '@tanstack/react-start/api';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export const APIRoute = createAPIFileRoute('/api/products')({
  GET: async ({ request }) => {
    try {
      await connectDB();

      const url = new URL(request.url);
      const category = url.searchParams.get('category');
      const slug = url.searchParams.get('slug');

      let query: any = {};
      if (category) query.category = category;
      if (slug) query.slug = slug;

      const products = await Product.find(query).sort({ createdAt: -1 });
      return json({ success: true, products });
    } catch (error) {
      console.error('Get products error:', error);
      return json({ error: 'Internal server error' }, { status: 500 });
    }
  },
});
