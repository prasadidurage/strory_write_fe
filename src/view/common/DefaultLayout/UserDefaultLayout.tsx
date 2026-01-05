import {Navbar} from "../Navbar/Navbar.tsx";
import {UserContent} from "../MainContent/UserContent.tsx";
import {Footer} from "../Footer/Footer.tsx";

export function UserDefaultLayout() {
    return (
        <>
            <Navbar/>
            <UserContent/>
            <Footer/>
        </>
    );
}