import { z } from "zod";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  validation?: z.ZodTypeAny;
  hidden?:
    | boolean
    | ((
        field: FieldConfig,
        form: {
          [key: string]: any;
        }
      ) => boolean);
  options?: readonly {
    label: string;
    value: any; // TODO: add type, should probably be a string because that's the only thin the Shadcn's Select Input accepts
  }[];
  defaultValue?: FieldTypeMap[FieldType]; // TODO: add type safety by using v
};

export type FieldTypeMap = {
  text: string;
  optionalText: string | null | undefined;
  number: number;
  date: Date;
  select: any;
  upload: {
    key: string;
    url: string;
  };
};

export const FieldTypeMap = {
  text: "text",
  optionalText: "optionalText",
  number: "number",
  date: "date",
  select: "select",
  upload: "upload",
} as const;

export type FieldType = keyof FieldTypeMap;

export type FormConfig = {
  title: string;
  fields: readonly FieldConfig[];
};

export type FormValues<FC extends FormConfig> = {
  [field in FC["fields"][number]["name"]]: field extends FC["fields"][number]["name"]
    ? FieldTypeMap[Extract<FC["fields"][number], { name: field }>["type"]]
    : never;
};

export type FormPopupProps<FC extends FormConfig> = {
  trigger: React.ReactNode;
  config: FC;
} & (
  | {
      mode: "edit";
      onEdit: (values: FormValues<FC>) => Promise<void>;
      initialValues: FormValues<FC>;
      onAdd?: never;
    }
  | {
      mode: "add";
      onAdd: (values: FormValues<FC>) => Promise<void>;
      onEdit?: never;
      initialValues?: never;
    }
);
