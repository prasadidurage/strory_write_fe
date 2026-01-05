import {Navigate, Route, Routes} from "react-router-dom";

import {Dashboard} from "../../pages/AdminDashboard/Dashboard.tsx";
import {ManageCategories} from "../../pages/AdminCategoryManage/ManageCategories.tsx";
import {AdminUserManege} from "../../pages/AdminUserMange/AdminUserManege.tsx";

export const AdminContent = () => {
    return (
        <div className="flex-1 overflow-auto">
            <Routes>
                <Route index element={<Navigate to="/admin/main" replace />} />
                <Route path="/main" element={<Dashboard/>}/>
                <Route path="/category" element={<ManageCategories/>}/>
                <Route path="/user" element={<AdminUserManege/>}/>


            </Routes>
        </div>
    );
};



