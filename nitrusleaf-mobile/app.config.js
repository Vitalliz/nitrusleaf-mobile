module.exports = ({ config }) => {
  const isGitHubActions = Boolean(process.env.GITHUB_ACTIONS);
  const defaultRepoBase =
    isGitHubActions && process.env.GITHUB_REPOSITORY
      ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`
      : "";

  const baseUrl =
    process.env.EXPO_BASE_URL ??
    (process.env.GITHUB_PAGES ? "/nitrusleaf-mobile" : defaultRepoBase);

  const googleMapsApiKey =
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
    config.android?.config?.googleMaps?.apiKey ||
    "AIzaSyDummyKeyForBuildValidation12345";

  return {
    ...config,
    android: {
      ...config.android,
      config: {
        ...config.android?.config,
        googleMaps: {
          apiKey: googleMapsApiKey,
        },
      },
    },
    experiments: {
      ...config.experiments,
      ...(baseUrl ? { baseUrl } : {}),
    },
    extra: {
      ...config.extra,
      supabaseUrl:
        process.env.SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
      supabaseAnonKey:
        process.env.SUPABASE_ANON_KEY ??
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
        "",
    },
  };
};
