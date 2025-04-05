"use client";
import { useTransferMethods } from "@/lib/client/helpers/hooks/pledge.hooks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMemo, useState } from "react";
import { CURRENCY } from "@prisma/client";

export default function Banks() {
  const { data: transferMethods } = useTransferMethods();

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

  return (
    <section className="py-16 relative z-0 bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-accent to-white h-1/2 opacity-10" />
      <div className="container mx-auto px-4 md:px-8 relative">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">
            Our Bank Accounts
          </h2>
          <p className="text-center text-foreground mb-12">
            Choose any of our bank accounts below to make your contribution.
            Click to view the full details.
          </p>

          <Tabs
            value={selectedCurrency}
            className="w-full mb-8"
            onValueChange={setSelectedCurrency}
          >
            <TabsList className="w-full justify-center mb-6 bg-transparent">
              {currencies.map((currency) => (
                <TabsTrigger
                  key={currency}
                  value={currency}
                  className="capitalize data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10 hover:bg-accent/20 transition-colors text-lg"
                >
                  {currencyNameMap[currency as CURRENCY]}
                </TabsTrigger>
              ))}
            </TabsList>

            <Accordion type="single" collapsible className="space-y-4">
              {filteredBanks.map((bank) => (
                <AccordionItem
                  key={bank.id}
                  value={bank.id}
                  className="border-none border-foreground rounded-lg p-2 bg-none hover:scale-[1.005] transition-transform"
                >
                  <AccordionTrigger className="px-4 border-t text-primary">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{bank.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pt-2">
                    <div className="space-y-3 font-mono text-[15px] text-primary">
                      {bank.accountHolderName && (
                        <p className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4" />
                          <span className="font-semibold">Account holder:</span>
                          {bank.accountHolderName}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        <span className="font-semibold">Account number:</span>
                        {bank.accountNumber}
                        <CopyButton text={bank.accountNumber} />
                      </p>
                      {bank.swiftCode && (
                        <p className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4" />
                          <span className="font-semibold">Swift code:</span>
                          {bank.swiftCode}
                          <CopyButton text={bank.swiftCode} />
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
