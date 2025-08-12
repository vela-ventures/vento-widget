import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import commonjs from "@rollup/plugin-commonjs";

const isProd = process.env.NODE_ENV === "production";

export default [
  // Bundle the library
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "esm",
        sourcemap: true,
      },
      {
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: [
      postcss({
        inject: true, // Auto-inject CSS into JS bundle
        minimize: true,
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs({
        include: /node_modules/,
        transformMixedEsModules: true,
      }),
      typescript({
        tsconfig: "./tsconfig.json",
        sourceMap: true,
        declaration: true,
        declarationDir: "dist/types",
        jsx: "react-jsx",
      }),
      ...(isProd
        ? [
            terser({
              compress: {
                drop_console: true,
              },
            }),
          ]
        : []),
    ],
    external: [
      "react",
      "react-dom",
      "@vela-ventures/vento-sdk",
      "@permaweb/aoconnect",
    ],
  },
  // Generate type definitions
  {
    input: "dist/types/index.d.ts",
    output: {
      file: "dist/index.d.ts",
      format: "esm",
    },
    plugins: [dts()],
    external: [/\.css$/],
  },
];
