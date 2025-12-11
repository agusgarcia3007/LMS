import { useQuery } from "@tanstack/react-query";
import {
  certificatesListOptions,
  certificateOptions,
  certificateVerifyOptions,
} from "./options";

export const useCertificates = () => useQuery(certificatesListOptions());

export const useCertificate = (enrollmentId: string) =>
  useQuery(certificateOptions(enrollmentId));

export const useCertificateVerify = (code: string) =>
  useQuery(certificateVerifyOptions(code));
