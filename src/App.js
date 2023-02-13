import logo from './loji_logo.svg';
import './App.css';
// import { invoke } from '@tauri-apps/api'


function App() {
  // invoke('greet', { name: 'World' })
  // // `invoke` returns a Promise
  // .then((response) => console.log(response));
  return (
    <div className="App">
      <Header/>
      <Menu>

      </Menu>
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

function Menu() {
  return (
    <div className='Menu'>
      <button>Start</button>
      <button>Daily Challenge</button>
      <button>Credits</button>
    </div>
  );
}

export default App;
