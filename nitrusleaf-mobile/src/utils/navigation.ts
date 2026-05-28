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

/** Volta uma tela se existir histórico; senão substitui por fallback (evita cair em telas legadas). */
export function safeBack(router: Router, fallback: Href) {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallback);
  }
}

/** Sai do fluxo da câmera/análise e limpa a pilha da aba IA. */
export function exitAnalysisFlow(router: Router) {
  router.replace(ROUTES.home);
}

/** Troca de aba sem empilhar rotas. */
export function switchTab(router: Router, href: Href) {
  router.replace(href);
}

/** Abre cadastro de propriedade informando para onde voltar. */
export function openAddProperty(router: Router, returnTo: Href = ROUTES.profile) {
  router.push({
    pathname: ROUTES.addProperty,
    params: { returnTo: String(returnTo) },
  });
}
