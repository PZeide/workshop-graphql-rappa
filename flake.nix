{
  description = "A prisma test project";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/master";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = {
    nixpkgs,
    flake-utils,
    self,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShell = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodePackages.prisma
          bun
          gcc
          stdenv.cc.cc.lib
          openssl
        ];

        shellHook = with pkgs; ''
          export PRISMA_MIGRATION_ENGINE_BINARY="${prisma-engines}/bin/migration-engine"
          export PRISMA_QUERY_ENGINE_BINARY="${prisma-engines}/bin/query-engine"
          export PRISMA_QUERY_ENGINE_LIBRARY="${prisma-engines}/lib/libquery_engine.node"
          export PRISMA_INTROSPECTION_ENGINE_BINARY="${prisma-engines}/bin/introspection-engine"
          export PRISMA_FMT_BINARY="${prisma-engines}/bin/prisma-fmt"
          export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib";
        '';
      };
    });
}
