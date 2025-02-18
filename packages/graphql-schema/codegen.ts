import type { CodegenConfig } from "@graphql-codegen/cli";
import { DateTimeResolver } from "graphql-scalars";

const config: CodegenConfig = {
  emitLegacyCommonJSImports: false,
  schema: "./src/schema.ts",
  documents: ["../../apps/frontend/src/**/*.{ts,tsx}"],
  ignoreNoDocuments: true,
  config: {
    scalars: {
      DateTime: DateTimeResolver.extensions.codegenScalarType,
    },
  },
  generates: {
    "./src/client/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
    "./src/resolvers-types.ts": {
      config: {
        useIndexSignature: true,
        defaultMapper: "Partial<{T}>",
      },
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
