# Configuration hierarchy

* `webpack.common.config.ts` "topmost" config.
* `webpack.common.[env].config.ts` import topmost common config.
* `webpack.[project].[env].config.ts` import corresponding env common config.
