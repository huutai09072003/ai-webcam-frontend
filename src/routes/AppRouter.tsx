import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import BlogLayout from '../components/BlogLayout.tsx';
import CampaignLayout from '../components/CampaignLayout.tsx';
import MainLayout from '../components/MainLayout';
import About from '../pages/ai-demo/about/index.tsx';
import CameraStream from '../pages/ai-demo/camera/index.tsx';
import GamePlayPage from '../pages/ai-demo/game/1/GamePlayPage.tsx';
import Game1 from '../pages/ai-demo/game/1/index.tsx';
import ImageCanvasViewer from '../pages/ai-demo/game/1/test.tsx';
import GameList from '../pages/ai-demo/game/index.tsx';
import AIDemoIndex from '../pages/ai-demo/index.tsx';
import BloggerEdit from '../pages/Blog/Bloggers/edit.tsx';
import BloggerIndex from '../pages/Blog/Bloggers/index.tsx';
import BloggerShow from '../pages/Blog/Bloggers/show.tsx';
import BlogLoginPage from '../pages/Blog/blogLogin.tsx';
import BlogSignupPage from '../pages/Blog/blogRegister.tsx';
import BlogIndexPage from '../pages/Blog/index.tsx';
import BlogNewPage from '../pages/Blog/new.tsx';
import BlogShowPage from '../pages/Blog/show.tsx';
import CampaignNewDonation from '../pages/Campaign/CampaignDonation.tsx';
import Campaigns from '../pages/Campaign/index.tsx';
import NewCampaignPage from '../pages/Campaign/new.tsx';
import CampaignShowPage from '../pages/Campaign/show.tsx';
import Cancel from '../pages/Donation/Cancel.tsx';
import Donate from '../pages/Donation/index.tsx';
import DonationWrapper from '../pages/Donation/new.tsx';
import Success from '../pages/Donation/Success.tsx';
import Global from '../pages/Global/Global.tsx';
// import Game from '../pages/AIDemo/Game';
// import AIDemoIndex from '../pages/AIDemo/Index';
// import Realtime from '../pages/AIDemo/Realtime';
// import Upload from '../pages/AIDemo/Upload';
// import Blogs from '../pages/Blogs';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Recyclopedia from '../pages/Recyclepedia/index.tsx';
// import News from '../pages/News';
// import Profile from '../pages/Profile';
// import Recyclepedia from '../pages/Recyclepedia';
import Register from '../pages/Register';
import Subscribers from '../pages/Subscribers.tsx';

// import Study from '../pages/recyclepedia';
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
          <Route path="global" element={<Global />} />
          <Route path="subscribers" element={<Subscribers />} />
          <Route path="success" element={<Success />} />
          <Route path="donate/new" element={<DonationWrapper />} />
          <Route path="donates" element={<Donate />} />
          <Route path="subscribers" element={<Subscribers />} />
          <Route path="cancel" element={<Cancel/>} />
          
          <Route path="/campaigns" element={<CampaignLayout />}>
            <Route index element={<Campaigns />} />
            <Route path="new" element={<NewCampaignPage />} />
            <Route path=":id" element={<CampaignShowPage />} />
            <Route path=":id/donate" element={<CampaignNewDonation />} />
          </Route>

          <Route path="/blogs" element={<BlogLayout />}>
            <Route path="/blogs/:id" element={<BlogShowPage />} />
            <Route index element={<BlogIndexPage />} />
            <Route path="new" element={<BlogNewPage />} />
            <Route path="login" element={<BlogLoginPage />} />
            <Route path="signup" element={<BlogSignupPage />} />
          </Route>
          <Route path="/bloggers" element={<BloggerIndex />} />
          <Route path="/bloggers/:id" element={<BloggerShow />} />
          <Route path="/bloggers/:id/edit" element={<BloggerEdit />} />
          <Route path="/ai-demo" element={<AIDemoIndex />} />
          <Route path="/ai-demo/games" element={<GameList />} />
          <Route path="/ai-demo/game/1" element={<Game1 />} />
          <Route path="/ai-demo/game/1/:imageId" element={<GamePlayPage />} />
          <Route path="/ai-demo/camera" element={<CameraStream />} />
          <Route path="/test/:imageId" element={<ImageCanvasViewer />} />
          <Route path="/ai-demo/about" element={<About />} />
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
