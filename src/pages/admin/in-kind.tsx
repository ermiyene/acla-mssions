import AdminLayout from "@/components/common/Layout/AdminLayout";
import { TimerIcon } from "lucide-react";

export default function InKindItems() {
  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center m-auto h-full w-full min-h-[400px]">
        <TimerIcon className="w-10 h-10" />
        <h1 className="text-3xl">Coming soon!</h1>
      </div>
    </AdminLayout>
  );
}
