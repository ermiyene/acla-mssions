import dayjs, { Dayjs } from "dayjs";
import { FieldConfig, FieldTypeMap, FormConfig, FormValues } from "./types";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "../Upload/UploadButton";

export function mapValuesToFields<FC extends FormConfig>(
  values: FormValues<FC>,
  config: FC
) {
  const mappedFieldValues = Object.entries(values)?.map(([key, value]) => {
    const field = config?.fields?.find((f) => f?.name === key);

    switch (field?.type) {
      case FieldTypeMap.number:
        return { [key]: String(value) };
      case FieldTypeMap.date:
        return { [key]: dayjs(value as Dayjs).format("YYYY-MM-DD") };

      case FieldTypeMap.select:
        return { [key]: String(value) };
      case FieldTypeMap.text:
      case FieldTypeMap.optionalText:
      default:
        return { [key]: value };
    }
  });

  return mappedFieldValues?.reduce((acc, field) => {
    return { ...acc, ...field };
  }, {} as Record<string, any>);
}

export function mapFieldsToValues<FC extends FormConfig>(
  fieldValues: Record<string, any>,
  config: FC
) {
  const mappedValues = Object.entries(fieldValues)?.map(([key, value]) => {
    const field = config?.fields?.find((f) => f?.name === key);

    switch (field?.type) {
      case FieldTypeMap.number:
        return { [key]: Number(value) };
      case FieldTypeMap.date:
        return { [key]: new Date(value as string) };
      case FieldTypeMap.select:
        return { [key]: Number(value) || value };
      case FieldTypeMap.text:
      case FieldTypeMap.optionalText:
      default:
        return { [key]: value };
    }
  });

  return mappedValues?.reduce((acc, field) => {
    return { ...acc, ...field };
  }, {} as FormValues<FC>);
}

export function extractDefaultValues<FC extends FormConfig>(config: FC) {
  const defaultValues = config.fields.reduce((acc, field) => {
    if (field.defaultValue) {
      acc[field.name] = field.defaultValue;
    }
    return acc;
  }, {} as Record<string, any>) as FormValues<FC>;

  return mapValuesToFields(defaultValues, config);
}

export function mapTypeToComponent(
  field: FieldConfig,
  formField: ControllerRenderProps<
    {
      [x: string]: any;
    },
    string
  >,
  form: UseFormReturn
) {
  switch (field.type) {
    case FieldTypeMap.select:
      return (
        <Select
          name={field.name}
          value={formField.value?.toString()}
          onValueChange={formField.onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={"Select an option"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{field.label}</SelectLabel>
              {field?.options?.map((o) => (
                <SelectItem key={o?.value} value={o.value?.toString()}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    case FieldTypeMap.upload:
      return (
        <UploadButton
          file={formField.value}
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            form.clearErrors(field.name);
            formField.onChange(res?.[0]);
          }}
          onUploadError={(error: Error) => {
            form.setError(field.name, {
              type: "manual",
              message: error.message,
            });
          }}
          onRemove={() => {
            formField.onChange(null);
          }}
        />
      );
    case FieldTypeMap.number:
    case FieldTypeMap.date:
    case FieldTypeMap.text:
    case FieldTypeMap.optionalText:
    default:
      return <Input id={field.name} type={field.type} {...formField} />;
  }
}
