import './RiddlePage.css'
import App from "./App";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseConfig from './firebaseConfig.json';
import { useEffect, useState } from "react";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


function RiddlePage() {
    const [riddles, setRiddles] = useState(null);
    const [riddleIndex, setRiddleIndex] = useState(0);
    useEffect(() => {
        const getRiddles = async () => {
            const data = await getDocs(collection(db, "riddles"));
            setRiddles(data.docs.map(doc => doc.data()));
            console.log('Queried database');
        };
        getRiddles();
        console.log('database call');
    }, []);
    return (
        <App mode='round'>
            {riddles &&
                <Riddle riddle={riddles[riddleIndex]}
                    onCorrect={() => setRiddleIndex((riddleIndex + 1) % riddles.length)} />}
        </App>
    );
}

function Riddle(props) {
    return (
        <div className="riddle">
            <div className='question'>
                <h1>{props.riddle.title}</h1>
                <p>{props.riddle.riddle}</p>
            </div>
            <div className='answers'>
                {props.riddle.answers.map((answer, index) =>
                    <button key={index}
                        className={props.riddle.corr === index + 1 ? 'correct' : 'incorrect'}
                        onClick={() => {
                            if (props.riddle.corr === index + 1)
                                props.onCorrect()
                        }}>
                        {answer}
                    </button>
                )}
            </div>
        </div>
    );
}

export default RiddlePage;