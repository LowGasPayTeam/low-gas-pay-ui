import { Box, chakra, useRadio, UseRadioProps, Text, HStack } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { FC } from "react";
import { Icon } from "@chakra-ui/react";
import { IconType } from "react-icons/lib";

interface PropTypes extends UseRadioProps {
  text: string;
  icon?: IconType
}
const NavRadio: FC<PropTypes> = (props) => {
  const { text, icon, ...radioProps } = props
  const { state, getInputProps, getCheckboxProps, htmlProps, getLabelProps } =
    useRadio(radioProps)
  return (
    <chakra.label {...htmlProps} cursor='pointer'>
      <input {...getInputProps({})} hidden />
      <Box
        {...getCheckboxProps()}
        bg={state.isChecked ? 'brand.500' : 'gray.200'}
        color={state.isChecked ? '#fff' : 'default'}
        px={4}
        py={2}
        borderRadius='full'
      >
        <HStack justify='center'>
          { icon && <Icon as={icon}/> }
          <Text 
            rounded='full' 
            fontSize='sm'
            {...getLabelProps()}
          >
            { text }
          </Text>
        </HStack>
      </Box>
    </chakra.label>
  )
}

export default NavRadio;
