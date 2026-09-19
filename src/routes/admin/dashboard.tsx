import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Package, ShoppingBag, Tag, FileEdit, Mail } from "lucide-react";
import { toast } from "sonner";
import AddProductTab from "@/components/admin/AddProductTab";
import ManageProductsTab from "@/components/admin/ManageProductsTab";
import OrdersTab from "@/components/admin/OrdersTab";
import PromoCodesTab from "@/components/admin/PromoCodesTab";
import NewsletterTab from "@/components/admin/NewsletterTab";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    title: "Admin Dashboard - Triple-Z Store",
    meta: [
      { name: "description", content: "Admin dashboard for Triple-Z Store management" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("add-product");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      navigate({ to: "/admin/login" });
      return;
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    toast.success("Logged out successfully");
    navigate({ to: "/admin/login" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-sm sm:text-xl font-bold text-black">
                  Triple-Z Admin
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block">Store Management</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="gap-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 gap-1 bg-gray-100 p-1 rounded-lg h-auto">
            <TabsTrigger
              value="add-product"
              className="flex items-center justify-center gap-1 py-2 px-1 text-xs sm:text-sm data-[state=active]:bg-black data-[state=active]:text-white transition-all rounded-md"
            >
              <FileEdit className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">Add</span>
            </TabsTrigger>
            <TabsTrigger
              value="manage-products"
              className="flex items-center justify-center gap-1 py-2 px-1 text-xs sm:text-sm data-[state=active]:bg-black data-[state=active]:text-white transition-all rounded-md"
            >
              <Package className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">Products</span>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex items-center justify-center gap-1 py-2 px-1 text-xs sm:text-sm data-[state=active]:bg-black data-[state=active]:text-white transition-all rounded-md"
            >
              <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">Orders</span>
            </TabsTrigger>
            <TabsTrigger
              value="promo-codes"
              className="flex items-center justify-center gap-1 py-2 px-1 text-xs sm:text-sm data-[state=active]:bg-black data-[state=active]:text-white transition-all rounded-md"
            >
              <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">Promo</span>
            </TabsTrigger>
            <TabsTrigger
              value="newsletter"
              className="flex items-center justify-center gap-1 py-2 px-1 text-xs sm:text-sm data-[state=active]:bg-black data-[state=active]:text-white transition-all rounded-md"
            >
              <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">Newsletter</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add-product" className="mt-4">
            <AddProductTab />
          </TabsContent>

          <TabsContent value="manage-products" className="mt-4">
            <ManageProductsTab />
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="promo-codes" className="mt-4">
            <PromoCodesTab />
          </TabsContent>

          <TabsContent value="newsletter" className="mt-4">
            <NewsletterTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
