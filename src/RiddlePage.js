import './RiddlePage.css'
import App from "./App";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseConfig from './firebaseConfig.json';
import { useEffect, useState, useRef } from "react";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


function RiddlePage() {
    const [riddles, setRiddles] = useState(null);
    const [riddleIndex, setRiddleIndex] = useState(0);
    const [answers, setAnswers] = useState(null);

    useEffect(() => {
        const getRiddles = async () => {
            const data = await getDocs(collection(db, "riddles"));
            const results = data.docs.map(doc => doc.data());
            setRiddles(results);
            setAnswers(Array(results.length).fill('not answered'));
            console.log('Queried database');
        };
        getRiddles();
    }, []);
    return (
        <App>
            {riddles &&
                (<div className='riddle-page'>
                    <Timer minutes={riddles[riddleIndex].time} index={riddleIndex}/>
                    <ProgressBar
                        answers={answers}
                        currectRiddleIndex={riddleIndex}
                    />
                    <Riddle riddle={riddles[riddleIndex]}
                        onCorrect={() => setRiddleIndex((riddleIndex + 1) % riddles.length)}
                    />
                </div>
                )}
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

function ProgressBar(props) {
    return (
        <div className='progress-bar'>
            <progress
                value={props.currectRiddleIndex}
                max={props.answers.length} />
            <div className='nodes'>
                {props.answers.map((_answer, index) =>
                    <span key={index}
                        className={index < props.currectRiddleIndex ? 'answered' : 'not-answered'}>
                        {index + 1}
                    </span>
                ).filter((_element, index) => !((index) % 4))}
            </div>
        </div>
    );
}

function Timer({minutes, index}) {
    const timeRef = useRef(minutes * 60);
    const [time, setTime] = useState(minutes * 60);

    useEffect(() => {
        const timer = setInterval(() => {
            if (timeRef.current > 0) {
                timeRef.current -= 1;
                setTime(timeRef.current);
            } else {

            }
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        timeRef.current = minutes * 60;
        setTime(timeRef.current);
    }, [index, minutes]);

    return (
        <div className={'timer ' + (time <= 30 ? time <= 10 ? 'red' : 'yellow' : '')}>
            {
                Math.floor(time / 60) + ':' + (time % 60).toString().padStart(2, '0')
            }
        </div>
    );
}

export default RiddlePage;