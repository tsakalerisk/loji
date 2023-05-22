import './Credits.css'
import KostasProfile from './kostas.jpg'

const Credits = () => {
    return <div className="credits-container">
        <div className='credits'>
            <h1 style={{textAlign: 'center'}}>
                Riddles created by
                    Lazaros Koemtzopoulos,
                    Evangelos Tzotzis,
                    and Alexandros Spitalas
            </h1>
        </div>
        <div className="credits">
            <img src={KostasProfile} alt=""/>
            <div className="bio-container">
                <h1>Developed by Kostas Tsakaleris</h1>
                <div className="bio">
                    <p>
                        I am an Applied Informatics major 
                        with a focus on software development.
                    </p>
                    <p>
                        I mostly work with C, C++, and Java on the back-end,
                        and vanilla Javascript and React on the front-end.
                    </p>
                    <p>
                        You can find more projects on my GitHub <a href='https://github.com/tsakalerisk'>here</a>.
                    </p>
                </div>
            </div>
        </div>
    </div>
}

export default Credits;