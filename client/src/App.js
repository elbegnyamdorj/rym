// import './App.css';
import React from 'react';
import Login from './comp/login';
import Signup from './comp/signup';
import BaseHome from './comp/teacher-home';
import CardList from './comp/lesson-card-list';
import CreateLesson from './comp/add-lesson';
import CreateSubgroup from './comp/add-subgroup';
import SubgroupList from './comp/subgroup-list';
import TeamList from './comp/team-list';
import TeacherTeamView from './comp/teacher-team';
import TeacherScoreView from './comp/teacher-score';
import StudentHome from './comp/student-home';
import StudentTeam from './comp/student-team';
import MyScore from './comp/my-score';
import Subgroup from './comp/Subgroup';
import RatingCriteria from './comp/rating-criteria-modal';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
// @mui material components

import { useState, useEffect, useMemo } from 'react';

// @mui material components
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Icon from '@mui/material/Icon';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';

// Material Dashboard 2 React example components
import Sidenav from 'examples/Sidenav';
import Configurator from 'examples/Configurator';

// Material Dashboard 2 React themes
import theme from 'assets/theme';
import themeRTL from 'assets/theme/theme-rtl';

// Material Dashboard 2 React Dark Mode themes
import themeDark from 'assets/theme-dark';
import themeDarkRTL from 'assets/theme-dark/theme-rtl';

// RTL plugins
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// Material Dashboard 2 React routes
import routes from 'routes';

// Material Dashboard 2 React contexts
import {
  useMaterialUIController,
  setMiniSidenav,
  setOpenConfigurator,
} from 'context';

// Images
import brandWhite from 'assets/images/logo-ct.png';
import brandDark from 'assets/images/logo-ct-dark.png';
import Lesson from 'comp/Lesson';

function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: 'rtl',
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute('dir', direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={route.component}
            key={route.key}
          />
        );
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display='flex'
      justifyContent='center'
      alignItems='center'
      width='3.25rem'
      height='3.25rem'
      bgColor='white'
      shadow='sm'
      borderRadius='50%'
      position='fixed'
      right='2rem'
      bottom='2rem'
      zIndex={99}
      color='dark'
      sx={{ cursor: 'pointer' }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize='small' color='inherit'>
        settings
      </Icon>
    </MDBox>
  );
  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <div>
        {layout === 'dashboard' && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={
                (transparentSidenav && !darkMode) || whiteSidenav
                  ? brandDark
                  : brandWhite
              }
              brandName='Rate Your Mate'
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === 'vr' && <Configurator />}
        <Routes>
          <Route
            path='/'
            element={
              localStorage.getItem('access_token') ? (
                localStorage.getItem('user_type_id') === '1' ? (
                  <Navigate to='/lesson' />
                ) : (
                  <Navigate to='/home' />
                )
              ) : (
                <Navigate to='/login' />
              )
            }
          />
          <Route exact path={'/login'} element={<Login />} />
          <Route exact path={'/signup'} element={<Signup />} />
          <Route exact path={'/myscore'} element={<MyScore />} />
          <Route exact path={'/lesson'} element={<BaseHome />} />
          <Route exact path={'/lesson/:id'} element={<Lesson />} />
          <Route exact path={'/lesson/:id/:sg'} element={<Subgroup />} />
          <Route exact path={'/rating-criteria'} element={<RatingCriteria />} />
          <Route exact path={'/lesson/create'} element={<CreateLesson />} />
          <Route
            exact
            path={'/lesson/subgroups/create'}
            element={<CreateSubgroup />}
          />
          <Route exact path={'/lesson/subgroups'} element={<SubgroupList />} />
          <Route
            exact
            path={'/lesson/subgroups/create-team'}
            element={<TeamList />}
          />
          <Route
            exact
            path={'/lesson/subgroups/teams'}
            element={<TeacherTeamView />}
          />
          <Route
            exact
            path={'/lesson/subgroups/teams/score'}
            element={<TeacherScoreView />}
          />

          <Route exact path={'/home'} element={<StudentHome />} />
          <Route
            exact
            path={'/lesson/subgroups/myteams'}
            element={<StudentTeam />}
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
