const appJson = require("./app.json");

const isGitHubActions = Boolean(process.env.GITHUB_ACTIONS);
const defaultRepoBase =
  isGitHubActions && process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`
    : "";

const baseUrl =
  process.env.EXPO_BASE_URL ??
  (process.env.GITHUB_PAGES ? "/nitrusleaf-mobile" : defaultRepoBase);

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    experiments: {
      ...appJson.expo.experiments,
      ...(baseUrl ? { baseUrl } : {}),
    },
    extra: {
      ...appJson.expo.extra,
      supabaseUrl:
        process.env.SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
      supabaseAnonKey:
        process.env.SUPABASE_ANON_KEY ??
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
        "",
    },
  },
};
