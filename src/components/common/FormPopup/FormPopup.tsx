import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { LPopup } from "../LPopup";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../ui/form";
import { formatErrorMessage } from "@/lib/common/utils/error";
import { FieldConfig, FormConfig, FormPopupProps, FormValues } from "./types";
import {
  extractDefaultValues,
  mapFieldsToValues,
  mapTypeToComponent,
  mapValuesToFields,
} from "./utils";

export function FormPopup<FC extends FormConfig>({
  onAdd,
  onEdit,
  initialValues,
  trigger,
  mode,
  config,
}: FormPopupProps<FC>) {
  const [loading, setLoading] = useState(false);
  const closePopup = useRef<() => void>();
  const formSchema = (fields: FieldConfig[]) =>
    z.object(
      fields.reduce((acc, field) => {
        if (field.validation) {
          acc[field.name] = field.validation;
        }
        return acc;
      }, {} as Record<string, z.ZodTypeAny>)
    );
  const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: (...args) =>
      zodResolver(
        formSchema(
          config.fields?.filter((f) => {
            console.log({
              values: args[0],
            });
            if (typeof f.hidden === "boolean") {
              return !f?.hidden;
            }
            if (typeof f.hidden === "function") {
              return !f.hidden(f, args[0]);
            }
            return true;
          })
        )
      )(...args),
  });

  async function handleSubmit(values: z.infer<ReturnType<typeof formSchema>>) {
    setLoading(true);
    try {
      if (mode === "add") {
        await onAdd?.(mapFieldsToValues(values, config) as FormValues<FC>);
      }

      if (mode === "edit") {
        await onEdit?.(
          mapFieldsToValues(
            { ...initialValues, ...values },
            config
          ) as FormValues<FC>
        );
      }

      closePopup.current?.();
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message: formatErrorMessage(error, `Failed to ${mode} report`),
      });
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange() {
    if (mode === "edit") {
      form.reset(mapValuesToFields(initialValues, config));
      console.log({ initialValues: mapValuesToFields(initialValues, config) });
    }

    if (mode === "add") {
      const defaultValues = extractDefaultValues(config);
      form.reset(extractDefaultValues(config));
    }
  }

  return (
    <LPopup
      trigger={trigger}
      title={`${mode === "add" ? "Add" : "Edit"} ${config.title}`}
      footer={
        <Button
          form="sales-report-form"
          type="submit"
          className="w-full flex gap-2"
          loading={loading}
        >
          Save
        </Button>
      }
      onOpenChange={handleOpenChange}
    >
      {({ close }) => {
        closePopup.current = close;
        return (
          <FormProvider {...form}>
            <form
              id="sales-report-form"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="grid gap-6 p-6 w-full max-md:max-w-sm mx-auto max-h-[75vh] overflow-auto"
            >
              {config.fields
                ?.filter((f) => {
                  if (typeof f.hidden === "boolean") {
                    return !f?.hidden;
                  }
                  if (typeof f.hidden === "function") {
                    return !f.hidden(f, form.watch());
                  }
                  return true;
                })
                .map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel htmlFor={field.name}>
                          {field.label}
                        </FormLabel>
                        <FormControl>
                          {mapTypeToComponent(field, formField, form)}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              <FormMessage className="border border-destructive bg-destructive/15 w-full py-2 px-4 rounded">
                {form.formState.errors.root?.message}
              </FormMessage>
            </form>
          </FormProvider>
        );
      }}
    </LPopup>
  );
}
