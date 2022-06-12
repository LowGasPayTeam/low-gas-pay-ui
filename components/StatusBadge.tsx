import { Badge } from "@chakra-ui/react";
import { FC, useState } from "react";

interface PropTypes {
  type: 'Created' | 'Pending' | 'Failed' | 'Success'
  text?: string;
}
const StatusBadge: FC<PropTypes> = ({ type, text }) => {
  switch(type) {
    case 'Created':
      text = text ?? 'Created'
      return <Badge colorScheme='purple' borderRadius='2xl'>{text}</Badge>;
    case 'Pending':
      text = text ?? 'Pending'
      return <Badge colorScheme='green' borderRadius='2xl'>{text}</Badge>;
    case 'Failed':
      text = text ?? 'Failed'
      return <Badge colorScheme='red' borderRadius='2xl'>{text}</Badge>;
    case 'Success':
      text = text ?? 'Success'
      return <Badge colorScheme='green' borderRadius='2xl'>{text}</Badge>;
    default:
      text = text ?? 'Default'
      return <Badge borderRadius='2xl'>Default</Badge>;
  }
};

export default StatusBadge;
