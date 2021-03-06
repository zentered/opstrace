/**
 * Copyright 2021 Opstrace, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { PlaywrightTestConfig } from "@playwright/test";
// import { devices } from "playwright";

const config: PlaywrightTestConfig = {
  reporter: "dot",
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: "only-on-failure",
    video: "retry-with-video"
  },
  projects: [
    {
      name: "Chromium",
      use: {
        browserName: "chromium"

        // args: [
        //   // https://github.com/microsoft/playwright/blob/761bd78879c83ed810ae38ef39513b2d874badb1/docs/ci.md#docker
        //   "--disable-dev-shm-usage"
        // ]
      }
    },
    // {
    //   name: "Firefox",
    //   use: { browserName: "firefox" }
    // },
    {
      name: "WebKit",
      use: { browserName: "webkit" }
    }
    // {
    //   name: "Pixel-4",
    //   use: {
    //     browserName: "chromium",
    //     ...devices["Pixel 4"]
    //   }
    // },
    // {
    //   name: "iPhone-11",
    //   use: {
    //     browserName: "webkit",
    //     ...devices["iPhone 11"]
    //   }
    // }
  ]
};

export default config;
