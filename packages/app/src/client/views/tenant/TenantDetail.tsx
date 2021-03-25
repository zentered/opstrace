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
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import useTenantList from "state/tenant/hooks/useTenantList";
import { usePickerService } from "client/services/Picker";

import { deleteTenant } from "state/tenant/actions";

import Skeleton from "@material-ui/lab/Skeleton";
import { Box } from "client/components/Box";
import Attribute from "client/components/Attribute";
import { Card, CardContent, CardHeader } from "client/components/Card";
import { Button } from "client/components/Button";
import Typography from "client/components/Typography/Typography";
import { ExternalLink } from "client/components/Link";

const TenantDetail = () => {
  const params = useParams<{ tenantId: string }>();
  const history = useHistory();
  const tenants = useTenantList();
  const dispatch = useDispatch();

  const tenant = useMemo(() => tenants.find(t => t.name === params.tenantId), [
    params.tenantId,
    tenants
  ]);

  const { activatePickerWithText } = usePickerService(
    {
      title: `Delete ${tenant?.name}?`,
      activationPrefix: "delete tenant directly?:",
      disableFilter: true,
      disableInput: true,
      options: [
        {
          id: "yes",
          text: `yes`
        },
        {
          id: "no",
          text: "no"
        }
      ],
      onSelected: option => {
        if (option.id === "yes" && tenant?.name) {
          dispatch(deleteTenant(tenant?.name));
        }
      }
    },
    [tenant?.name]
  );

  if (!tenant)
    return (
      <Skeleton variant="rect" width="100%" height="100%" animation="wave" />
    );
  else
    return (
      <Box
        width="100%"
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        p={1}
      >
        <Box maxWidth={700}>
          <Card p={3}>
            <CardHeader
              titleTypographyProps={{ variant: "h5" }}
              action={
                <Box ml={3} display="flex" flexWrap="wrap">
                  <Box p={1}>
                    <Button
                      variant="outlined"
                      size="medium"
                      onClick={() =>
                        history.push(
                          `/cluster/tenants/${tenant.name}/alertmanager-config`
                        )
                      }
                    >
                      Alerts
                    </Button>
                  </Box>
                  <Box p={1}>
                    <Button
                      variant="outlined"
                      size="medium"
                      disabled={tenant.type === "SYSTEM"}
                      onClick={() =>
                        activatePickerWithText("delete tenant directly?: ")
                      }
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              }
              title={tenant.name}
            />
            <CardContent>
              <Box display="flex">
                <Box display="flex" flexDirection="column">
                  <Attribute.Key>Grafana:</Attribute.Key>
                  <Attribute.Key>Created:</Attribute.Key>
                </Box>
                <Box display="flex" flexDirection="column" flexGrow={1}>
                  <Attribute.Value>
                    <ExternalLink
                      href={`${window.location.protocol}//${tenant.name}.${window.location.host}`}
                    >
                      {`${tenant.name}.${window.location.host}`}
                    </ExternalLink>
                  </Attribute.Value>
                  <Attribute.Value>{tenant.created_at}</Attribute.Value>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Typography color="textSecondary">
            New tenants can take 5 minutes to provision with dns propagation
          </Typography>
        </Box>
      </Box>
    );
};

export default TenantDetail;