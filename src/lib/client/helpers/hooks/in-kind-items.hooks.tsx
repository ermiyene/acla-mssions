import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Truck, Hammer, PaintBucket } from "lucide-react";
import { InKindItem } from "@prisma/client";


const phases = [
  {
    name: "Structural",
    icon: <Truck className="w-12 h-12 text-accent" />,
    categories: [
      {
        name: "Construction Equipment",
        items: [],
      },
      {
        name: "Construction Materials",
        items: [],
      },
    ],
  },
  {
    name: "Semi-finishing",
    icon: <Hammer className="w-12 h-12 text-accent" />,
    categories: [
      {
        name: "Construction Materials",
        items: [],
      },
    ],
  },
  {
    name: "Finishing",
    icon: <PaintBucket className="w-12 h-12 text-accent" />,
    categories: [
      {
        name: "Materials",
        items: [],
      },
    ],
  },
];

export function useInKindItems() {
  const endpoint = "/api/pledge/items";

  return useQuery({
    queryKey: [endpoint],
    queryFn: async () =>
      await axios.get<
        Pick<
          InKindItem,
          | "id"
          | "name"
          | "category"
          | "parentCategory"
          | "unit"
          | "maxQuantity"
          | "currentQuantity"
        >[]
      >(endpoint),
    refetchOnMount: false,
  });
}
export function usePhases() {
  const query = useInKindItems();

  const items = phases.map((phase) => ({
    ...phase,
    categories: phase.categories.map((category) => ({
      ...category,
      items:
        query?.data?.data?.filter(
          (i) =>
            i?.category === category.name && i?.parentCategory === phase.name
        ) || [],
    })),
  }));

  return { ...query, data: items };
}
