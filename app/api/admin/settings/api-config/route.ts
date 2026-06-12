import { settingsGetHandler, settingsPatchHandler } from "@/src/lib/admin-settings-route";
import {
  getApiDeveloperSettings,
  updateApiDeveloperSettings,
} from "@/src/services/platform-settings.service";

export async function GET() {
  return settingsGetHandler(getApiDeveloperSettings);
}

export async function PATCH(req: Request) {
  return settingsPatchHandler(req, updateApiDeveloperSettings);
}
