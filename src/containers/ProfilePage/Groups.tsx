import { Box, Center, Grid, GridItem, Heading, Skeleton } from '@chakra-ui/react';
import { BADGE_HEIGHT, BADGE_WIDTH } from '../../common/constants';
import { BadgeTypes, DisplayItem } from '../../common/types';
import ErrorBoundary from '../../components/ErrorBoundary';
import Paper from '../../components/Paper';
import useAppSelector from '../../hooks/useAppSelector';
import FungibleTokenComponent from './FungibleToken';
import NonFungibleTokenComponent from './NonFungibleToken';
import { selectDisplayConfig, selectLoading } from './slice';
import Statistic from './Statistic';

function Groups() {
  const { groups } = useAppSelector(selectDisplayConfig);

  return (
    <>
      {groups.length > 0 &&
        groups.map(({ text, items }, i) => {
          return (
            <Box mt={20} key={i}>
              <Group text={text} items={items} />
            </Box>
          );
        })}
    </>
  );
}

function Group({ text, items }: { text: string; items: DisplayItem[] }) {
  return (
    <>
      <GroupTitle text={text} />
      {items.length > 0 && (
        <Grid
          templateColumns={[`repeat(1, 100%)`, `repeat(2, ${BADGE_WIDTH}px)`, `repeat(3, ${BADGE_WIDTH}px)`]}
          justifyContent="space-between"
          gap={20}
        >
          {items.map(({ type, id }) => {
            return (
              <GridItem key={id}>
                <Center>
                  <ErrorBoundary message="Something went wrong" width={BADGE_WIDTH} height={BADGE_HEIGHT}>
                    <GroupItem type={type} id={id} />
                  </ErrorBoundary>
                </Center>
              </GridItem>
            );
          })}
        </Grid>
      )}
    </>
  );
}

function GroupTitle({ text }: { text: string }) {
  return (
    <Heading as="h3" size="lg" mb={10} isTruncated textAlign="center">
      {text}
    </Heading>
  );
}

function GroupItem({ type, id }: { type: BadgeTypes | undefined; id: number }) {
  const loading = useAppSelector(selectLoading);

  if (loading) {
    return (
      <Paper width={BADGE_WIDTH} height={BADGE_HEIGHT}>
        <Skeleton width={BADGE_WIDTH} height={BADGE_HEIGHT} />
      </Paper>
    );
  }

  switch (type) {
    case BadgeTypes.NonFungibleToken:
      return <NonFungibleTokenComponent id={id} />;
    case BadgeTypes.FungibleToken:
      return <FungibleTokenComponent id={id} />;
    case BadgeTypes.Statistics:
      return <Statistic id={id} />;
    default:
      return <></>;
  }
}

export default Groups;
