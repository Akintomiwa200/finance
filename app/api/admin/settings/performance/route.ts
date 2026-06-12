import { settingsGetHandler, settingsPatchHandler } from "@/src/lib/admin-settings-route";
import {
  getPerformanceSettings,
  updatePerformanceSettings,
} from "@/src/services/platform-settings.service";

export async function GET() {
  return settingsGetHandler(getPerformanceSettings);
}

export async function PATCH(req: Request) {
  return settingsPatchHandler(req, updatePerformanceSettings);
}
