import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-none bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 bg-size-[200%_100%]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
