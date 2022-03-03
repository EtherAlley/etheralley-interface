import { Route, Routes } from 'react-router';
import Home from '../HomePage';
import Profile from '../ProfilePage';
import { Routes as RouteStrings } from '../../common/constants';
import NavBar from './NavBar';
import useToasts from './useToasts';

function App() {
  useToasts();

  return (
    <>
      <NavBar />
      <Routes>
        <Route path={RouteStrings.PROFILE} element={<Profile />} />
        <Route path={RouteStrings.HOME} element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
