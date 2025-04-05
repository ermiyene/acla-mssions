import { ourFileRouter } from "@/lib/server/controllers/upload.controller";
import { createRouteHandler } from "uploadthing/next-legacy";

export default createRouteHandler({
  router: ourFileRouter,
});
