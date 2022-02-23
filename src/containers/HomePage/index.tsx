import { useNavigate } from 'react-router';
import Container from '../../components/Container';
import Input from '../../components/Input';
import Paper from '../../components/Paper';
import { Routes } from '../../common/constants';
import { selectHome, setAddress } from './slice';
import { MdSearch } from 'react-icons/md';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { Text } from '@chakra-ui/react';

function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { address } = useAppSelector(selectHome);
  const search = () => navigate(Routes.PROFILE.replace(':address', address));
  return (
    <>
      <Container>
        <>
          <Text
            bgGradient="linear(to-l, #FFF, #1dc9a2)"
            bgClip="text"
            fontSize="4xl"
            fontWeight="extrabold"
            textAlign="center"
          >
            Welcome to Ether Alley
          </Text>
          <Paper mt={5}>
            <form
              onSubmit={() => {
                if (address) search();
              }}
            >
              <Input
                id="searchbar"
                size="lg"
                variant="filled"
                placeholder="Enter ENS name or Ethereum address..."
                value={address}
                onChange={(event) => dispatch(setAddress(event.target.value))}
                iconProps={{
                  'aria-label': 'go to profile',
                  tooltip: 'Search',
                  Icon: MdSearch,
                  onClick: search,
                  disabled: !address,
                }}
              />
            </form>
          </Paper>
        </>
      </Container>
    </>
  );
}

export default HomePage;
