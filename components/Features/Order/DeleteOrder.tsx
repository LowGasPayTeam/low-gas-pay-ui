import React from "react";
import { Text, Button, Grid, Row } from "@nextui-org/react";

export const DeleteOrder = (onDelete: any) => {
  return (
    <Grid.Container
      css={{ borderRadius: "14px", padding: "0.75rem", maxWidth: "200px" }}
    >
      <Row justify="center" align="center">
        <Text>
          确定要删除次订单？
        </Text>
      </Row>
      <Grid.Container justify="space-between" alignContent="center">
        <Grid>
          <Button size="sm" light auto>
            否
          </Button>
        </Grid>
        <Grid>
          <Button size="sm" shadow color="error" auto onPress={onDelete}>
            是
          </Button>
        </Grid>
      </Grid.Container>
    </Grid.Container>
  );
};
