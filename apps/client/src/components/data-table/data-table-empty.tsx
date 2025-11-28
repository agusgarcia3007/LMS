import type { ReactNode } from "react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { FileX } from "lucide-react";

type DataTableEmptyProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function DataTableEmpty({
  icon,
  title,
  description,
  action,
}: DataTableEmptyProps) {
  return (
    <Empty className="min-h-[300px] border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {icon ?? <FileX className="size-6" />}
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
}
