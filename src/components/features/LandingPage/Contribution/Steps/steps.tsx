import Confirmation from "./Confirmation";
import ContactInfo from "./ContactInfo";
import SelectAmount from "./SelectAmount";
import SelectItems from "./SelectItems";
import StartStep from "./StartStep";
import Summary from "./Summary";
import ThankYou from "./ThankYou/ThankYou";
import TransferMethod from "./TransferMethod";
import { Step } from "./types";

export const steps: Step[] = [
  {
    title: "Start",
    component: StartStep,
  },
  {
    title: "Select Items",
    component: SelectItems,
    parent: "in-kind",
  },
  {
    title: "Select Amount",
    component: SelectAmount,
    parent: "money",
  },
  {
    title: "Transfer Method",
    component: TransferMethod,
    parent: "money",
  },
  {
    title: "Contact Info",
    component: ContactInfo,
  },
  {
    title: "Summary",
    component: Summary,
  },
  {
    title: "Confirmation",
    component: Confirmation,
    parent: "money",
  },
  {
    title: "Thank You",
    component: ThankYou,
  },
];
