import { Skeleton } from "@/components/ui/skeleton";

export const SearchSkeleton = () => {
  return (
    <div className="flex w-full items-center space-x-4">
      <Skeleton className="size-8 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-[250px]" />
        <Skeleton className="h-3 w-[200px]" />
      </div>
    </div>
  );
};
