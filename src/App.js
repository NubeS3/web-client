import Dashboard from './views/pages/Dashboard'
import SignIn from './views/pages/auth/Login/Login'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="wrapper">
      <h1>NubeS3 Cloud Storage</h1>
      <Router>
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route exact path="/sign-in">
            <SignIn />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
