import logo from './loji_logo.svg';
import './App.css';
import { invoke } from '@tauri-apps/api'
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useState } from 'react';
import firebaseConfig from './firebaseConfig.json';
import { CSSTransition } from 'react-transition-group';


// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});
const auth = getAuth();

function App() {
  const [user, setUser] = useState(null);

  getAuth().onAuthStateChanged(user => {
    setUser(user)
  });

  return (
    <div className="App">
      <Header />
      <Menu>
        <button>Start</button>
        <button>Daily Challenge</button>
        <button>Credits</button>
      </Menu>
      <LoginButton user={user} />
    </div>
  );
}

function Header() {
  return (
    <header className="App-header">
      <img src={logo} alt='loji logo' className='App-logo' />
      <h1>Loji</h1>
    </header>
  );
}

function Menu(props) {
  return (
    <div className='Menu'>
      {props.children}
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
      </button>
      <CSSTransition in={open} classNames='dropdown-animation' timeout={250} unmountOnExit>
        <DropDown callback={() => setOpen(false)}/>
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
