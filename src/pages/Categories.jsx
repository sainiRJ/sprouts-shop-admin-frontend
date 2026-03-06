import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/store/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { PaginationControls } from "@/components/PaginationControls";

const Categories = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, isError } = useGetAdminCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const categories = data || [];
  const totalPages = Math.max(1, Math.ceil(categories.length / limit));
  const paginatedItems = categories.slice((page - 1) * limit, page * limit);

  const next = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const prev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const goTo = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
    setOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description ?? "" });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    const payload = {
      name: form.name,
      description: form.description,
    };

    try {
      if (editing) {
        await updateCategory({ id: editing._id, body: payload }).unwrap();
        toast.success("Category updated");
      } else {
        await createCategory(payload).unwrap();
        toast.success("Category added");
      }
      setOpen(false);
    } catch (error) {
      const message =
        error?.data?.error || "Failed to save category. Please try again.";
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted");
    } catch (error) {
      const message =
        error?.data?.error || "Failed to delete category. Please try again.";
      toast.error(message);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage product categories</p>
        </div>
        <Button onClick={openAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">
              Loading categories...
            </div>
          ) : isError ? (
            <div className="p-6 text-sm text-destructive">
              Failed to load categories.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {paginatedItems.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.description}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(c)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <PaginationControls page={page} totalPages={totalPages} onPrev={prev} onNext={next} onGoTo={goTo} />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              placeholder="Category name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
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

export default Categories;

