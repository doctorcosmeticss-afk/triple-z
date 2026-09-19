import { queryOptions } from "@tanstack/react-query";
import { api } from "./api";
import type { Product } from "./store";

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const products = await api.getProducts();
    
    // Map MongoDB fields to frontend format
    return products.map((p: any) => ({
      id: p._id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category: p.category,
      description: p.description,
      details: p.details,
      price: p.price,
      old_price: p.oldPrice,
      sizes: p.sizes,
      colors: p.colors,
      images: p.images,
      is_new: p.isNewArrival,
      is_best_seller: p.isBestSeller,
      sold_out: p.soldOut,
      stock: p.stock,
      rating: p.rating,
      created_at: p.createdAt,
    }));
  },
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
});
