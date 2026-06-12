import { settingsGetHandler, settingsPatchHandler } from "@/src/lib/admin-settings-route";
import {
  getSecuritySettings,
  updateSecuritySettings,
} from "@/src/services/platform-settings.service";

export async function GET() {
  return settingsGetHandler(getSecuritySettings);
}

export async function PATCH(req: Request) {
  return settingsPatchHandler(req, updateSecuritySettings);
}
