import type { CodegenConfig } from "@graphql-codegen/cli";
import { DateTimeResolver } from "graphql-scalars";

const config: CodegenConfig = {
  emitLegacyCommonJSImports: false,
  schema: "./src/schema.ts",
  config: {
    scalars: {
      DateTime: DateTimeResolver.extensions.codegenScalarType,
    },
  },
  generates: {
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
