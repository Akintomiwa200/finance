import { settingsGetHandler, settingsPatchHandler } from "@/src/lib/admin-settings-route";
import {
  getPrivacySettings,
  updatePrivacySettings,
} from "@/src/services/platform-settings.service";

export async function GET() {
  return settingsGetHandler(getPrivacySettings);
}

export async function PATCH(req: Request) {
  return settingsPatchHandler(req, updatePrivacySettings);
}
