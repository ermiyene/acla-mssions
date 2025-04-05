import { cn } from "@cn";

import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface MobileNavMenuProps {
  items: {
    name: string;
    href: string;
    icon: React.FC<{ className?: string }>;
  }[];
}
export default function MobileNavMenu({ items }: MobileNavMenuProps) {
  const router = useRouter();
  const currentRoute = items.findLast((item) =>
    router.pathname.includes(item.href)
  );

  return (
    <div
      className="sm:hidden h-20 w-full fixed bottom-0 
         bg-background/95 backdrop-blur-md border-t z-20 box-border left-0 flex flex-row justify-evenly pb-4 
        "
    >
      {items?.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "rounded-none flex flex-col justify-center items-center text-base font-medium text-muted-foreground hover:text-accent w-fit py-2 gap-1",
              item.href === currentRoute?.href &&
                "border-t-2 border-t-foreground hover:border-t-accent font-bold text-foreground"
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="text-[0.8rem] leading-none">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
