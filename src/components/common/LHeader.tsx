import { PencilIcon } from "@heroicons/react/20/solid";
import { PlusIcon } from "@radix-ui/react-icons";

interface LHeaderProps {
  title: string;
  subTitle?: string;
}
export default function LHeader({ title, subTitle }: LHeaderProps) {
  return (
    <div className="lg:flex lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-foreground sm:truncate sm:text-3xl sm:tracking-tight">
          {title}
        </h2>
        {subTitle && (
          <p className="text-muted-foreground text-sm mt-2">{subTitle}</p>
        )}
      </div>
    </div>
  );
}
