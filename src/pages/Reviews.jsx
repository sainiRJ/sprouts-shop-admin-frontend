import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetProductReviewsQuery } from "@/store/api";
import { PaginationControls } from "@/components/PaginationControls";

const Reviews = () => {
  const [productIdInput, setProductIdInput] = useState("");
  const [productId, setProductId] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, isError } = useGetProductReviewsQuery(
    { productId, page, limit },
    { skip: !productId },
  );

  const reviews = data?.reviews || [];
  const totalPages = data?.pagination?.pages || 1;

  const next = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const prev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const goTo = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const handleLoad = () => {
    setPage(1);
    setProductId(productIdInput.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customer feedback and ratings (per product)
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Enter Product ID"
            value={productIdInput}
            onChange={(e) => setProductIdInput(e.target.value)}
          />
          <Button type="button" onClick={handleLoad} disabled={!productIdInput}>
            Load
          </Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          {!productId ? (
            <div className="p-6 text-sm text-muted-foreground">
              Enter a product ID to view its reviews.
            </div>
          ) : isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">
              Loading reviews...
            </div>
          ) : isError ? (
            <div className="p-6 text-sm text-destructive">
              Failed to load reviews.
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              No reviews found for this product.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {reviews.map((r) => (
                  <tr
                    key={r._id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">
                      {r.user?.fullName ?? "Anonymous"}
                      {r.user?.email && (
                        <span className="block text-xs text-muted-foreground">
                          {r.user.email}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < r.rating
                                ? "text-warning fill-warning"
                                : "text-border"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                      {r.comment}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
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
    </motion.div>
  );
};

export default Reviews;

