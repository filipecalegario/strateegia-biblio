import { Flex, Spinner, Text } from "@chakra-ui/react";
import { LogoFlow } from "./LogoFlow";
import { MAIN_COLOR, SECOND_COLOR, TITLE } from "../components/defaults";

export default function Loading({ active }) {
  return active ? (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      // mt={6}
      bg={MAIN_COLOR}
      flexDirection={"column"}
    >
      <LogoFlow />
      <Spinner
        thickness="5px"
        speed="0.65s"
        emptyColor="white"
        color={MAIN_COLOR}
        size="xl"
        mb={3}
      />
      <Text fontSize="lg" fontWeight={"600"} color="white">
        carregando
      </Text>
      <Text fontSize="lg" color="white">
        pode levar até 30 segundos
      </Text>
    </Flex>
  ) : null;
}
