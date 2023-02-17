import './App.css';
import { ReactComponent as Arrow } from './arrow.svg';
import { invoke } from '@tauri-apps/api'
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useEffect, useState } from 'react';
import firebaseConfig from './firebaseConfig.json';
import { CSSTransition } from 'react-transition-group';

// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});
const auth = getAuth();

function App(props) {
  const [user, setUser] = useState(null);

  useEffect(() => getAuth().onAuthStateChanged(setUser), []);

  return (
    <div className="App">
      {props.children}
      <LoginButton user={user} />
    </div>
  );
}

function LoginButton(props) {
  const [open, setOpen] = useState(false);

  return (
    <div className='login-area'>
      <button className='login-button' onClick={() => {
        if (!props.user) {
          signInWithPopup(auth, provider).catch((error) => {
            console.log(error);
          });
        } else {
          setOpen(!open);
        }
      }}>
        {props.user && <img src={props.user.photoURL} alt="User's profile" className='profile-picture' />}
        <span className='login-text'>{(props.user && props.user.displayName) || "Log in"}</span>
        {props.user && <Arrow className='arrow'/>}
      </button>
      <CSSTransition in={open} classNames='dropdown-animation' timeout={250} unmountOnExit>
        <DropDown callback={() => setOpen(false)} />
      </CSSTransition>
    </div>
  );
}

function DropDown(props) {
  return (
    <div className='dropdown'>
      <button>Settings</button>
      <button className='signout-button' onClick={() => {
        signOut(getAuth()).then(() =>
          invoke('delete_cookies')
        ).catch(error =>
          console.log(error)
        );
        props.callback();
      }}>
        Sign out
      </button>
    </div>
  );
}

export default App;
