import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddTransferMethod,
  useEditTransferMethod,
} from "@/lib/client/helpers/hooks/pledge.hooks";
import { formatErrorMessage } from "@/lib/common/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { CURRENCY } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface BankDialogFormProps {
  trigger: React.ReactNode;
  selectedBank?: {
    id: string;
    name: string;
    accountNumber: string;
    currency: CURRENCY;
    accountHolderName?: string;
    swiftCode?: string;
  };
}
export default function BankDialogForm({
  trigger,
  selectedBank,
}: BankDialogFormProps) {
  const { mutateAsync: addBank, isPending: isAdding } = useAddTransferMethod();
  const { mutateAsync: editBank, isPending: isEditing } =
    useEditTransferMethod();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<{
    id: string;
    name: string;
    accountNumber: string;
    currency: CURRENCY;
    accountHolderName?: string;
    swiftCode?: string;
  }>({
    defaultValues: {
      name: selectedBank?.name || "",
      accountNumber: selectedBank?.accountNumber || "",
      currency: selectedBank?.currency || CURRENCY.ETB,
      accountHolderName: selectedBank?.accountHolderName || "",
      swiftCode: selectedBank?.swiftCode || "",
    },
    resolver: zodResolver(
      z.object({
        name: z.string().min(1),
        accountNumber: z.string().min(1),
        currency: z.nativeEnum(CURRENCY),
        accountHolderName: z.string().min(1),
        swiftCode: z.string().optional(),
      })
    ),
  });

  useEffect(() => {
    if (
      selectedBank &&
      !!selectedBank.id &&
      form.getValues("id") !== selectedBank.id
    ) {
      form.setValue("id", selectedBank.id);
      form.setValue("name", selectedBank.name);
      form.setValue("accountNumber", selectedBank.accountNumber);
      form.setValue("currency", selectedBank.currency);
      form.setValue("accountHolderName", selectedBank.accountHolderName);
      form.setValue("swiftCode", selectedBank.swiftCode);
    }
  }, [selectedBank, form]);

  const onAdd = async (data: {
    name: string;
    accountNumber: string;
    currency: CURRENCY;
    accountHolderName?: string;
    swiftCode?: string;
  }) => {
    try {
      await addBank(data);
      toast.success("Bank added successfully");
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast.error(formatErrorMessage(error, "Failed to add bank"));
    }
  };

  const onEdit = async (data: {
    id: string;
    name: string;
    accountNumber: string;
    currency: CURRENCY;
    accountHolderName?: string;
    swiftCode?: string;
  }) => {
    try {
      await editBank({
        ...selectedBank,
        ...data,
      });
      toast.success("Bank updated successfully");
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast.error(formatErrorMessage(error, "Failed to update bank"));
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="rounded-none max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{!!selectedBank ? "Edit Bank" : "Add Bank"}</DialogTitle>
        </DialogHeader>
        <form
          id="bank-form"
          onSubmit={form.handleSubmit(!!selectedBank ? onEdit : onAdd)}
        >
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                disabled={isAdding || isEditing}
                id="name"
                {...form.register("name")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                disabled={isAdding || isEditing}
                id="accountNumber"
                {...form.register("accountNumber")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                disabled={isAdding || isEditing}
                value={form.getValues("currency")}
                onValueChange={(v) => form.setValue("currency", v as CURRENCY)}
                onOpenChange={(o) => o && form.setFocus("currency")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CURRENCY.ETB}>ETB</SelectItem>
                  <SelectItem value={CURRENCY.USD}>USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="accountHolderName">Account Holder Name</Label>
              <Input
                disabled={isAdding || isEditing}
                id="accountHolderName"
                {...form.register("accountHolderName")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="swiftCode">Swift Code</Label>
              <Input
                disabled={isAdding || isEditing}
                id="swiftCode"
                {...form.register("swiftCode")}
              />
            </div>
          </div>
        </form>
        <DialogFooter className="flex sm:flex-col gap-2">
          <Button
            form="bank-form"
            type="submit"
            loading={isAdding || isEditing}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
