import './App.css';
import React from 'react';
import Login from './components/login';
import Signup from './components/signup';
import BaseHome from './components/teacher-home';
import CardList from './components/lesson-card-list';
import CreateLesson from './components/add-lesson';
import CreateSubgroup from './components/add-subgroup';
import SubgroupList from './components/subgroup-list';
import TeamList from './components/team-list';
import TeacherTeamView from './components/teacher-team';
import TeacherScoreView from './components/teacher-score';
import StudentHome from './components/student-home';
import StudentTeam from './components/student-team';
import MyScore from './components/my-score';
import RatingCriteria from './components/rating-criteria-modal';
import { Route, Routes, Navigate } from 'react-router-dom';
function App() {
  return (
    <div className='site'>
      <main>
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
          <Route
            exact
            path={'/lesson'}
            element={<BaseHome children={CardList} />}
          />
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
          {/* <Route path={"/"} render={() => <div>Home again</div>}/> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
