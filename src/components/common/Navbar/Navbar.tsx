import { useRouter } from "next/router";
import Image from "next/image";
import { cn } from "@cn";
import Link from "next/link";
import AvatarMenu from "./AvatarMenu";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  items: { name: string; href: string }[];
}

export default function Navbar({ items }: NavbarProps) {
  const router = useRouter();
  const currentRoute = items.findLast((item) =>
    router.pathname.includes(item.href)
  );
  return (
    <nav className=" bg-black/90 text-foreground border-b">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <Link href="/">
            <Button
              className="p-0 hover:underline-none text-base md:text-lg max-w-[75vw] overflow-hidden text-left text-ellipsis"
              variant="link"
            >
              <span className="font-bold text-white"> EQUIP | ACLA </span>
              <span className="text-accent">Building Project</span>
            </Button>
          </Link>
          <div className=" dark hidden sm:ml-6 sm:flex space-x-12 flex-1 items-center justify-center sm:items-stretch sm:justify-start h-full">
            {items.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "rounded-none flex justify-center items-center py-2 text-base font-medium text-muted-foreground hover:text-accent-foreground",
                  item.href === currentRoute?.href &&
                    "border-b-2 border-b-foreground hover:border-b-accent font-bold text-foreground"
                )}
                aria-current={
                  item.href === currentRoute?.href ? "page" : undefined
                }
              >
                {item.name}
              </a>
            ))}
          </div>
          <AvatarMenu />
        </div>
      </div>
    </nav>
  );
}
