import { Routes, Route } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Login from './Components/Login'
import Home from './Container/Home'
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/*' element={<Home />} />
            </Routes>
        </Router>
    )
}
//FALTA POR INSTALAR REACT-GOOGLE-LOGIN
export default App