import logo from './logo.svg';
import './App.css';
import Layout from './Components/Layout/Layout';
import { Routes,Route, Router} from 'react-router-dom';
import Home from './Pages/Home/Home';
import DataLogs from './Pages/DataLogs/DataLogs';
import Profile from './Pages/Profile/Profile';
import Action from './Pages/Action/Action';
import { NewDashboard } from './Pages/BAI5/NewDashboard';
function App() {
  return (
    <>
    
      <Routes>
          <Route path="/" element = {<Layout/>}>
            <Route path='home' element={<Home/>}/>
            <Route path='new' element={<NewDashboard/>}/>
            <Route path='datalogs' element={<DataLogs/>}/>
            <Route path='profile' element={<Profile/>}/>
            <Route path='action' element={<Action/>}/>
          </Route>
      </Routes>
    </>
  );
}

export default App;

