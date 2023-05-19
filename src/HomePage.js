import logo from './loji_logo.svg';

function HomePage() {
    return (
        <>
            <Header />
            <Menu>
                <MenuButton href='/level-select'>Start</MenuButton>
                <MenuButton disabled>
                    Daily Challenge 
                    <sup style={{color: "#622"}}>Coming soon!</sup>
                </MenuButton>
                <MenuButton href='/credits'>Credits</MenuButton>
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

function MenuButton({children, href, disabled}) {
    return (
        <button onClick={() => document.location.href = href} disabled={disabled}>{children}</button>
    );
}

export default HomePage;