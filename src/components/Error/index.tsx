import { Box, Flex, Heading } from '@chakra-ui/react';
import ErrorSvg from '../../svgs/Error';
import Paper from '../Paper';

function Error({ message, width, height }: { message: string; width: number; height: number }) {
  return (
    <Paper width={width} height={height}>
      <Box mt={5}>
        <Flex justifyContent="center">
          <ErrorSvg width={width * 0.4} height={height * 0.4} />
        </Flex>
        <Heading as="h1" size="md" textAlign="center">
          {message}
        </Heading>
      </Box>
    </Paper>
  );
}

export default Error;
