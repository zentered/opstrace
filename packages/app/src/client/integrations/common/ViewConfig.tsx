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

import React, { useMemo } from "react";

import useWindowSize from "client/hooks/useWindowSize";

import { YamlEditor } from "client/components/Editor";

import { Box } from "client/components/Box";

export const ViewConfig = ({
  filename,
  config,
  maxWidth = 1000,
  fixedHeight,
  heightBuffer = 0
}: {
  filename: string;
  config: string;
  maxWidth?: number;
  fixedHeight?: number;
  heightBuffer?: number;
}) => {
  const size = useWindowSize();

  const [boxWidth, boxHeight] = useMemo(() => {
    const margins = 32 * 2 + 25 * 2 + 30;
    const width = (size.width > maxWidth ? maxWidth : size.width) - margins;
    const height =
      (fixedHeight ? fixedHeight : size.height) - margins - heightBuffer;

    return [width, height];
  }, [size.width, size.height, maxWidth, fixedHeight, heightBuffer]);

  return (
    <Box width={`${boxWidth}px`} height={`${boxHeight}px`}>
      <YamlEditor filename={filename} data={config} configViewer={true} />
    </Box>
  );
};
