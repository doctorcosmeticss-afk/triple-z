import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Plus, Trash2, Calendar, Percent, Users, Tag } from "lucide-react";
import { ADMIN_API_URL, getAuthHeadersOnly, getAuthHeaders } from "@/lib/admin-api";

type PromoCode = {
  _id: string;
  code: string;
  percentOff: number;
  maxUses: number;
  currentUses: number;
  validDays: number;
  expiresAt: string;
  active: boolean;
  createdAt: string;
};

export default function PromoCodesTab() {
  const [loading, setLoading] = useState(false);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [code, setCode] = useState("");
  const [percentOff, setPercentOff] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [validDays, setValidDays] = useState("");

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    try {
      const response = await fetch(`${ADMIN_API_URL}/promo-codes`, {
        headers: getAuthHeadersOnly()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load promo codes');
      }

      setPromoCodes(data.promoCodes || []);
    } catch (error: any) {
      console.error("Error loading promo codes:", error);
      toast.error(error.message || "Failed to load promo codes");
    }
  };

  const handleAddPromoCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || !percentOff || !maxUses || !validDays) {
      toast.error("Please fill all fields");
      return;
    }

    if (parseFloat(percentOff) <= 0 || parseFloat(percentOff) > 100) {
      toast.error("Discount must be between 1 and 100");
      return;
    }

    if (parseInt(maxUses) <= 0) {
      toast.error("Max uses must be greater than 0");
      return;
    }

    if (parseInt(validDays) <= 0) {
      toast.error("Valid days must be greater than 0");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${ADMIN_API_URL}/promo-codes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          percentOff: parseFloat(percentOff),
          maxUses: parseInt(maxUses),
          validDays: parseInt(validDays),
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create promo code');
      }

      await Swal.fire({
        title: "Success!",
        text: "Promo code created successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#000000",
      });

      // Reset form
      setCode("");
      setPercentOff("");
      setMaxUses("");
      setValidDays("");

      // Reload promo codes
      loadPromoCodes();
    } catch (error: any) {
      console.error("Error creating promo code:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to create promo code",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#000000",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePromoCode = async (id: string, code: string) => {
    const result = await Swal.fire({
      title: "Delete Promo Code?",
      text: `Are you sure you want to delete "${code}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${ADMIN_API_URL}/promo-codes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeadersOnly()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete promo code');
      }

      toast.success("Promo code deleted successfully");
      loadPromoCodes();
    } catch (error: any) {
      console.error("Error deleting promo code:", error);
      toast.error(error.message || "Failed to delete promo code");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const isMaxedOut = (currentUses: number, maxUses: number) => {
    return currentUses >= maxUses;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Create Promo Code Form */}
      <Card className="shadow-sm border-gray-200 bg-white">
        <CardHeader className="bg-white border-b p-3 sm:p-6">
          <CardTitle className="text-lg sm:text-2xl font-bold text-black">Create Promo Code</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <form onSubmit={handleAddPromoCode} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Code */}
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm sm:text-base font-semibold text-black">
                  Promo Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g., SUMMER2024"
                  className="h-10 sm:h-11 border-gray-300 focus:border-black uppercase text-sm sm:text-base"
                  required
                />
              </div>

              {/* Percent Off */}
              <div className="space-y-2">
                <Label htmlFor="percentOff" className="text-sm sm:text-base font-semibold text-black">
                  Discount % <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="percentOff"
                  type="number"
                  min="1"
                  max="100"
                  step="0.01"
                  value={percentOff}
                  onChange={(e) => setPercentOff(e.target.value)}
                  placeholder="e.g., 20"
                  className="h-10 sm:h-11 border-gray-300 focus:border-black text-sm sm:text-base"
                  required
                />
              </div>

              {/* Max Uses */}
              <div className="space-y-2">
                <Label htmlFor="maxUses" className="text-sm sm:text-base font-semibold text-black">
                  Max Uses <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="maxUses"
                  type="number"
                  min="1"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="e.g., 100"
                  className="h-10 sm:h-11 border-gray-300 focus:border-black text-sm sm:text-base"
                  required
                />
              </div>

              {/* Valid Days */}
              <div className="space-y-2">
                <Label htmlFor="validDays" className="text-sm sm:text-base font-semibold text-black">
                  Valid Days <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="validDays"
                  type="number"
                  min="1"
                  value={validDays}
                  onChange={(e) => setValidDays(e.target.value)}
                  placeholder="e.g., 30"
                  className="h-10 sm:h-11 border-gray-300 focus:border-black text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 sm:h-12 text-sm sm:text-lg font-semibold bg-black hover:bg-gray-800 text-white gap-2"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              {loading ? "Creating..." : "Create Promo Code"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Promo Codes List */}
      <Card className="shadow-sm border-gray-200 bg-white">
        <CardHeader className="bg-white border-b p-3 sm:p-6">
          <CardTitle className="text-lg sm:text-2xl font-bold text-black">
            All Promo Codes ({promoCodes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {promoCodes.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium text-base sm:text-lg mb-2">No promo codes yet</p>
              <p className="text-gray-500 text-xs sm:text-sm">Create your first promo code to get started</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {promoCodes.map((promo) => {
                const expired = isExpired(promo.expiresAt);
                const maxedOut = isMaxedOut(promo.currentUses, promo.maxUses);
                const isInvalid = expired || maxedOut;

                return (
                  <div
                    key={promo._id}
                    className={`border-2 rounded-lg p-3 sm:p-4 transition-all ${
                      isInvalid
                        ? "border-red-200 bg-red-50"
                        : "border-gray-200 bg-white hover:border-black"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                      <div className="flex-1 space-y-2 sm:space-y-3">
                        {/* Code and Status */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <span className="text-lg sm:text-2xl font-bold text-black font-mono">
                            {promo.code}
                          </span>
                          {expired && (
                            <span className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
                              EXPIRED
                            </span>
                          )}
                          {maxedOut && !expired && (
                            <span className="px-2 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full">
                              MAX REACHED
                            </span>
                          )}
                          {!isInvalid && (
                            <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                              ACTIVE
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Percent className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                            <span className="text-xs sm:text-sm text-gray-700">
                              <span className="font-semibold">{promo.percentOff}%</span> off
                            </span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                            <span className="text-xs sm:text-sm text-gray-700">
                              <span className="font-semibold">{promo.currentUses}</span> / {promo.maxUses}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                            <span className="text-xs sm:text-sm text-gray-700">
                              <span className="font-semibold">{formatDate(promo.createdAt)}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                            <span className="text-xs sm:text-sm text-gray-700">
                              <span className="font-semibold">{formatDate(promo.expiresAt)}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeletePromoCode(promo._id, promo.code)}
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all shrink-0 w-8 h-8 sm:w-10 sm:h-10"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
