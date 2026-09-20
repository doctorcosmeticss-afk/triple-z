import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Trash2, Calendar, User, MapPin, Phone, CreditCard, Package } from "lucide-react";
import { format } from "date-fns";
import { ADMIN_API_URL, getAuthHeadersOnly, getAuthHeaders } from "@/lib/admin-api";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  qty: number;
  image?: string;
};

type Order = {
  _id: string;
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  phone2?: string; // إضافة الرقم التاني
  governorate: string;
  city?: string;
  addressLine: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: string;
  payerAccount?: string;
  payerName?: string;
  transferAmount?: number;
  paymentProofPath?: string;
  promoCode?: string;
  status: string;
  notes?: string; // إضافة النوتس
  createdAt: string;
};

const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  { value: "processing", label: "Processing", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800 border-green-300" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800 border-red-300" },
];

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch(`${ADMIN_API_URL}/orders`, {
        headers: getAuthHeadersOnly()
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setOrders(data.orders || []);
    } catch (error: any) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (order: Order) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Order #${order.orderNumber} will be deleted permanently`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${ADMIN_API_URL}/orders/${order._id}`, {
          method: 'DELETE',
          headers: getAuthHeadersOnly()
        });

        if (!response.ok) throw new Error('Failed to delete');

        toast.success("Order deleted successfully");
        loadOrders();
      } catch (error) {
        toast.error("Failed to delete order");
      }
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`${ADMIN_API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update');

      toast.success("Order status updated");
      loadOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusObj = ORDER_STATUSES.find((s) => s.value === status);
    return statusObj || ORDER_STATUSES[0];
  };

  if (loading) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm sm:text-base">Loading orders...</p>
      </div>
    );
  }

  return (
    <>
      <Card className="shadow-sm border-gray-200 bg-white">
        <CardContent className="p-3 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">Orders ({orders.length})</h2>

          <div className="space-y-4 sm:space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-base sm:text-lg">No orders found</p>
              </div>
            ) : (
              orders.map((order) => {
                const statusBadge = getStatusBadge(order.status);

                return (
                  <Card key={order._id} className="border-2 border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-200 w-full">
                    <CardContent className="p-3 sm:p-6">
                      {/* Order Header - Mobile Optimized */}
                      <div className="space-y-3 mb-4 pb-3 border-b border-gray-200">
                        {/* Order Number and Date */}
                        <div className="flex flex-col space-y-2">
                          <h3 className="text-lg sm:text-xl font-bold text-black">
                            Order #{order.orderNumber}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-600">
                              {format(new Date(order.createdAt), "MMM dd, yyyy - HH:mm")}
                            </span>
                          </div>
                        </div>
                        
                        {/* Status and Delete Button */}
                        <div className="flex items-center justify-between gap-3">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border ${statusBadge.color}`}>
                            {statusBadge.label}
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(order)}
                            className="gap-1 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </div>

                      {/* Product Details - Mobile Optimized */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-black mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                          Products
                        </h4>
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                              <div className="flex gap-3">
                                {/* Product Image */}
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                      📦
                                    </div>
                                  )}
                                </div>
                                
                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-black text-sm sm:text-base break-words mb-2">{item.name}</p>
                                  <div className="grid grid-cols-2 gap-1 text-xs">
                                    <div className="bg-blue-100 px-2 py-1 rounded text-blue-800 font-semibold">
                                      {item.price} EGP
                                    </div>
                                    <div className="bg-green-100 px-2 py-1 rounded text-green-800 font-semibold">
                                      Qty: {item.qty}
                                    </div>
                                    <div className="bg-purple-100 px-2 py-1 rounded text-purple-800 font-semibold">
                                      Size: {item.size}
                                    </div>
                                    <div className="bg-orange-100 px-2 py-1 rounded text-orange-800 font-semibold">
                                      Color: {item.color}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer Information - Mobile Optimized */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-black mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <User className="w-4 h-4 sm:w-5 sm:h-5" />
                          Customer
                        </h4>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 space-y-3">
                          {/* Name */}
                          <div>
                            <span className="text-xs text-blue-600 font-medium block">Name</span>
                            <p className="font-bold text-black text-sm break-words">{order.fullName}</p>
                          </div>
                          
                          {/* Email */}
                          <div>
                            <span className="text-xs text-blue-600 font-medium block">Email</span>
                            <p className="font-bold text-black text-xs break-all bg-white p-2 rounded border border-blue-200">{order.email}</p>
                          </div>
                          
                          {/* Phone */}
                          <div>
                            <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              Phone 1
                            </span>
                            <p className="font-bold text-black text-sm">{order.phone}</p>
                          </div>
                          
                          {/* Phone 2 - استخراج من النوتس */}
                          {order.notes?.includes('Alt phone:') && (
                            <div>
                              <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                Phone 2
                              </span>
                              <p className="font-bold text-black text-sm">
                                {order.notes.split('Alt phone: ')[1]?.split(' | ')[0] || 'N/A'}
                              </p>
                            </div>
                          )}
                          
                          {/* Location */}
                          <div>
                            <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              Location
                            </span>
                            <p className="font-bold text-black text-sm">{order.governorate}{order.city && `, ${order.city}`}</p>
                          </div>
                          
                          {/* Address */}
                          <div>
                            <span className="text-xs text-blue-600 font-medium block">Address</span>
                            <p className="font-bold text-black text-xs break-words bg-white p-2 rounded border border-blue-200">{order.addressLine}</p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method - Mobile Optimized */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-black mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                          Payment
                        </h4>
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <p className="font-bold text-black mb-2 text-sm">
                            {order.paymentMethod === "cash_on_delivery"
                              ? "💰 Cash on Delivery"
                              : order.paymentMethod === "vodafone_cash"
                                ? "📱 Vodafone Cash"
                                : "💳 Insta Pay"}
                          </p>
                          {order.paymentMethod !== "cash_on_delivery" && (
                            <div className="space-y-2">
                              {order.payerAccount && (
                                <div className="bg-white p-2 rounded border border-green-200">
                                  <span className="text-xs text-green-600 font-medium block">Account</span>
                                  <p className="font-bold text-black text-sm">{order.payerAccount}</p>
                                </div>
                              )}
                              {order.transferAmount && (
                                <div className="bg-white p-2 rounded border border-green-200">
                                  <span className="text-xs text-green-600 font-medium block">Amount</span>
                                  <p className="font-bold text-black text-sm">{order.transferAmount} EGP</p>
                                </div>
                              )}
                              {order.paymentProofPath && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedImage(order.paymentProofPath!)}
                                  className="border-green-300 hover:bg-green-50 text-green-700 font-semibold text-xs w-full"
                                >
                                  📄 View Proof
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Status - Mobile Optimized */}
                      <div className="mb-4">
                        <Label className="font-semibold text-black mb-2 block text-sm sm:text-base">Status</Label>
                        <Select value={order.status} onValueChange={(value) => handleStatusChange(order._id, value)}>
                          <SelectTrigger className="w-full border-2 border-gray-300 h-10 text-sm font-semibold bg-white hover:border-black transition-all">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map((status) => (
                              <SelectItem key={status.value} value={status.value} className="text-sm font-semibold">
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Order Notes - إضافة النوتس */}
                      {order.notes && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-black mb-3 flex items-center gap-2 text-sm sm:text-base">
                            📝 Order Notes
                          </h4>
                          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                            <p className="text-black text-sm break-words">
                              {order.notes.includes('Alt phone:') 
                                ? order.notes.split(' | ').filter(note => !note.includes('Alt phone:')).join(' | ') || 'No additional notes'
                                : order.notes
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Price Summary - Mobile Optimized */}
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-300">
                        <h4 className="font-bold text-black mb-3 text-sm flex items-center gap-1">
                          💰 Summary
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-1">
                            <span className="text-gray-600 text-xs">Subtotal:</span>
                            <span className="font-bold text-black text-sm">{order.subtotal.toFixed(2)} EGP</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-gray-600 text-xs">Shipping:</span>
                            <span className="font-bold text-black text-sm">{order.shippingCost.toFixed(2)} EGP</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between items-center py-1 text-green-600">
                              <span className="text-xs">Discount:</span>
                              <span className="font-bold text-sm">-{order.discount.toFixed(2)} EGP</span>
                            </div>
                          )}
                          {order.promoCode && (
                            <div className="flex justify-between items-center py-1">
                              <span className="text-blue-600 text-xs">Promo:</span>
                              <span className="font-bold text-blue-600 text-xs bg-blue-100 px-2 py-1 rounded border">{order.promoCode}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center text-base font-bold text-black pt-2 border-t border-gray-400 bg-white p-2 rounded">
                            <span>Total:</span>
                            <span className="text-green-600">{order.total.toFixed(2)} EGP</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      {selectedImage && (
        <Dialog open={true} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-[95vw] sm:max-w-3xl bg-white p-2 sm:p-6">
            <div className="relative">
              <img 
                src={selectedImage} 
                alt="Payment Proof" 
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg" 
              />
              <Button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-2 rounded-full"
                size="sm"
              >
                ✕
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
