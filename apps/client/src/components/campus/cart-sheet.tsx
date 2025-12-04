import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import { BookOpen, ShoppingCart, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function CartSheet() {
  const { t, i18n } = useTranslation();
  const { items, summary, itemCount, removeFromCart, isPending } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <ShoppingCart className="size-5" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5" />
            {t("cart.title")}
            {itemCount > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({t("cart.items", { count: itemCount })})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-muted">
              <ShoppingCart className="size-10 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium">{t("cart.empty")}</p>
              <p className="text-sm text-muted-foreground">
                {t("cart.continueShopping")}
              </p>
            </div>
            <Link to="/courses">
              <Button>
                <BookOpen className="mr-2 size-4" />
                {t("campus.navigation.courses")}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-lg border p-3"
                  >
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                      {item.course.thumbnail ? (
                        <img
                          src={item.course.thumbnail}
                          alt={item.course.title}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <BookOpen className="size-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <SheetClose>
                          <Link
                            to="/courses/$courseSlug"
                            params={{ courseSlug: item.course.slug }}
                            className="line-clamp-2 text-sm font-medium hover:underline"
                          >
                            {item.course.title}
                          </Link>
                        </SheetClose>
                        {item.course.instructor && (
                          <p className="text-xs text-muted-foreground">
                            {item.course.instructor.name}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">
                          {formatPrice(
                            item.course.price,
                            item.course.currency,
                            i18n.language
                          )}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.courseId)}
                          disabled={isPending}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="flex-col gap-4 border-t pt-4 sm:flex-col">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>{t("cart.total")}</span>
                <span>
                  {formatPrice(summary.total, summary.currency, i18n.language)}
                </span>
              </div>
              <Button size="lg" className="w-full" disabled>
                {t("campus.courseDetail.buyNow")}
              </Button>
              <SheetClose>
                <Link to="/courses" className="w-full">
                  <Button variant="outline" size="lg" className="w-full">
                    {t("cart.continueShopping")}
                  </Button>
                </Link>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
