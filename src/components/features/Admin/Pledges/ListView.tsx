import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPledges } from "@/lib/client/helpers/hooks/admin.hooks";

function ListView() {
  const query = useGetPledges();
  const data = query.data?.data || [];

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.name || "No Name"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div>ID: {item.id}</div>
            {item.phone && <div>Phone: {item.phone}</div>}
            {item.phoneVerifications?.length > 0 && (
              <div>
                Verification Date:{" "}
                {item.phoneVerifications[0].verificationDate || "N/A"}
              </div>
            )}
            {item.monetaryContribution && (
              <>
                <div>
                  Monetary Contribution: ${item.monetaryContribution.amount}
                </div>
                <div>
                  Transfer Method: {item.monetaryContribution.transferMethodId}
                </div>
              </>
            )}
            {item.inKindContribution &&
              item.inKindContribution.inKindItemSelections.length > 0 && (
                <>
                  <div>In-kind Contributions:</div>
                  <ul>
                    {item.inKindContribution.inKindItemSelections.map(
                      (sel, index) => (
                        <li key={index}>
                          Item ID: {sel.inKindItemId}, Amount: {sel.amount},
                          Hand Over Date: {String(sel.handOverDate)}
                        </li>
                      )
                    )}
                  </ul>
                </>
              )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default ListView;
