import { Route, Routes } from 'react-router';
import HomePage from '../HomePage';
import ProfilePage from '../ProfilePage';
import TopProfilesPage from '../TopProfilesPage';
import ShopPage from '../ShopPage';
import { Routes as RouteStrings } from '../../common/constants';
import NavBar from './NavBar';
import useToasts from './useToasts';
import PageWrapper from '../../components/PageWrapper';
import NotFound from '../../components/NotFound';
import AboutPage from '../AboutPage';

function App() {
  useToasts();

  return (
    <>
      <NavBar />
      <Routes>
        <Route path={RouteStrings.PROFILE} element={<ProfilePage />} />
        <Route
          path={RouteStrings.TRENDING}
          element={
            <PageWrapper>
              <TopProfilesPage />
            </PageWrapper>
          }
        />
        <Route
          path={RouteStrings.SHOP}
          element={
            <PageWrapper>
              <ShopPage />
            </PageWrapper>
          }
        />
        <Route
          path={RouteStrings.ABOUT}
          element={
            <PageWrapper>
              <AboutPage />
            </PageWrapper>
          }
        />
        <Route
          path={RouteStrings.HOME}
          element={
            <PageWrapper>
              <HomePage />
            </PageWrapper>
          }
        />
        <Route
          path="*"
          element={
            <PageWrapper>
              <NotFound />
            </PageWrapper>
          }
        />
      </Routes>
    </>
  );
}

export default App;
