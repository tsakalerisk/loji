import './LevelSelectPage.css'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy } from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore'
import firebaseConfig from './firebaseConfig.json';
import { useNavigate, createSearchParams } from 'react-router-dom';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function LevelSelectPage() {
    const levelsRef = collection(db, 'levels');
    const levelQuery = query(levelsRef, orderBy('index'));              //where, limit, ...
    const [levels] = useCollectionData(levelQuery);

    return (
        <div className="level-select">
            <h1>Select a level</h1>
            <div className="level-container">
                {levels && levels.map((level, index) => {
                    return <LevelButton
                        key={index}
                        level={index + 1}
                        className="level"
                        disabled={!level.available}
                    >
                        <h3 className='level-title'>{level.title || "Level " + level.index}</h3>
                        <p>Some simple riddles to test your deductive reasoning</p>
                        {level.available && <ProgressBar percent={0} />}
                    </LevelButton>
                })}
            </div>
        </div>
    );
}

function LevelButton({ children, className, disabled, level }) {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate({
            pathname: "/riddle",
            search: createSearchParams({ level }).toString()
        })} className={className} disabled={disabled}>
            {children}
        </button>
    );
}

function ProgressBar({ percent }) {
    return (
        <div className='level-progress-bar' style={{ width: percent + '%' }}></div>
    );
}

export default LevelSelectPage;