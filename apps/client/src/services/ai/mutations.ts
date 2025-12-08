import { useMutation } from "@tanstack/react-query";
import { analyzeVideoOptions } from "./options";

export const useAnalyzeVideo = () => useMutation(analyzeVideoOptions());
