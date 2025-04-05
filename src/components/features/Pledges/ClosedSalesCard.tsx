import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../ui/card";

interface ClosedSalesCardProps {
  report: {
    id: { value: number };
    date: { value: string };
    cashier: { value: string };
    total: { value: string };
  };
}
export default function ClosedSalesCard({ report }: ClosedSalesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{report.date.value}</CardTitle>
        <CardDescription>{report?.cashier.value}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-6 flex-wrap">
          <div>
            <p className="text-muted-foreground font-light text-sm">
              Sales Total
            </p>
            <p>{report.total.value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
