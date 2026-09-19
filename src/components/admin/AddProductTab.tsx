import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Plus, X, Upload } from "lucide-react";

const CATEGORIES = [
  "FULL SUITE",
  "PANTS", 
  "HOODIES",
  "CREW-NECK",
];

type ColorType = {
  name: string;
  hex: string;
};

export default function AddProductTab() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [colors, setColors] = useState<ColorType[]>([]);
  const [colorInput, setColorInput] = useState("");
  const [colorHex, setColorHex] = useState("#000000");
  const [images, setImages] = useState<string[]>([]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      toast.error("You can upload up to 10 images only");
      return;
    }

    const base64Images: string[] = [];
    for (const file of files) {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      base64Images.push(base64);
    }

    setImages([...images, ...base64Images]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price || !category || sizes.length === 0 || colors.length === 0 || images.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const slug = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          slug,
          oldPrice: oldPrice ? parseFloat(oldPrice) : undefined,
          price: parseFloat(price),
          description,
          details,
          category,
          sizes,
          colors,
          images,
          stock: 100,
          rating: 5,
          brand: "North",
          soldOut: false,
          isNewArrival: false,
          isBestSeller: false,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      await Swal.fire({
        title: "Success!",
        text: "Product added successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#000000",
      });

      // Reset form
      setName("");
      setOldPrice("");
      setPrice("");
      setDescription("");
      setDetails("");
      setCategory("");
      setSizes([]);
      setColors([]);
      setImages([]);
    } catch (error: any) {
      console.error("Error adding product:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to add product",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#000000",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-gray-200 bg-white">
      <CardHeader className="bg-white border-b">
        <CardTitle className="text-2xl font-bold text-black">Add New Product</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-semibold text-black">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              className="h-11 border-gray-300 focus:border-black"
              required
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="oldPrice" className="text-base font-semibold text-black">
                Price Before Discount
              </Label>
              <Input
                id="oldPrice"
                type="number"
                step="0.01"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="0.00"
                className="h-11 border-gray-300 focus:border-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-base font-semibold text-black">
                Actual Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="h-11 border-gray-300 focus:border-black"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold text-black">
              Product Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={3}
              className="resize-none border-gray-300 focus:border-black"
              required
            />
          </div>

          {/* Product Details */}
          <div className="space-y-2">
            <Label htmlFor="details" className="text-base font-semibold text-black">
              Product Details
            </Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter additional product details"
              rows={3}
              className="resize-none border-gray-300 focus:border-black"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-base font-semibold text-black">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="h-11 border-gray-300">
                <SelectValue placeholder="Select category" />
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

          {/* Sizes */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-black">
              Sizes <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSize())}
                placeholder="Enter size (e.g., S, M, L)"
                className="h-11 border-gray-300 focus:border-black"
              />
              <Button type="button" onClick={handleAddSize} className="gap-2 bg-black hover:bg-gray-800">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <div
                  key={size}
                  className="bg-gray-100 text-black border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <span className="font-semibold">{size}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(size)}
                    className="hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-black">
              Colors <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-3">
              <Input
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                placeholder="Color name (e.g., Black, White)"
                className="h-11 border-gray-300 focus:border-black"
              />
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="h-11 w-24 cursor-pointer"
                />
                <Button type="button" onClick={handleAddColor} className="gap-2 bg-black hover:bg-gray-800 flex-1">
                  <Plus className="w-4 h-4" />
                  Add Color
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <div
                  key={color.name}
                  className="bg-white border-2 border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-400"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="font-semibold text-black">{color.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(color.name)}
                    className="hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Images Upload */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-black">
              Product Images (up to 10) <span className="text-red-500">*</span>
            </Label>
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center hover:border-black transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-12 h-12 text-gray-400" />
                <span className="text-gray-700 font-medium">
                  Click to upload images or drag them here
                </span>
                <span className="text-sm text-gray-500">
                  First image will be the main product image
                </span>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-300 hover:border-black transition-colors"
                  >
                    {index === 0 && (
                      <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full z-10">
                        Main
                      </div>
                    )}
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 left-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-lg font-semibold bg-black hover:bg-gray-800 text-white"
          >
            {loading ? "Adding Product..." : "Add Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
