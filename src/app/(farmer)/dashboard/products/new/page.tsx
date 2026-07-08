"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Upload, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const UNITS = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "piece", label: "Piece" },
  { value: "bundle", label: "Bundle" },
  { value: "sack", label: "Sack" },
  { value: "crate", label: "Crate" },
];

interface CategoryOption {
  id: string;
  name: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const supabase = createClient();

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [quantity, setQuantity] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("1");
  const [categoryId, setCategoryId] = useState("");
  const [isOrganic, setIsOrganic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const newImages = files.slice(0, 4 - images.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 4));
    if (e.target) e.target.value = "";
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .is("parent_id", null)
        .eq("is_active", true)
        .order("sort_order");
      setCategories(data ?? []);
    }
    fetchCategories();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !description || !price || !quantity || !categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Create the product via the API route. This auto-creates the farmer
      // profile server-side if missing, so no log out / log in is needed.
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          unit,
          availableQuantity: parseInt(quantity),
          minimumOrder: parseInt(minimumOrder) || 1,
          categoryId,
          isOrganic,
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok || !data?.success) {
        toast.error(data?.error || `Failed to create product (status ${res.status})`);
        setLoading(false);
        return;
      }

      const product = data.data;
      const farmerId = product.farmerId ?? product.farmer?.id;

      // Upload images if any
      if (images.length > 0 && farmerId) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i].file;
          const ext = file.name.split(".").pop() || "jpg";
          const filePath = `${farmerId}/${product.id}/${i}.${ext}`;

          const formData = new FormData();
          formData.append("file", file);
          formData.append("bucket", "products");
          formData.append("path", filePath);

          const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
          let uploadData: any = null;
          try { uploadData = await uploadRes.json(); } catch { /* ignore */ }

          if (uploadRes.ok && uploadData?.url) {
            // Save the image record to the database via API
            await fetch("/api/products/" + product.id + "/images", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                imageUrl: uploadData.url,
                thumbnailUrl: uploadData.url,
                isPrimary: i === 0,
                sortOrder: i,
              }),
            });
          }
        }
      }

      toast.success("Product created successfully!");
      router.push("/dashboard/products");
    } catch (err) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  }

  return (
    <div className="container pb-8">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm px-4 py-3 border-b">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Add New Product
        </button>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-5">
        {/* Product images */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Product Photos (up to 4)</label>
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border bg-gray-50">
                <Image src={img.preview} alt={`Product ${idx + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {images.length < 4 && (
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 hover:border-primary hover:text-primary transition-colors"
              >
                <ImagePlus className="h-6 w-6" />
                <span className="mt-1 text-[10px]">Add</span>
              </button>
            )}
          </div>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>

        {/* Product name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Product Name *</label>
          <Input
            placeholder="e.g. Fresh Pechay"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Description *</label>
          <textarea
            placeholder="Describe your product (quality, how it's grown, etc.)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={500}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="mt-1 text-xs text-gray-400">{description.length}/500</p>
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Category *</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="flex h-12 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="" disabled>Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Price & Unit */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Price (₱) *</label>
            <Input
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="1"
              step="0.01"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Unit *</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="flex h-12 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quantity & Minimum order */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Available Quantity *</label>
            <Input
              type="number"
              placeholder="100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="1"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Min. Order</label>
            <Input
              type="number"
              placeholder="1"
              value={minimumOrder}
              onChange={(e) => setMinimumOrder(e.target.value)}
              min="1"
            />
          </div>
        </div>

        {/* Organic toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOrganic(!isOrganic)}
            className={`relative h-6 w-11 rounded-full transition-colors ${isOrganic ? "bg-primary" : "bg-gray-200"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isOrganic ? "translate-x-5" : ""}`}
            />
          </button>
          <span className="text-sm font-medium text-gray-700">Organic product</span>
        </div>

        {/* Submit */}
        <Button type="submit" size="xl" className="w-full gap-2" loading={loading}>
          <Upload className="h-4 w-4" />
          Create Product
        </Button>
      </form>
    </div>
  );
}
