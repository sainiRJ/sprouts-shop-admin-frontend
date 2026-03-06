import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { mockCategories, Category } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const { page, totalPages, paginatedItems, next, prev, goTo } = usePagination(categories, 5);

  const openAdd = () => { setEditing(null); setForm({ name: "", description: "" }); setOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, description: c.description }); setOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setCategories((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...form } : c));
      toast.success("Category updated");
    } else {
      setCategories((prev) => [...prev, { id: Date.now().toString(), ...form, productCount: 0, createdAt: new Date().toISOString().slice(0, 10) }]);
      toast.success("Category added");
    }
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Category deleted");
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
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Products</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedItems.map((c) => (
                <tr key={c.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.description}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                      {c.productCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.createdAt}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input placeholder="Category name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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

export default Categories;
