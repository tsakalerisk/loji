import logo from './loji_logo.svg';

function HomePage() {
    return (
        <>
            <Header />
            <Menu>
                <MenuButton href='/riddle'>Start</MenuButton>
                <MenuButton>Daily Challenge</MenuButton>
                <MenuButton>Credits</MenuButton>
            </Menu>
        </>
    );
}

function Header() {
    return (
        <header className="App-header">
            <img src={logo} alt='loji logo' className='App-logo' />
            <h1 className='title'>Loji</h1>
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

function MenuButton(props) {
    return (
        <button onClick={() => document.location.href = props.href}>{props.children}</button>
    );
}

export default HomePage;