import logo from './logo.svg';
import './App.css';
import { ForgotPassword, ResetPassword, ChangePassword, ChangedPassword, Home, UserSpace, ProfilePage, TaskPage, Signin, Signup } from './pages';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  HashRouter,
} from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <HashRouter basename='/'>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Signin />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/sendingemail' element={<ResetPassword />} />
        <Route path='/changepassword' element={<ChangePassword />} />
        <Route path='/changesuccess' element={<ChangedPassword />} />
        <Route path='/userspace' element={<UserSpace />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/task/:id' element={<TaskPage />} />
        <Route path='/task/:id/shared' element={<TaskPage />} />
        <Route path='/task/:id/shared/edit' element={<TaskPage />} />
      </HashRouter>
    </Router>

  );
}

export default App;
