import { useMutation } from "@tanstack/react-query";
import { addToCartOptions, removeFromCartOptions, clearCartOptions } from "./options";

export const useAddToCart = () => useMutation(addToCartOptions());

export const useRemoveFromCart = () => useMutation(removeFromCartOptions());

export const useClearCart = () => useMutation(clearCartOptions());
