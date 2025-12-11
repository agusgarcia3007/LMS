import { useMutation } from "@tanstack/react-query";
import { useSendCertificateEmailOptions } from "./options";

export const useSendCertificateEmail = () =>
  useMutation(useSendCertificateEmailOptions());
