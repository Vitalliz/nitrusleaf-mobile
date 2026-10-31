module.exports = ({ config }) => {
  const isGitHubActions = Boolean(process.env.GITHUB_ACTIONS);
  const defaultRepoBase =
    isGitHubActions && process.env.GITHUB_REPOSITORY
      ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`
      : "";

  const baseUrl =
    process.env.EXPO_BASE_URL ??
    (process.env.GITHUB_PAGES ? "/nitrusleaf-mobile" : defaultRepoBase);

  return {
    ...config,
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
