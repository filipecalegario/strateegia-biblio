import { Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import strateegiaLogo from "../assets/strateegia_logo.png";
import { MAIN_COLOR, SECOND_COLOR, TITLE } from "../components/defaults";

export function LogoFlow() {
  return (
    <Flex
      flexDirection={"column"}
      rounded={"lg"}
      // bg={DEFAULT_COLOR}
      p={8}
      align={"center"}
    >
      <Image src={strateegiaLogo} w="90px" h="90px" mx="10px" />
      <Flex>
        <Text color="white" fontSize="2xl" as="span" fontWeight={"600"}>
          {TITLE}
        </Text>
        <Text marginBottom={"20px"} color="white" fontSize="2xl">
          .strateegia
        </Text>
      </Flex>
    </Flex>
  );
}
