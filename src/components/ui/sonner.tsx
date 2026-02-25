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
          <CircleCheckIcon className="size-4 text-[#D4AF37]" />
        ),
        info: (
          <InfoIcon className="size-4 text-gray-600" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-amber-500" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-red-500" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-[#B8860B]" />
        ),
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "w-full flex items-center gap-3 p-4 bg-white border border-gray-100 shadow-lg font-sans text-sm tracking-wide",
          title: "text-gray-900 font-medium",
          description: "text-gray-500 text-xs mt-1",
          success: "border-l-4 border-l-[#D4AF37]",
          error: "border-l-4 border-l-red-500",
          warning: "border-l-4 border-l-amber-500",
          info: "border-l-4 border-l-gray-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
