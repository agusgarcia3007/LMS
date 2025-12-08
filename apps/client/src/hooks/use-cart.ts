import { useGetCart, useAddToCart, useRemoveFromCart, useClearCart } from "@/services/cart";

export const useCart = () => {
  const isAuthenticated = !!localStorage.getItem("accessToken");

  const { data: cartData, isLoading } = useGetCart({ enabled: isAuthenticated });
  const { mutate: addToCartMutation, isPending: isAdding } = useAddToCart();
  const { mutate: removeFromCartMutation, isPending: isRemoving } = useRemoveFromCart();
  const { mutate: clearCartMutation, isPending: isClearing } = useClearCart();

  const addToCart = (courseId: string) => {
    addToCartMutation(courseId);
  };

  const removeFromCart = (courseId: string) => {
    removeFromCartMutation(courseId);
  };

  const clearCart = () => {
    clearCartMutation();
  };

  const isInCart = (courseId: string): boolean => {
    return cartData?.items.some((item) => item.courseId === courseId) ?? false;
  };

  const defaultSummary = {
    itemCount: 0,
    total: 0,
    originalTotal: 0,
    currency: "USD",
  };

  return {
    items: cartData?.items ?? [],
    summary: cartData?.summary ?? defaultSummary,
    itemCount: cartData?.summary?.itemCount ?? 0,
    isLoading,
    isPending: isAdding || isRemoving || isClearing,
    isAuthenticated,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
  };
};
