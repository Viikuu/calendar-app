import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { Main } from "./pages/Main/Main";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Main /> } />
        <Route path='/login' element={ <Login /> } />
        <Route path='/register' element={ <Register/> }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
