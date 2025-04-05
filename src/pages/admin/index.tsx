import React from "react";
import AdminLayout from "@/components/common/Layout/AdminLayout";
import { useEnumQueryParams } from "@/lib/client/helpers/useQueryParams";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetPledges } from "@/lib/client/helpers/hooks/admin.hooks";
import ListView from "@/components/features/Admin/Pledges/ListView";
import InteractiveTable from "@/components/features/Admin/Pledges/TableView";

export default function Home() {
  const [currentTab, setCurrentTab] = useEnumQueryParams<"in-kind" | "money">(
    "tab",
    "money"
  );

  function handleTabChange(tab: string) {
    const tabValue = tab as typeof currentTab;
    if (!tabValue) return;
    setCurrentTab(tabValue);
  }

  return (
    <AdminLayout>
      {/* <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="ml-auto">
          <TabsTrigger value="money">Monetary</TabsTrigger>
          <TabsTrigger value="in-kind">In Kind</TabsTrigger>
        </TabsList>
        <TabsContent value="money" className="mt-6"></TabsContent>
        <TabsContent value="in-kind" className="mt-6"></TabsContent>
      </Tabs> */}
      {/* <ListView /> */}
      <InteractiveTable />
    </AdminLayout>
  );
}
