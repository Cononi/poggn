import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import {
  buildDashboardSnapshot,
  createProjectCategory,
  deleteProjectCategory,
  moveProjectToCategory,
  renameProjectCategory,
  setDefaultProjectCategory
} from "../../packages/core/src/index";

const dashboardRoot = path.resolve(process.env.PGG_DASHBOARD_ROOT ?? process.cwd());

async function readJsonBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string, unknown>;
}

function writeJson(response: ServerResponse, status: number, payload: unknown): void {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(`${JSON.stringify(payload, null, 2)}\n`);
}

function createDashboardApiPlugin(): Plugin {
  return {
    name: "pgg-dashboard-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const url = request.url ? new URL(request.url, "http://127.0.0.1") : null;
        if (!url || !url.pathname.startsWith("/api/dashboard")) {
          next();
          return;
        }

        try {
          if (request.method === "GET" && url.pathname === "/api/dashboard/snapshot") {
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          if (request.method === "POST" && url.pathname === "/api/dashboard/categories") {
            const body = await readJsonBody(request);
            if (typeof body.name !== "string") {
              writeJson(response, 400, { error: "Category name is required." });
              return;
            }
            await createProjectCategory(body.name);
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          if (request.method === "POST" && url.pathname === "/api/dashboard/categories/move") {
            const body = await readJsonBody(request);
            if (
              typeof body.projectId !== "string" ||
              typeof body.targetCategoryId !== "string"
            ) {
              writeJson(response, 400, { error: "projectId and targetCategoryId are required." });
              return;
            }
            await moveProjectToCategory(
              body.projectId,
              body.targetCategoryId,
              typeof body.targetIndex === "number" ? body.targetIndex : undefined
            );
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          const categoryMatch = url.pathname.match(/^\/api\/dashboard\/categories\/([^/]+)$/);
          if (categoryMatch && request.method === "PATCH") {
            const body = await readJsonBody(request);
            if (typeof body.name !== "string") {
              writeJson(response, 400, { error: "Updated category name is required." });
              return;
            }
            await renameProjectCategory(categoryMatch[1]!, body.name);
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          if (categoryMatch && request.method === "DELETE") {
            await deleteProjectCategory(categoryMatch[1]!);
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          const defaultMatch = url.pathname.match(/^\/api\/dashboard\/categories\/([^/]+)\/default$/);
          if (defaultMatch && request.method === "POST") {
            await setDefaultProjectCategory(defaultMatch[1]!);
            writeJson(response, 200, await buildDashboardSnapshot(dashboardRoot));
            return;
          }

          writeJson(response, 404, { error: "Dashboard API route not found." });
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          writeJson(response, 500, { error: message });
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), createDashboardApiPlugin()],
  server: {
    host: "127.0.0.1",
    port: 4173
  }
});
