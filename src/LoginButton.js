import './App.css';
import { ReactComponent as Arrow } from './arrow.svg';
import { invoke } from '@tauri-apps/api'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useAuthState } from 'react-firebase-hooks/auth';

function LoginButton() {
    const auth = getAuth();
    const [user] = useAuthState(auth);
    const [open, setOpen] = useState(false);
    const nodeRef = useRef();
  
    const signInWithGoogle = () => {
      const provider = new GoogleAuthProvider().setCustomParameters({
        prompt: 'select_account'
      });
      signInWithPopup(auth, provider).catch((error) => {
        console.log(error);
      });
    }
  
    return (
      <div className={'login-area ' + (open ? 'open' : '')}>
        <button className='login-button' onClick={() => {
          if (!user) {
            signInWithGoogle();
          } else {
            setOpen(!open);
          }
        }}>
          {user && <img src={user.photoURL} alt="" className='profile-picture' />}
          <span className='login-text'>{(user && user.displayName) || "Log in"}</span>
          {user && <Arrow className='arrow' />}
        </button>
        <CSSTransition nodeRef={nodeRef} in={open} classNames='dropdown-animation' timeout={1000} unmountOnExit>
          <DropDown innerRef={nodeRef} callback={() => setOpen(false)} />
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

  export default LoginButton;