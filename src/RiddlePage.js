import './RiddlePage.css'
import { ReactComponent as Chevron } from './chevron.svg';
import App from "./App";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseConfig from './firebaseConfig.json';
import { useEffect, useState, useRef, useMemo } from "react";
import { CSSTransition } from 'react-transition-group'

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


function RiddlePage() {
    const [riddles, setRiddles] = useState(null);
    const [riddleIndex, setRiddleIndex] = useState(0);
    const [answers, setAnswers] = useState(null);
    const [result, setResult] = useState(''); //correct, incorrect, timeout, or ''

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

    function onAnswer(answered) {
        if (answered === riddles[riddleIndex].corr) {
            setResult('correct');
        } else {
            setResult('incorrect');
        }
    }

    function onTimeout() {
        setResult('timeout');
    }

    function onNext() {
        setRiddleIndex((riddleIndex + 1) % riddles.length);
        setResult('');
    }

    return (
        <App>
            {riddles &&
                (<div className='riddle-page'>
                    <Timer
                        minutes={riddles[riddleIndex].time}
                        index={riddleIndex}
                        result={result}
                        onTimeout={onTimeout}
                    />
                    <ProgressBar
                        answers={answers}
                        currectRiddleIndex={riddleIndex}
                    />
                    <Riddle
                        riddle={riddles[riddleIndex]}
                        answersDisabled={result}
                        onAnswer={onAnswer}
                    />
                    <Result
                        result={result}
                        explanation={riddles[riddleIndex].explanation}
                        onNext={onNext}
                    />
                </div>
                )}
        </App>
    );
}

function Riddle({ riddle, answersDisabled, onAnswer }) {
    return (
        <div className="riddle">
            <div className='question'>
                <h1>{riddle.title}</h1>
                <p>{riddle.riddle}</p>
            </div>
            <div className='answers'>
                {riddle.answers.map((answer, index) =>
                    <button key={index}
                        className={riddle.corr === index + 1 ? 'correct' : 'incorrect'}
                        disabled={answersDisabled}
                        onClick={() => { onAnswer(index + 1) }}
                    >
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

function Timer({ minutes, index, result, onTimeout }) {
    const timeRef = useRef(minutes * 60);
    const expired = useRef(false);
    const stopTimer = useRef(null);
    const [time, setTime] = useState(timeRef.current);

    useEffect(() => {
        expired.current = false;
        const timer = setInterval(() => {
            if (timeRef.current > 0) {
                timeRef.current -= 1;
                setTime(timeRef.current);
            } else if (!expired.current) {
                expired.current = true;
                onTimeout();
            }
        }, 1000);
        return stopTimer.current = () => clearTimeout(timer);;
    }, [onTimeout]);

    useEffect(() => {
        timeRef.current = minutes * 60;
        setTime(timeRef.current);
    }, [index, minutes]);

    useEffect(() => {
        if (result) {
            stopTimer.current();
        }
    }, [result]);

    return (
        <div className={'timer ' + (time <= 30 ? time <= 10 ? 'red' : 'yellow' : '')}>
            {
                Math.floor(time / 60) + ':' + (time % 60).toString().padStart(2, '0')
            }
        </div>
    );
}

function Result({ result, explanation, onNext }) {
    const nodeRef = useRef(null);
    const resultRef = useRef(null);
    const explanationRef = useRef(null);

    useMemo(() => {
        if (result) {
            resultRef.current = result;
            explanationRef.current = explanation;
        }
    }, [result, explanation]);

    function calcTitle() {
        switch (resultRef.current) {
            case 'correct': return 'Correct!';
            case 'incorrect': return 'Incorrect!';
            case 'timeout': return 'Time\'s out!';
            default: return '';
        }
    }
    return (
        <CSSTransition nodeRef={nodeRef} in={result !== ''} classNames='result-animation' timeout={250} unmountOnExit>
            <div ref={nodeRef} className={'result ' + resultRef.current}>
                <div>
                    <h1>{calcTitle()}</h1>
                    <p>{explanationRef.current}</p>
                </div>
                <button onClick={onNext}>Next Question<Chevron /></button>
            </div>
        </CSSTransition>
    );
}

export default RiddlePage;