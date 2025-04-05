import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  MessageSquareWarning,
  Pencil,
  Trash,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useTransferMethods,
  useDeleteTransferMethod,
} from "@/lib/client/helpers/hooks/pledge.hooks";
import { CURRENCY } from "@prisma/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BankDialogForm from "./BankDialogForm";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@/components/ui/popover";
import { toast } from "sonner";
import { formatErrorMessage } from "@/lib/common/utils/error";

const InteractiveTable = () => {
  const { data: transferMethods } = useTransferMethods();
  const { mutateAsync: deleteTransferMethod, isPending: isDeleting } =
    useDeleteTransferMethod();

  const currencies = useMemo(() => {
    if (!transferMethods?.data) return [];
    return Array.from(
      new Set(transferMethods.data.map((bank) => bank.currency))
    )?.sort();
  }, [transferMethods?.data]);

  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    currencies[0] || ""
  );

  const currencyNameMap = {
    [CURRENCY.ETB]: "Ethiopian Banks",
    [CURRENCY.USD]: "International Banks",
  };

  const filteredBanks = useMemo(() => {
    if (!transferMethods?.data) return [];
    return transferMethods.data.filter(
      (bank) => bank.currency === selectedCurrency
    );
  }, [transferMethods?.data, selectedCurrency]);

  const handleDeleteTransferMethod = async (id: string) => {
    try {
      await deleteTransferMethod({ id });
      toast.success("Bank deleted successfully");
    } catch (error) {
      toast.error(formatErrorMessage(error, "Failed to delete bank"));
    }
  };

  return (
    <div className="pb-16">
      <div className="flex justify-between items-center mb-4 border-b border-border p-4">
        <h1 className="text-2xl font-semibold">Banks</h1>
        <BankDialogForm trigger={<Button>Add bank</Button>} />
      </div>

      <Tabs
        value={selectedCurrency}
        onValueChange={setSelectedCurrency}
        className="px-4"
      >
        <TabsList>
          {currencies.map((currency) => (
            <TabsTrigger key={currency} value={currency}>
              {currencyNameMap[currency]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Account Holder</TableHead>
              <TableHead>Account Number</TableHead>
              <TableHead>Swift Code</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBanks.map((bank) => (
              <TableRow key={bank.id}>
                <TableCell>{bank.id}</TableCell>
                <TableCell>{bank.name}</TableCell>
                <TableCell>{bank.currency}</TableCell>
                <TableCell>{bank.accountHolderName}</TableCell>
                <TableCell>{bank.accountNumber}</TableCell>
                <TableCell>{bank.swiftCode}</TableCell>
                <TableCell>
                  <BankDialogForm
                    trigger={
                      <Button variant="ghost" size="icon">
                        <Pencil />
                      </Button>
                    }
                    selectedBank={bank}
                  />

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="rounded-none border-primary">
                      <p>
                        Are you sure you want to delete this bank? This
                        can&apos;t be undone.
                      </p>
                      <Button
                        className="ml-auto mt-2 w-full"
                        variant="destructive"
                        size={"sm"}
                        loading={isDeleting}
                        onClick={() => handleDeleteTransferMethod(bank.id)}
                      >
                        Yes, delete
                      </Button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InteractiveTable;
