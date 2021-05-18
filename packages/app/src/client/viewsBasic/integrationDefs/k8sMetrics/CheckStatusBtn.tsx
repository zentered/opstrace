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

import React, { useState, useMemo, useEffect } from "react";
import { pathOr } from "ramda";
import { addHours, subHours } from "date-fns";

import graphqlClient from "state/clients/graphqlClient";
import { usePrometheus } from "client/hooks/useGrafana";

import { Integration, integrationStatus } from "state/integrations/utils";
import { Tenant } from "state/tenant/types";

import { Button } from "client/components/Button";

type Props = {
  integration: Integration;
  tenant: Tenant;
};

export const CheckStatusBtn = ({ integration, tenant }: Props) => {
  const [checkingStatus, setCheckingStatus] = useState(false);
  const statusCheckUri = useMemo(() => {
    const promQl = `process_cpu_seconds_total{integration_id="${integration.id}"}`;
    // TODO don't cache this URI on page load
    // Ideally we'd recalculate start=now-1h, end=now each time the button is pressed.
    const pageLoad = new Date();
    const start = subHours(pageLoad, 1);
    const end = addHours(pageLoad, 1);

    return encodeURI(
      `query_range?query=${promQl}&start=${start.toISOString()}&end=${end.toISOString()}&step=300`
    );
  }, [integration.id]);

  const statusUpdateHandler = (metricsFound: boolean) => {
    graphqlClient
      .UpdateIntegrationStatus({
        id: integration.id,
        status: metricsFound
          ? integrationStatus.active
          : integrationStatus.pending
      })
      .then(response => {
        setCheckingStatus(false);
      });
  };

  if (checkingStatus)
    return (
      <CheckingStatusBtn
        statusCheckUri={statusCheckUri}
        tenantName={tenant.name}
        statusUpdateHandler={statusUpdateHandler}
      />
    );
  else
    return (
      <Button
        variant="outlined"
        state="info"
        size="small"
        onClick={() => {
          setCheckingStatus(true);
        }}
      >
        Check Status
      </Button>
    );
};

const CheckingStatusBtn = ({
  statusCheckUri,
  tenantName,
  statusUpdateHandler
}: {
  statusCheckUri: string;
  tenantName: string;
  statusUpdateHandler: Function;
}) => {
  const { data } = usePrometheus(statusCheckUri, tenantName);

  useEffect(() => {
    if (data !== undefined) {
      const status = pathOr("error", ["status"])(data);
      const metrics = pathOr([], ["data", "result"])(data);
      statusUpdateHandler(status === "success" && metrics.length > 0);
    }
  }, [data, statusUpdateHandler]);

  return (
    <Button variant="outlined" state="info" size="small" disabled>
      Checking...
    </Button>
  );
};