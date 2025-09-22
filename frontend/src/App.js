import React, { useState } from 'react';
import Question from './components/Question';
import Result from './components/Result';
import './App.css';

import questions from './questions.json';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ T: 0, E: 0 });
  const [gender, setGender] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null); // To store result from backend

  const handleAnswer = (type, value) => {
    if (type === 'gender') {
      setGender(value);
      setCurrentQuestion(currentQuestion + 1);
      return;
    }

    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Last question answered, call API
      fetch('/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newScores, gender }),
      })
      .then(response => response.json())
      .then(data => {
        setResultData(data);
        setShowResult(true);
      })
      .catch(error => {
        console.error('Error fetching result:', error);
        // Handle error, maybe show a default result or an error message
      });
    }
  };

  const restart = () => {
    setCurrentQuestion(0);
    setScores({ T: 0, E: 0 });
    setGender(null);
    setShowResult(false);
    setResultData(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>테토/에겐 심리 테스트</h1>
        {showResult ? (
          <>
            {resultData ? <Result result={resultData} gender={gender} /> : <p>결과를 불러오는 중입니다...</p>}
            <button onClick={restart}>다시하기</button>
          </>
        ) : (
          <Question
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
          />
        )}
      </header>
    </div>
  );
}

export default App;