import { Button, Row } from "@nextui-org/react";
import { FC, useState } from "react";

export type ActiveTab = 'Token' | 'NFT' | 'Order'

interface PropTypes {
  active: ActiveTab;
  onChange: (tab: ActiveTab) => void;
}
const FeatureSwitch: FC<PropTypes> = ({ active, onChange }) => {
  const handleTabClick = (tab: ActiveTab) => {
    onChange(tab);
  }
  return (
    <Row justify="center">
      <Button.Group>
        <Button
          disabled={active === "Token"}
          onPress={() => handleTabClick("Token")}
        >
          Token
        </Button>
        <Button
          disabled={active === "NFT"}
          onPress={() => handleTabClick("NFT")}
        >
          NFT
        </Button>
        <Button
          disabled={active === "Order"}
          onPress={() => handleTabClick("Order")}
        >
          Order
        </Button>
      </Button.Group>
    </Row>
  );
};

export default FeatureSwitch;
