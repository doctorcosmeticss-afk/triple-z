import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Plus, X } from "lucide-react";
import { ADMIN_API_URL, getAuthHeaders } from "@/lib/admin-api";

type Product = {
  _id: string;
  name: string;
  oldPrice?: number;
  price: number;
  description: string;
  details: string;
  category: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
};

const CATEGORIES = [
  "T-Shirts",
  "Pants",
  "Jackets",
  "Shoes",
  "Accessories",
  "Watches",
  "Bags",
];

export default function EditProductDialog({
  product,
  onClose,
  onSuccess,
}: {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(product.name);
  const [oldPrice, setOldPrice] = useState(product.oldPrice?.toString() || "");
  const [price, setPrice] = useState(product.price.toString());
  const [description, setDescription] = useState(product.description || "");
  const [details, setDetails] = useState(product.details || "");
  const [category, setCategory] = useState(product.category);
  const [sizes, setSizes] = useState<string[]>(product.sizes || []);
  const [sizeInput, setSizeInput] = useState("");
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(product.colors || []);
  const [colorInput, setColorInput] = useState("");
  const [colorHex, setColorHex] = useState("#000000");

  const handleAddSize = () => {
    if (sizeInput.trim() && !sizes.includes(sizeInput.trim())) {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput("");
    }
  };

  const handleRemoveSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  const handleAddColor = () => {
    if (colorInput.trim() && !colors.find((c) => c.name === colorInput.trim())) {
      setColors([...colors, { name: colorInput.trim(), hex: colorHex }]);
      setColorInput("");
      setColorHex("#000000");
    }
  };

  const handleRemoveColor = (colorName: string) => {
    setColors(colors.filter((c) => c.name !== colorName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !category || sizes.length === 0 || colors.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${ADMIN_API_URL}/products/${product._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          oldPrice: oldPrice ? parseFloat(oldPrice) : null,
          price: parseFloat(price),
          description,
          details,
          category,
          sizes,
          colors,
        })
      });

      if (!response.ok) throw new Error('Failed to update');

      await Swal.fire({
        title: "Success!",
        text: "Product updated successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#000000",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update product",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#000000",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black">Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-semibold text-black">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 border-gray-300"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-base font-semibold text-black">Price Before Discount</Label>
              <Input
                type="number"
                step="0.01"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                className="h-11 border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-semibold text-black">
                Actual Price <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-11 border-gray-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold text-black">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold text-black">Details</Label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold text-black">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="h-11 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold text-black">
              Sizes <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSize())}
                className="h-11 border-gray-300"
              />
              <Button type="button" onClick={handleAddSize} className="bg-black hover:bg-gray-800">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <div key={size} className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2">
                  <span className="font-semibold text-black">{size}</span>
                  <button type="button" onClick={() => handleRemoveSize(size)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold text-black">
              Colors <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-3">
              <Input
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                placeholder="Color name"
                className="h-11 border-gray-300"
              />
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="h-11 w-24"
                />
                <Button type="button" onClick={handleAddColor} className="bg-black hover:bg-gray-800 flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Color
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <div key={color.name} className="bg-white border-2 border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border-2" style={{ backgroundColor: color.hex }} />
                  <span className="font-semibold text-black">{color.name}</span>
                  <button type="button" onClick={() => handleRemoveColor(color.name)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1 h-11 bg-black hover:bg-gray-800">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="h-11 border-gray-300">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
