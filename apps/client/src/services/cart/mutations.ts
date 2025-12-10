import { useMutation } from "@tanstack/react-query";
import { addToCartOptions, removeFromCartOptions, clearCartOptions, checkoutOptions } from "./options";

export const useAddToCart = () => useMutation(addToCartOptions());

export const useRemoveFromCart = () => useMutation(removeFromCartOptions());

export const useClearCart = () => useMutation(clearCartOptions());

export const useCheckout = () => useMutation(checkoutOptions());
