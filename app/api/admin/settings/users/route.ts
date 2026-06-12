import { settingsGetHandler, settingsPatchHandler } from "@/src/lib/admin-settings-route";
import {
  getTenantAccessSettings,
  updateTenantAccessSettings,
} from "@/src/services/platform-settings.service";

export async function GET() {
  return settingsGetHandler(getTenantAccessSettings);
}

export async function PATCH(req: Request) {
  return settingsPatchHandler(req, updateTenantAccessSettings);
}
