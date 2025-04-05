"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GridItem } from "./gridItems";
import { cn } from "@/lib/client/helpers/cn";

interface GridCellProps {
  item: GridItem;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

export function GridCell({ item, onMouseEnter, onMouseLeave }: GridCellProps) {
  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        {
          dark: item?.dark,
          "max-sm:!col-span-1 max-sm:!row-span-2 !max-h-full":
            item?.colSpan > 1, // in mobile, shouldn't span more than one col
        },
        `relative group overflow-hidden hover:rounded-2xl m-[16px]`
      )}
      style={{
        gridColumn: `span ${item?.colSpan || 1}`,
        gridRow: `span ${item?.rowSpan || 1}`,
        maxWidth: (item.colSpan || 1) * 300,
        maxHeight: (item.rowSpan || 1) * 200 + (item.rowSpan || 1) * 16,
      }}
      whileHover={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {item.type === "image" ? (
        <div className="relative h-full w-full aspect-[4/3] group-hover:contrast-125 border border-zinc-900">
          <Image
            src={item.content}
            alt="Church members photo"
            fill
            loading="lazy"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="p-6 h-full flex flex-col justify-center transition-colors duration-300 group-hover:bg-stone-200 dark:group-hover:bg-stone-800 bg-stone-100 dark:bg-stone-900">
          {item.author && (
            <cite className="mb-5 block text-xl text-stone-600 dark:text-stone-400 not-italic">
              {item.author}
            </cite>
          )}
          <blockquote className="text-base md:text-xl font-serif text-stone-800 dark:text-stone-200">
            {item.content}
          </blockquote>
        </div>
      )}
    </motion.div>
  );
}
