import { Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const ButtonLoading=({ type, text, loading, className, onClick, ...pros })=> {
  return (
    <Button type={type} className={cn("", className)} disabled={loading} onClick={onClick} {...pros}>
      {loading && <Loader2Icon className="animate-spin" />}

      {text}
    </Button>
  )
}


