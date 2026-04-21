const appJson = require("./app.json");

/** @type {import('@expo/config').ExpoConfig} */
module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
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
