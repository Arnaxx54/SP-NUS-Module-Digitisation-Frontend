import './App.css';
import NavigationBar from './components/NavigationBar.jsx';
import ActivityFive from './pages/Activities/ActivityFive.jsx';
import ActivityFour from './pages/Activities/ActivityFour.jsx';
import ActivityOne from './pages/Activities/ActivityOne.jsx';
import ActivitySix from './pages/Activities/ActivitySix.jsx';
import ActivityThree from './pages/Activities/ActivityThree.jsx';
import ActivityTwo from './pages/Activities/ActivityTwo.jsx';
import Home from './pages/Home/Home.jsx';
import {HashRouter as Router, Route, Routes, Navigate } from 'react-router';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home/>} />
        <Route path='/activityone' exact element={<ActivityOne/>} />
        <Route path='/activityone/:id' exact element={<ActivityOne/>} />
        <Route path='/activitytwo' exact element={<ActivityTwo/>} />
        <Route path='/activitytwo/:id' exact element={<ActivityTwo/>} />
        <Route path='/activitythree' exact element={<ActivityThree/>} />
        <Route path='/activitythree/:id' exact element={<ActivityThree/>} />
        <Route path='/activityfour' exact element={<ActivityFour/>} />
        <Route path='/activityfour/:id' exact element={<ActivityFour/>} />
        <Route path='/activityfive' exact element={<ActivityFive/>} />
        <Route path='/activityfive/:id' exact element={<ActivityFive/>} />
        <Route path='/activitysix' exact element={<ActivitySix/>} />
        <Route path='/activitysix/:id' exact element={<ActivitySix/>} />
      </Routes>
    </Router>
  );
}

export default App;
