import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/client/helpers/cn";
import { formatErrorMessage } from "@/lib/common/utils/error";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  generateReactHelpers,
  generateUploadButton,
  useDropzone,
} from "@uploadthing/react";
import axios from "axios";
import React, { useCallback, useId, useMemo, useState } from "react";
import { UploadThingError } from "uploadthing/server";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { ImageIcon } from "lucide-react";

type UploadButtonProps = Pick<
  Parameters<ReturnType<typeof generateUploadButton>>[0],
  "onClientUploadComplete" | "endpoint" | "onUploadError"
> & {
  className?: string;
  file?: {
    key: string;
    url: string;
  } | null;
  label?: string;
  disabled?: boolean;
  onRemove?: () => void;
};

export function UploadButton({
  className,
  file: uploadedFile,
  label = "Upload",
  disabled,
  ...props
}: UploadButtonProps) {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);
  const id = useId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const { useUploadThing } = generateReactHelpers({
    url: "/api/upload",
  });

  const { startUpload, routeConfig } = useUploadThing(props.endpoint, {
    onClientUploadComplete: props.onClientUploadComplete,
    onUploadError: props.onUploadError,
  });
  const { getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
  });

  const [removeLoading, setRemoveLoading] = React.useState(false);

  const combinedFiles = useMemo(() => {
    const _files: {
      url: string;
      file:
        | File
        | {
            key: string;
            url: string;
          };
    }[] = uploadedFile?.url
      ? [
          {
            file: uploadedFile,
            url: uploadedFile?.url,
          },
        ]
      : [];
    files?.forEach((f) =>
      _files.push({
        file: f,
        url: URL.createObjectURL(f),
      })
    );
    return _files;
  }, [uploadedFile, files]);

  async function handleRemove(
    f:
      | File
      | {
          key: string;
          url: string;
        }
  ) {
    if (f instanceof File) {
      setFiles((prev) => prev?.filter((_f) => _f !== f));
      return;
    }
    setRemoveLoading(true);
    try {
      await axios.post(
        // TEMPORARY SOLUTION
        // !IMPORTANT: THIS IS NOT GOOD PRACTICE. The file must not be deletable before another screenshot is uploaded. When a user edits a payment the user can delete the screenshot and if they don't save, the screenshot will be deleted from the server but the DB won't be updated. Even if they upload a new screenshot, the DB will still be referencing the old screenshot unless the user saves the changes. This is because uploadthing and the server don't communicate with each other. A proper solution would be to delete the file from the server only after the user saves the changes.
        "/api/upload/delete",
        {
          key: f.key,
        },
        {
          withCredentials: true,
        }
      );
      props.onRemove?.();
    } catch (error) {
      props.onUploadError?.(
        new UploadThingError(formatErrorMessage(error, "Error deleting file"))
      );
    } finally {
      setRemoveLoading(false);
    }
  }

  async function handleUpload() {
    setLoading(true);
    try {
      await startUpload(files);
      setFiles([]);
    } catch (error) {
      setError(formatErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }
  return (
    <Card
      className={cn("border border-primary rounded-none w-full", className)}
    >
      <CardContent className="w-full flex flex-col gap-4 p-0 items-center">
        {!!combinedFiles?.length ? (
          <>
            {combinedFiles?.map((f) => (
              <div className="w-full" key={f?.url}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f?.url}
                  alt="Uploaded Image"
                  className="w-full h-48 object-contain"
                />
                <div className="flex gap-2 mt-3 w-full p-2">
                  <Button
                    size="sm"
                    type="button"
                    loading={removeLoading}
                    disabled={loading || disabled}
                    onClick={() => handleRemove(f.file)}
                    variant={"destructive"}
                    className="flex-1"
                  >
                    <TrashIcon />
                    Remove
                  </Button>
                  {files.length > 0 && (
                    <Button
                      size="sm"
                      loading={loading}
                      disabled={disabled}
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handleUpload}
                    >
                      Upload
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <label
            className="w-full text-center py-16 cursor-pointer hover:bg-foreground/10 focus-within:bg-foreground/10 rounded-none transition-colors"
            htmlFor={id}
          >
            <span className="border-dashed w-fit h-fit border py-2 px-3 border-primary/50">
              <ImageIcon className="inline w-4 h-4 mb-0.5" /> Choose photo
            </span>
            <input
              disabled={loading || disabled}
              id={id}
              {...getInputProps()}
            />
          </label>
        )}
      </CardContent>
    </Card>
  );
}
