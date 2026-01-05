
import AdminSidebar from "../AdminSideBar/AdminSideBar.tsx";


import {AdminContent} from "../MainContent/AdminContent.tsx";


export const AdminDefaultLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">

            <aside className="w-64 bg-black shadow-lg">
                <AdminSidebar/>
            </aside>

            <AdminContent></AdminContent>
        </div>
    );
};