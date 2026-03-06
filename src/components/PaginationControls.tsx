import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (p: number) => void;
}

export function PaginationControls({ page, totalPages, onPrev, onNext, onGoTo }: Props) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    }
  }

  // Add ellipsis markers
  const display: (number | "...")[] = [];
  let last = 0;
  for (const p of pages) {
    if (p - last > 1) display.push("...");
    display.push(p);
    last = p;
  }

  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={onPrev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {display.map((item, i) =>
        item === "..." ? (
          <span key={`e${i}`} className="px-2 text-muted-foreground text-sm">…</span>
        ) : (
          <Button
            key={item}
            variant={item === page ? "default" : "outline"}
            size="icon"
            className="h-8 w-8 text-xs"
            onClick={() => onGoTo(item)}
          >
            {item}
          </Button>
        )
      )}
      <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={onNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
