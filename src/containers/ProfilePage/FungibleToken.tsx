import { Image, Text, Heading, Box, Badge as ChakraBadge, Flex, Link, Icon } from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';
import { Blockchains } from '../../common/constants';
import Badge from '../../components/Badge';
import useDisplayBalance from '../../hooks/useDisplayBalance';
import useTokenKey from '../../hooks/useTokenKey';
import { FungibleToken } from '../../api/types';
import Settings from '../../common/settings';

function getEtherscanUrl(address: string, blockchain: Blockchains): string {
  switch (blockchain) {
    case Blockchains.ETHEREUM:
    default:
      return `${Settings.ETHERSCAN_ETHEREUM_URL}/address/${address}`;
    case Blockchains.ARBITRUM:
      return `${Settings.ETHERSCAN_ARBITRUM_URL}/address/${address}`;
    case Blockchains.OPTIMISM:
      return `${Settings.ETHERSCAN_OPTIMISM_URL}/address/${address}`;
    case Blockchains.POLYGON:
      return `${Settings.ETHERSCAN_POLYGON_URL}/address/${address}`;
  }
}

const coinStyling = {
  width: 75,
  height: 75,
  backgroundColor: 'gray.900',
  borderColor: 'gray.900',
  borderRadius: '50%',
  boxShadow: 'dark-lg',
  borderWidth: '1px',
};

function FungibleTokenComponent({
  metadata: { name, symbol, decimals },
  contract: { address, blockchain, interface: interfaceName },
  balance,
}: FungibleToken) {
  const displayBalance = useDisplayBalance(balance, decimals);
  const key = useTokenKey(address, blockchain);

  return (
    <Badge
      Display={
        <Box height={240}>
          <Flex justifyContent="center" mt={5} mb={5}>
            {!key ? (
              <Box {...coinStyling} pt={6}>
                <Heading as="h3" size="md">
                  {symbol}
                </Heading>
              </Box>
            ) : (
              <Image alt={symbol} src={`${Settings.PUBLIC_URL}/logos/${key.toLowerCase()}.png`} {...coinStyling} />
            )}
          </Flex>
          <ChakraBadge borderRadius={8} py={1} px={2} mt={3}>
            <Heading as="h3" size="md" noOfLines={2}>
              {displayBalance + ' ' + symbol}
            </Heading>
          </ChakraBadge>
        </Box>
      }
      DialogHeader={name}
      DialogBody={
        <>
          <Image alt={symbol} src={`${Settings.PUBLIC_URL}/logos/${key.toLowerCase()}.png`} {...coinStyling} />
          <Link color="blue.500" href={getEtherscanUrl(address, blockchain)} isExternal>
            Etherscan <Icon as={RiExternalLinkLine}></Icon>
          </Link>
          <Text fontSize="md" noOfLines={3} mt={3}>
            Name: {name}
          </Text>
          <Text fontSize="md" noOfLines={3} mt={3}>
            Symbol: {symbol}
          </Text>
          <Text fontSize="md" noOfLines={3} mt={3}>
            Address: {address}
          </Text>
          <Text fontSize="md" noOfLines={3} mt={3}>
            Blockchain: {blockchain}
          </Text>
          <Text fontSize="md" noOfLines={3} mt={3}>
            Interface: {interfaceName}
          </Text>
        </>
      }
    />
  );
}

export default FungibleTokenComponent;
