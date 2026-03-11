import type messages from "./messages/fr.json";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof messages;
  }
}
