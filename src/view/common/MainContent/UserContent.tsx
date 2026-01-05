
import {Route, Routes} from "react-router-dom";

import {Home} from "../../pages/Home/Home.tsx";

import {RulesAndPolicies} from "../../pages/RulesAndPolocies/RulesAndPolicies.tsx";
import {StartWritting} from "../../pages/StartWritting/StartWritting.tsx";
import {CategorizeStories} from "../../pages/CategorizeStories/CategorizeStories.tsx";
import {StoryDetail} from "../../pages/StoryDetail/StoryDetail.tsx";
import {MyWorks} from "../../pages/MyWorks/MyWorks.tsx";








export function UserContent() {
    return (
        <div className="bg-stone-100 p-8 flex items-center justify-center text-center text-3xl min-h-96">
            <Routes>
                <Route path="/" element={<Home />}/>
                {/*<Route path="/seeStories" element={<SeeStories />}/>*/}
                <Route path="/startWriting" element={<StartWritting />}/>
                <Route path="/rules" element={<RulesAndPolicies />}/>
                <Route path="/category/:categoryName" element={<CategorizeStories />} />
                <Route path="/story/:storyId" element={<StoryDetail />} />
                <Route path="/myStories" element={<MyWorks/>} />

<Route >

</Route>

            </Routes>
        </div>
    );
}