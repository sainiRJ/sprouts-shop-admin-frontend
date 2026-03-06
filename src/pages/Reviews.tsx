import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { mockReviews } from "@/data/mockData";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls";

const Reviews = () => {
  const { page, totalPages, paginatedItems, next, prev, goTo } = usePagination(mockReviews, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">Customer feedback and ratings</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Comment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedItems.map((r) => (
                <tr key={r.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{r.customerName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.productName}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "text-warning fill-warning" : "text-border"}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{r.comment}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationControls page={page} totalPages={totalPages} onPrev={prev} onNext={next} onGoTo={goTo} />
      </div>
    </motion.div>
  );
};

export default Reviews;
