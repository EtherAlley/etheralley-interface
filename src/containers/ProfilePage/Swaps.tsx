import {
  Heading,
  Box,
  Badge as ChakraBadge,
  Flex,
  UnorderedList,
  OrderedList,
  ListItem,
  Text,
  Image,
} from '@chakra-ui/react';
import Badge from '../../components/Badge';
import { Contract, Swap } from '../../common/types';
import Settings from '../../common/settings';
import useInterfaceKey from '../../hooks/useInterfaceKey';
import useEtherscanUrl from '../../hooks/useEtherscanUrl';
import { BADGE_HEIGHT, BADGE_WIDTH } from '../../common/constants';
import useAppSelector from '../../hooks/useAppSelector';
import { selectStatistic } from './slice';
import LinkComponent from '../../components/Link';

const logoStyling = {
  width: 100,
  height: 100,
  padding: 2,
  backgroundColor: 'profile.primary',
  borderColor: 'profile.primary',
  borderRadius: '50%',
  boxShadow: 'dark-lg',
  borderWidth: '1px',
};

function SwapComponent({ index }: { index: number }) {
  const { data, contract } = useAppSelector((state) => selectStatistic(state, index));
  const key = useInterfaceKey(contract.interface);
  const swaps = data as Swap[];

  return (
    <Badge
      width={BADGE_WIDTH}
      height={BADGE_HEIGHT}
      Display={
        <Box maxWidth="100%" maxHeight="100%">
          <Flex justifyContent="center" mb={5}>
            <Image alt={key} src={`${Settings.PUBLIC_URL}/interfaces/${key.toLowerCase()}.svg`} {...logoStyling} />
          </Flex>
          <ChakraBadge borderRadius={8} py={1} px={2} mt={3}>
            <Heading as="h3" size="md" noOfLines={2}>
              {swaps.length} SWAPS
            </Heading>
          </ChakraBadge>
        </Box>
      }
      DialogHeader={'Top Swaps'}
      DialogBody={<SwapBody swaps={swaps} contract={contract} />}
    />
  );
}

function SwapBody({ swaps, contract }: { swaps: Swap[]; contract: Contract }) {
  return (
    <OrderedList>
      {swaps.map((swap, i) => (
        <Box key={i}>
          <SwapItem swap={swap} contract={contract} />
        </Box>
      ))}
    </OrderedList>
  );
}

function SwapItem({
  swap: { id, timestamp, amountUSD, input, output },
  contract: { blockchain },
}: {
  swap: Swap;
  contract: Contract;
}) {
  const etherscanUrl = useEtherscanUrl(blockchain, 'tx', id);
  return (
    <ListItem>
      <UnorderedList>
        <ListItem key={0}>
          <LinkComponent url={etherscanUrl} text="Etherscan" />
        </ListItem>
        <ListItem key={1}>
          <Text>{timestamp}</Text>
        </ListItem>
        <ListItem key={2}>
          <Text>Amount: {amountUSD} USD</Text>
        </ListItem>
        <ListItem key={3}>
          <Text>
            Input: {input.amount} {input.symbol}
          </Text>
        </ListItem>
        <ListItem key={4}>
          <Text>
            Output: {output.amount} {output.symbol}
          </Text>
        </ListItem>
      </UnorderedList>
    </ListItem>
  );
}

export default SwapComponent;

// alternative styling

// const BadgeDisplay1 = () => (
//   <Box
//     width={200}
//     height={240}
//     backdropFilter="opacity(0.8)"
//     overflow="hidden"
//     display="flex"
//     alignItems="center"
//     justifyContent="center"
//     flexDirection="column"
//   >
//     <Box>
//       <Image alt={symbol} src={tokenLogo} height="100px" width="100px" />
//       <Image
//         alt={symbol}
//         src={tokenLogo}
//         position="absolute"
//         top={75}
//         left={75}
//         backgroundSize="250%"
//         filter="blur(60px)"
//         display="block"
//         opacity={0.6}
//       />
//     </Box>
//     <Box mt={5}>
//       <Heading as="h3" size="md" noOfLines={2}>
//         {displayBalance + ' ' + symbol}
//       </Heading>
//     </Box>
//   </Box>
// );
