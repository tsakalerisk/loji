import './Credits.css'
import KostasProfile from './kostas.jpg'

const Credits = () => {
    return <div className="credits-container">
        <div className="credits">
            <img src={KostasProfile} alt=""/>
            <div className="bio-container">
                <h1>Made by Kostas Tsakaleris</h1>
                <div className="bio">
                    I am an Applied Informatics major with a love for software development.
                    <br/>
                    You can find more projects on my GitHub <a href='https://github.com/tsakalerisk'>here</a>.
                </div>
            </div>
        </div>
    </div>
}

export default Credits;