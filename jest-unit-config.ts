/* eslint-disable @typescript-eslint/no-var-requires */
import type { Config } from "@jest/types"

import config from "./jest.config"

const unitTestConfig = config as Partial<Config.InitialOptions>

unitTestConfig.testMatch = ["**/*.spec.ts"]
export default unitTestConfig
