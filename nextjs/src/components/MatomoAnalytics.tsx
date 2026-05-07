"use client";

import { trackAppRouter } from "@socialgouv/matomo-next";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const MATOMO_URL = "https://oxfamfrance.matomo.cloud";
const MATOMO_SITE_ID = "1";

export function MatomoAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    trackAppRouter({
      url: MATOMO_URL,
      siteId: MATOMO_SITE_ID,
      pathname,
      searchParams,
    });
  }, [pathname, searchParams]);

  return null;
}
