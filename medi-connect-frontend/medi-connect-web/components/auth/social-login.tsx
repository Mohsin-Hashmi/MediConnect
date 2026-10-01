import { Apple } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function SocialLogin() {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Or continue with
        </span>
        <Separator className="flex-1" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button type="button" variant="outline" className="h-11 text-sm">
          <span className="font-bold text-primary" aria-hidden="true">G</span>
          Google SSO
        </Button>
        <Button type="button" variant="outline" className="h-11 text-sm">
          <Apple className="size-4" aria-hidden="true" />
          Apple ID
        </Button>
      </div>
    </div>
  );
}
