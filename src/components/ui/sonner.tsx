import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-center"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-[#C9A86C]" />
        ),
        info: (
          <InfoIcon className="size-4 text-[#9A8B7A]" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-amber-500" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-red-500" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-[#B8974E]" />
        ),
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "w-full flex items-center gap-3 p-4 bg-[#FBF8F5] border border-[#E8DDD6] shadow-lg font-sans text-sm tracking-wide rounded-xl",
          title: "text-[#8B7355] font-medium",
          description: "text-[#9A8B7A] text-xs mt-1",
          success: "border-l-4 border-l-[#C9A86C]",
          error: "border-l-4 border-l-red-500",
          warning: "border-l-4 border-l-amber-500",
          info: "border-l-4 border-l-[#B8A89A]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
