import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {UserDefaultLayout} from "./view/common/DefaultLayout/UserDefaultLayout.tsx";
import {Login} from "./view/pages/Login/Login.tsx";
import {Register} from "./view/pages/Register/Register.tsx";
import {AdminDefaultLayout} from "./view/common/DefaultLayout/AdminDefaultLayout.tsx";




function App() {


    return(
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<UserDefaultLayout />}></Route>
                <Route path="/admin/*" element={<AdminDefaultLayout />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>
            </Routes>
        </BrowserRouter>
    );
}
export default App;

