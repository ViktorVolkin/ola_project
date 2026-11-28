#!/usr/bin/env bash
set -euo pipefail
# This compatibility entrypoint delegates to the managed private suite lifecycle.
root=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd -P)
cd "$root"
exec "${OLA_NODE:-node}" scripts/qa/suites.mjs migration "$@"
