import { useQuery } from "@tanstack/react-query";
import { instructorsListOptions, instructorOptions } from "./options";
import type { InstructorListParams } from "./service";

export const useGetInstructors = (
  params: InstructorListParams = {},
  options?: { enabled?: boolean }
) => useQuery({ ...instructorsListOptions(params), ...options });

export const useGetInstructor = (
  id: string,
  options?: { enabled?: boolean }
) => useQuery({ ...instructorOptions(id), ...options });
