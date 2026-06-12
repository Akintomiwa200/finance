import { settingsGetHandler } from "@/src/lib/admin-settings-route";
import { getSettingsOverview } from "@/src/services/platform-settings.service";

export async function GET() {
  return settingsGetHandler(getSettingsOverview);
}
