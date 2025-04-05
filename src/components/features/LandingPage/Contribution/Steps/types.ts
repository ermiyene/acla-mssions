export interface StepProps {
  goNext: () => void;
  canGoNext: () => boolean;
  goBack: () => void;
  canGoBack: () => boolean;
  startOver: () => void;
  canStartOver: () => boolean;
  canGoToStep: (index: number) => boolean;
  goToStep: (index: number) => void;
}

export interface Step {
  title: string;
  component: React.FC<StepProps>;
  parent?: "in-kind" | "money";
}
