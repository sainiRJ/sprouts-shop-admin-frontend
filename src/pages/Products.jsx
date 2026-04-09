import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Star, X, Upload } from "lucide-react";
import {
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAdminCategoriesQuery,
} from "@/store/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { PaginationControls } from "@/components/PaginationControls";

const statusColors = {
  active: "bg-success/20 text-success",
  draft: "bg-muted text-muted-foreground",
  out_of_stock: "bg-destructive/20 text-destructive",
};

const Products = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    price: "",
    originalPrice: "",
    stock: "",
    description: "",
    status: "active",
  });
  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);

  const mainImageRef = useRef(null);
  const galleryRef = useRef(null);

  const limit = 5;
  const {
    data: productsData,
    isLoading,
    isError,
  } = useGetAdminProductsQuery({ page, limit, search });
  const { data: categoriesData } = useGetAdminCategoriesQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = productsData?.products || [];
  const totalPages = productsData?.pagination?.pages || 1;

  const categories = categoriesData || [];

  const next = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const prev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const goTo = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const addFeature = () => {
    const val = featureInput.trim();
    if (val && !features.includes(val)) {
      setFeatures([...features, val]);
      setFeatureInput("");
    }
  };

  const removeFeature = (f) => setFeatures(features.filter((x) => x !== f));

  const handleFeatureKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  // uploads handle image selection + preview

  const removeGalleryImage = (index) => {
    const removed = galleryPreviews[index];
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
    if (typeof removed === "string" && removed.startsWith("blob:")) {
      const blobIndex =
        galleryPreviews
          .slice(0, index + 1)
          .filter((preview) => typeof preview === "string" && preview.startsWith("blob:"))
          .length - 1;
      setGalleryImageFiles((prev) => prev.filter((_, i) => i !== blobIndex));
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      categoryId: "",
      price: "",
      originalPrice: "",
      stock: "",
      description: "",
      status: "active",
    });
    setFeatures([]);
    setFeatureInput("");
    setMainImagePreview("");
    setGalleryPreviews([]);
    setMainImageFile(null);
    setGalleryImageFiles([]);
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name,
      categoryId: p.category?._id || "",
      price: (p.discountPrice ?? p.price ?? 0).toString(),
      originalPrice:
        p.discountPrice && p.discountPrice < p.price
          ? p.price.toString()
          : "",
      stock: (p.stock ?? 0).toString(),
      description: p.description ?? "",
      status:
        p.stock === 0
          ? "out_of_stock"
          : p.isActive
          ? "active"
          : "draft",
    });
    setFeatures(Array.isArray(p.features) ? p.features : []);
    setFeatureInput("");
    const imgs = Array.isArray(p.images) ? p.images : [];
    setMainImagePreview(imgs[0] || "");
    setGalleryPreviews(imgs.slice(1));
    setMainImageFile(null);
    setGalleryImageFiles([]);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.categoryId) return;

    const price = Number(form.price) || 0;
    const originalPrice = Number(form.originalPrice) || 0;
    const stock = Number(form.stock) || 0;

    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("category", form.categoryId);
    payload.append("price", String(originalPrice || price));
    if (price) payload.append("discountPrice", String(price));
    payload.append("stock", String(stock));
    payload.append("description", form.description || "");
    payload.append("features", JSON.stringify(features));
    payload.append("isActive", String(form.status !== "draft"));

    const existingImages = [
      ...(isImageUrl(mainImagePreview) && !mainImagePreview.startsWith("blob:")
        ? [mainImagePreview]
        : []),
      ...galleryPreviews.filter(
        (x) => isImageUrl(x) && !String(x).startsWith("blob:")
      ),
    ];
    payload.append("existingImages", JSON.stringify(existingImages));

    if (mainImageFile) {
      payload.append("images", mainImageFile);
    }
    galleryImageFiles.forEach((file) => {
      payload.append("images", file);
    });

    try {
      if (editing) {
        await updateProduct({ id: editing._id, body: payload }).unwrap();
        toast.success("Product updated");
      } else {
        await createProduct(payload).unwrap();
        toast.success("Product added");
      }
      setOpen(false);
    } catch (error) {
      const message =
        error?.data?.error || "Failed to save product. Please try again.";
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted");
    } catch (error) {
      const message =
        error?.data?.error || "Failed to delete product. Please try again.";
      toast.error(message);
    }
  };

  const isImageUrl = (s) =>
    typeof s === "string" &&
    (s.startsWith("blob:") || s.startsWith("http") || s.startsWith("data:"));

  const handleMainImageUpload = async (file) => {
    const localPreview = URL.createObjectURL(file);
    setMainImagePreview(localPreview);
    setMainImageFile(file);
  };

  const handleGalleryUpload = async (files) => {
    const selectedFiles = Array.from(files);
    const local = selectedFiles.map((f) => URL.createObjectURL(f));
    setGalleryPreviews((prev) => [...prev, ...local]);
    setGalleryImageFiles((prev) => [...prev, ...selectedFiles]);
  };

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
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">
              Loading products...
            </div>
          ) : isError ? (
            <div className="p-6 text-sm text-destructive">
              Failed to load products.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {products.map((p) => {
                  const currentPrice = p.discountPrice ?? p.price ?? 0;
                  const originalPrice =
                    p.discountPrice && p.discountPrice < p.price
                      ? p.price
                      : null;
                  const status =
                    p.stock === 0
                      ? "out_of_stock"
                      : p.isActive
                      ? "active"
                      : "draft";
                  const mainImage =
                    Array.isArray(p.images) && p.images.length > 0
                      ? p.images[0]
                      : "";

                  return (
                    <tr
                      key={p._id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {isImageUrl(mainImage) ? (
                              <img
                                src={mainImage}
                                alt={p.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <span className="text-xl">📦</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {p.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {p.category?.name ?? "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium">
                            ₹{currentPrice}
                          </span>
                          {originalPrice && (
                            <span className="text-xs text-muted-foreground line-through ml-1">
                              ₹{originalPrice}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            p.stock === 0
                              ? "text-destructive font-semibold"
                              : p.stock <= 20
                              ? "text-warning font-medium"
                              : "text-muted-foreground"
                          }
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-warning fill-warning" />
                          <span className="text-sm font-medium">
                            {p.rating?.toFixed(1) ?? "0.0"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({p.numReviews ?? 0})
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                            statusColors[status]
                          }`}
                        >
                          {status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEdit(p)}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPrev={prev}
          onNext={next}
          onGoTo={goTo}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <Input
              placeholder="Product name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <Select
              value={form.categoryId}
              onValueChange={(v) => setForm({ ...form, categoryId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea
                placeholder="Product description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Main Image</label>
              <input
                ref={mainImageRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleMainImageUpload(file);
                }}
                className="hidden"
              />
              <div
                onClick={() => mainImageRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors text-center"
              >
                {mainImagePreview && isImageUrl(mainImagePreview) ? (
                  <div className="flex items-center justify-center">
                    <img
                      src={mainImagePreview}
                      alt="Main"
                      className="h-24 w-24 rounded-lg object-cover"
                    />
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

            <div>
              <label className="text-sm font-medium mb-1.5 block">Gallery Images</label>
              <input
                ref={galleryRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const { files } = e.target;
                  if (files && files.length > 0) handleGalleryUpload(files);
                }}
                className="hidden"
              />
              <div className="flex flex-wrap gap-3">
                {galleryPreviews.map((img, i) => (
                  <div key={i} className="relative group">
                    {isImageUrl(img) ? (
                      <img
                        src={img}
                        alt={`Gallery ${i}`}
                        className="h-16 w-16 rounded-lg object-cover border border-border"
                      />
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
              <Input
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <Input
                placeholder="Original Price"
                type="number"
                value={form.originalPrice}
                onChange={(e) =>
                  setForm({ ...form, originalPrice: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Stock"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Features</label>
              <div className="flex flex-wrap gap-2 mb-2">
                        {features.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    {f}
                    <button
                      onClick={() => removeFeature(f)}
                      className="hover:text-destructive transition-colors"
                    >
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                  disabled={!featureInput.trim()}
                >
                  Add
                </Button>
              </div>
            </div>

            <Select
              value={form.status}
              onValueChange={(v) => setForm({ ...form, status: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isCreating || isUpdating}
            >
              {editing ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Products;

