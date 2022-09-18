import './App.css';
import Register from './pages/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login';
import Home from './pages/Home';
import SetAvatar from './components/SetAvatar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="setAvatar" element={<SetAvatar />} />
        </Route>
      </Routes> 
    </BrowserRouter>
  );
}

export default App;
