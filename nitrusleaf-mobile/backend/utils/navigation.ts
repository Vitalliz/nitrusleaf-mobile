import type { Href, Router } from "expo-router";

export const ROUTES = {
  home: "/(tabs)/AI/home",
  history: "/(tabs)/History/history",
  scan: "/(tabs)/AI/scan",
  analysisSummary: "/(tabs)/AI/analysis-summary",
  profile: "/(tabs)/Settings/profile-new",
  maps: "/(tabs)/Maps/maps",
  login: "/login",
  welcome: "/welcome",
  addProperty: "/(tabs)/add-property",
} as const satisfies Record<string, Href>;

export function safeBack(router: Router, fallback: Href) {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallback);
  }
}

export function exitAnalysisFlow(router: Router) {
  router.replace(ROUTES.home);
}

export function switchTab(router: Router, href: Href) {
  router.replace(href);
}

export function openAddProperty(router: Router, returnTo: Href = ROUTES.profile) {
  router.push({
    pathname: ROUTES.addProperty,
    params: { returnTo: String(returnTo) },
  });
}
