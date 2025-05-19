import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import MainLayout from '../components/MainLayout';
// import Game from '../pages/AIDemo/Game';
// import AIDemoIndex from '../pages/AIDemo/Index';
// import Realtime from '../pages/AIDemo/Realtime';
// import Upload from '../pages/AIDemo/Upload';
// import Blogs from '../pages/Blogs';
import Home from '../pages/Home';
import Login from '../pages/Login';
// import News from '../pages/News';
// import Profile from '../pages/Profile';
// import Recyclepedia from '../pages/Recyclepedia';
import Register from '../pages/Register';
import Recyclopedia from '../pages/Recyclepedia/index.tsx';

// import Study from '../pages/Study';
// import AIModel from '../pages/Tech/AIModel';
// import Dataset from '../pages/Tech/Dataset';
// import EdgeAI from '../pages/Tech/EdgeAI';
// import TechIndex from '../pages/Tech/Index';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="recyclepedia" element={<Recyclopedia />} />
          {/* <Route path="study" element={<Study />} />
          <Route path="news" element={<News />} />
          <Route path="blogs" element={<Blogs />} /> */}

          {/* Tech */}
          {/* <Route path="tech" element={<TechIndex />} />
          <Route path="tech/ai-model" element={<AIModel />} />
          <Route path="tech/edge-ai" element={<EdgeAI />} />
          <Route path="tech/dataset" element={<Dataset />} /> */}

          {/* AI Demo */}
          {/* <Route path="ai-demo" element={<AIDemoIndex />} />
          <Route path="ai-demo/realtime" element={<Realtime />} />
          <Route path="ai-demo/upload" element={<Upload />} />
          <Route path="ai-demo/game" element={<Game />} /> */}

          {/* Auth / User */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          {/* <Route path="profile" element={<Profile />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
