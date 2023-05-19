import './App.css';
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig.json';
import LoginButton from "./LoginButton";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from './HomePage';
import NotFound from './404';
import RiddlePage from './RiddlePage';
import LevelSelectPage from './LevelSelectPage';
import Credits from './Credits';

initializeApp(firebaseConfig);

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/level-select",
    element: <LevelSelectPage />
  },
  {
    path: "/riddle",
    element: <RiddlePage />,
  },
  {
    path: "/credits",
    element: <Credits />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <LoginButton />
    </div>
  );
}

export default App;
