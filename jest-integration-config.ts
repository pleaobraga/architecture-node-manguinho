import type { Config } from "@jest/types"

import config from "./jest.config"

const integrationTestConfig = config as Partial<Config.InitialOptions>

integrationTestConfig.testMatch = ["**/*.test.ts"]
export default integrationTestConfig
