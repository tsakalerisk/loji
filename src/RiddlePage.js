import './RiddlePage.css'
import { ReactComponent as Chevron } from './chevron.svg';
import { ReactComponent as Arrow } from './arrow.svg';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query } from "firebase/firestore";
import firebaseConfig from './firebaseConfig.json';
import { useEffect, useState, useRef, useMemo } from "react";
import { CSSTransition } from 'react-transition-group'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function RiddlePage() {
    const riddlesRef = collection(db, 'riddles');
    const riddleQuery = query(riddlesRef);              //where, limit, ...
    const [riddles] = useCollectionData(riddleQuery);

    const [riddleIndex, setRiddleIndex] = useState(0);
    const [result, setResult] = useState('');           //correct, incorrect, timeout, or ''

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
        <>
            {riddles &&
                <div className='riddle-page'>
                    <Timer
                        minutes={riddles[riddleIndex].time}
                        index={riddleIndex}
                        result={result}
                        onTimeout={onTimeout}
                    />
                    <ProgressBar
                        riddles={riddles}
                        riddleIndex={riddleIndex}
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
            }
        </>
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

function ProgressBar({ riddles, riddleIndex }) {
    return (
        <div className='progress-bar'>
            <progress
                value={riddleIndex}
                max={riddles.length} />
            <div className='nodes'>
                {riddles.map((_riddle, index) =>
                    <span key={index}
                        className={index < riddleIndex ? 'answered' : 'not-answered'}>
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
        <CSSTransition nodeRef={nodeRef} in={result !== ''} classNames='result-animation' timeout={150} unmountOnExit>
            <div ref={nodeRef} className={'result ' + resultRef.current}>
                <div>
                    <h1>{calcTitle()}</h1>
                    <details className={explanationRef.current ? '' : 'hidden'}>
                        <summary>Show explanation <Arrow className='arrow' /></summary>
                        <p>{explanationRef.current}</p>
                    </details>
                </div>
                <button onClick={onNext}>Next Question<Chevron /></button>
            </div>
        </CSSTransition>
    );
}

export default RiddlePage;