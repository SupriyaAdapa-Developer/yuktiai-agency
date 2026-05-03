// ESLint v9 flat config — minimal, accepts modern JS without nitpicking.
export default [
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: { window: "readonly", document: "readonly", fetch: "readonly", FormData: "readonly", Deno: "readonly" }
        },
        rules: { "no-unused-vars": "warn", "no-undef": "warn" }
    }
];
