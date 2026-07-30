import { redirect } from "next/navigation";

export default function NotificationWebhooksRedirectPage() {
  redirect("/settings/integrations/webhooks");
}
