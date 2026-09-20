import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Search, Edit, Trash2, Tag, Star, PackageX, PackageCheck } from "lucide-react";
import EditProductDialog from "./EditProductDialog";
import { ADMIN_API_URL, getAuthHeadersOnly, getAuthHeaders } from "@/lib/admin-api";

type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  soldOut: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  description: string;
  details: string;
};

const CATEGORIES = [
  "All",
  "T-Shirts",
  "Pants",
  "Jackets",
  "Shoes",
  "Accessories",
  "Watches",
  "Bags",
];

export default function ManageProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const loadProducts = async () => {
    try {
      const response = await fetch(`${ADMIN_API_URL}/products`, {
        headers: getAuthHeadersOnly()
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setProducts(data.products || []);
    } catch (error: any) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleDelete = async (product: Product) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `"${product.name}" will be deleted permanently`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${ADMIN_API_URL}/products/${product._id}`, {
          method: 'DELETE',
          headers: getAuthHeadersOnly()
        });

        if (!response.ok) throw new Error('Failed to delete');

        await Swal.fire({
          title: "Deleted!",
          text: "Product deleted successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#000000",
        });

        loadProducts();
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete product",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#000000",
        });
      }
    }
  };

  const handleToggleSoldOut = async (product: Product) => {
    try {
      const response = await fetch(`${ADMIN_API_URL}/products/${product._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ soldOut: !product.soldOut })
      });

      if (!response.ok) throw new Error('Failed to update');

      toast.success(product.soldOut ? "Product is now available" : "Product marked as sold out");
      loadProducts();
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleToggleNewArrival = async (product: Product) => {
    try {
      const newCount = products.filter(p => p.isNewArrival).length;
      
      if (!product.isNewArrival && newCount >= 10) {
        toast.error("Cannot add more than 10 new arrival products");
        return;
      }

      const response = await fetch(`${ADMIN_API_URL}/products/${product._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isNewArrival: !product.isNewArrival })
      });

      if (!response.ok) throw new Error('Failed to update');

      toast.success(product.isNewArrival ? "Removed from new arrivals" : "Added to new arrivals");
      loadProducts();
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleToggleBestSeller = async (product: Product) => {
    try {
      const bestSellerCount = products.filter(p => p.isBestSeller).length;
      
      if (!product.isBestSeller && bestSellerCount >= 10) {
        toast.error("Cannot add more than 10 best seller products");
        return;
      }

      const response = await fetch(`${ADMIN_API_URL}/products/${product._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isBestSeller: !product.isBestSeller })
      });

      if (!response.ok) throw new Error('Failed to update');

      toast.success(product.isBestSeller ? "Removed from best sellers" : "Added to best sellers");
      loadProducts();
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <>
      <Card className="shadow-sm border-gray-200 bg-white">
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black mb-4">Manage Products</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search for a product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-black"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 h-11 border-gray-300">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-black transition-all"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Product Image */}
                    <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                      {product.soldOut && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-bold">Sold Out</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black mb-1">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-black">
                          ${product.price}
                        </span>
                        {product.oldPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ${product.oldPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full border border-gray-300">
                          {product.category}
                        </span>
                        {product.isNewArrival && (
                          <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full border border-green-300">
                            New
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full border border-yellow-300">
                            Best Seller
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product)}
                          className="gap-1 bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingProduct(product)}
                          className="gap-1 border-gray-300 hover:bg-gray-100"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleSoldOut(product)}
                          className={`gap-1 ${product.soldOut ? "bg-green-50 text-green-600 border-green-300 hover:bg-green-100" : "bg-red-50 text-red-600 border-red-300 hover:bg-red-100"}`}
                        >
                          {product.soldOut ? (
                            <>
                              <PackageCheck className="w-4 h-4" />
                              Available
                            </>
                          ) : (
                            <>
                              <PackageX className="w-4 h-4" />
                              Sold Out
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleNewArrival(product)}
                          className={`gap-1 ${product.isNewArrival ? "bg-green-50 text-green-600 border-green-300" : "border-gray-300"}`}
                        >
                          <Tag className="w-4 h-4" />
                          {product.isNewArrival ? "Remove New" : "New"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleBestSeller(product)}
                          className={`gap-1 ${product.isBestSeller ? "bg-yellow-50 text-yellow-600 border-yellow-300" : "border-gray-300"}`}
                        >
                          <Star className="w-4 h-4" />
                          {product.isBestSeller ? "Remove Seller" : "Best Seller"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {editingProduct && (
        <EditProductDialog
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={loadProducts}
        />
      )}
    </>
  );
}
