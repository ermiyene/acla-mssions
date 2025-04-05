import { uploadThingApi } from "@/lib/server/controllers/upload.controller";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function DeleteUploadRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const key = req.body?.key;

  try {
    await uploadThingApi.deleteFiles(key);
    res.status(200).json({ message: "File deleted" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while deleting file" });
  }
}
