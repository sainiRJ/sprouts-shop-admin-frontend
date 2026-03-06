import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Star, X, Upload, Image as ImageIcon } from "lucide-react";
import { mockProducts, Product, mockCategories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls";

const statusColors: Record<string, string> = {
  active: "bg-success/20 text-success",
  draft: "bg-muted text-muted-foreground",
  out_of_stock: "bg-destructive/20 text-destructive",
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "", category: "", price: "", originalPrice: "", stock: "",
    description: "", longDescription: "", weight: "",
    status: "active" as Product["status"], inStock: true,
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [mainImage, setMainImage] = useState<string>("");
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const mainImageRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const { page, totalPages, paginatedItems, next, prev, goTo } = usePagination(filtered, 5);

  const addFeature = () => {
    const val = featureInput.trim();
    if (val && !features.includes(val)) {
      setFeatures([...features, val]);
      setFeatureInput("");
    }
  };

  const removeFeature = (f: string) => setFeatures(features.filter((x) => x !== f));

  const handleFeatureKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); addFeature(); }
  };

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMainImage(url);
      setMainImagePreview(url);
    }
  };

  const handleGalleryImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newUrls: string[] = [];
      const newPreviews: string[] = [];
      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file);
        newUrls.push(url);
        newPreviews.push(url);
      });
      setGalleryImages([...galleryImages, ...newUrls]);
      setGalleryPreviews([...galleryPreviews, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", category: "", price: "", originalPrice: "", stock: "", description: "", longDescription: "", weight: "", status: "active", inStock: true });
    setFeatures([]);
    setFeatureInput("");
    setMainImage("");
    setMainImagePreview("");
    setGalleryImages([]);
    setGalleryPreviews([]);
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, category: p.category, price: p.price.toString(), originalPrice: p.originalPrice.toString(),
      stock: p.stock.toString(), description: p.description, longDescription: p.longDescription,
      weight: p.weight, status: p.status, inStock: p.inStock,
    });
    setFeatures([...p.features]);
    setFeatureInput("");
    setMainImage(p.image);
    setMainImagePreview(p.image);
    setGalleryImages([...p.images]);
    setGalleryPreviews([...p.images]);
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setProducts((prev) => prev.map((p) => p.id === editing.id ? {
        ...p, name: form.name, category: form.category, price: Number(form.price),
        originalPrice: Number(form.originalPrice), stock: Number(form.stock),
        description: form.description, longDescription: form.longDescription,
        weight: form.weight, features, status: form.status, inStock: form.inStock,
        image: mainImage || p.image, images: galleryImages.length > 0 ? galleryImages : p.images,
      } : p));
      toast.success("Product updated");
    } else {
      setProducts((prev) => [...prev, {
        id: Date.now().toString(), name: form.name, category: form.category,
        price: Number(form.price), originalPrice: Number(form.originalPrice),
        stock: Number(form.stock), description: form.description,
        longDescription: form.longDescription, weight: form.weight,
        rating: 0, reviews: 0, image: mainImage || "📦",
        images: galleryImages.length > 0 ? galleryImages : ["📦"],
        features, inStock: form.inStock, status: form.status,
        createdAt: new Date().toISOString().slice(0, 10),
      }]);
      toast.success("Product added");
    }
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted");
  };

  const isImageUrl = (s: string) => s.startsWith("blob:") || s.startsWith("http") || s.startsWith("data:");

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your product catalog</p>
        </div>
        <Button onClick={openAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Weight</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedItems.map((p) => (
                <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {isImageUrl(p.image) ? (
                          <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                          <span className="text-xl">{p.image}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {p.features.slice(0, 2).map((f) => (
                            <span key={f} className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{f}</span>
                          ))}
                          {p.features.length > 2 && (
                            <span className="text-[9px] text-muted-foreground">+{p.features.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-medium">₹{p.price}</span>
                      {p.originalPrice > p.price && (
                        <span className="text-xs text-muted-foreground line-through ml-1">₹{p.originalPrice}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.weight}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock === 0 ? "text-destructive font-semibold" : p.stock <= 20 ? "text-warning font-medium" : "text-muted-foreground"}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-warning fill-warning" />
                      <span className="text-sm font-medium">{p.rating}</span>
                      <span className="text-xs text-muted-foreground">({p.reviews})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusColors[p.status]}`}>
                      {p.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(p)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationControls page={page} totalPages={totalPages} onPrev={prev} onNext={next} onGoTo={goTo} />
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <Input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {mockCategories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input placeholder="Short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <div>
              <label className="text-sm font-medium mb-1.5 block">Long Description</label>
              <Textarea
                placeholder="Detailed product description..."
                value={form.longDescription}
                onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                rows={4}
              />
            </div>

            {/* Main Image Upload */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Main Image</label>
              <input ref={mainImageRef} type="file" accept="image/*" onChange={handleMainImage} className="hidden" />
              <div
                onClick={() => mainImageRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors text-center"
              >
                {mainImagePreview && isImageUrl(mainImagePreview) ? (
                  <div className="flex items-center justify-center">
                    <img src={mainImagePreview} alt="Main" className="h-24 w-24 rounded-lg object-cover" />
                  </div>
                ) : mainImagePreview ? (
                  <div className="flex items-center justify-center">
                    <span className="text-4xl">{mainImagePreview}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="h-8 w-8" />
                    <span className="text-sm">Click to upload main image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Images Upload */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Gallery Images</label>
              <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleGalleryImages} className="hidden" />
              <div className="flex flex-wrap gap-3">
                {galleryPreviews.map((img, i) => (
                  <div key={i} className="relative group">
                    {isImageUrl(img) ? (
                      <img src={img} alt={`Gallery ${i}`} className="h-16 w-16 rounded-lg object-cover border border-border" />
                    ) : (
                      <div className="h-16 w-16 rounded-lg border border-border flex items-center justify-center bg-muted">
                        <span className="text-2xl">{img}</span>
                      </div>
                    )}
                    <button
                      onClick={() => removeGalleryImage(i)}
                      className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <div
                  onClick={() => galleryRef.current?.click()}
                  className="h-16 w-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <Plus className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <Input placeholder="Original Price" type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Weight (e.g. 250g)" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
              <Input placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>

            {/* Features - Tag style */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Features</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {features.map((f) => (
                  <span key={f} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                    {f}
                    <button onClick={() => removeFeature(f)} className="hover:text-destructive transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a feature and press Enter or Add"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={handleFeatureKeyDown}
                />
                <Button type="button" variant="outline" size="sm" onClick={addFeature} disabled={!featureInput.trim()}>
                  Add
                </Button>
              </div>
            </div>

            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Product["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Products;
