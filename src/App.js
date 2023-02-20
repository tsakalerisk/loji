import './App.css';
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig.json';
import LoginButton from "./LoginButton";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import NotFound from './404';
import RiddlePage from './RiddlePage';
import HomePage from './HomePage';

initializeApp(firebaseConfig);

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/riddle",
    element: <RiddlePage />,
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
