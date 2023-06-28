
import './App.css';
import {
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import {CricketersList} from './components/cricketrs-list/CricketersList'
function App() {
  return (
    <div className='App'>
 
   
      <Routes>
      <Route path="/*" element={<Navigate replace to="/List" />} />
      <Route path="/List" element={<CricketersList />} />
      </Routes>

    </div>

  );
}

export default App;
