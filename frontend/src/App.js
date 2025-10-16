import React, { useState } from 'react';
import Question from './components/Question';
import Result from './components/Result';
import './App.css';

import questions from './questions.json';

// 💡 백엔드 서버의 절대 URL을 상수로 정의
const BACKEND_URL = 'http://54.180.90.210:32000'

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
      fetch(`${BACKEND_URL}/result`, { // 💡 수정된 부분: 절대 경로 사용
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newScores, gender }),
      })
      .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setResultData(data);
        setShowResult(true);
      })
      .catch(error => {
        console.error('Error fetching result:', error);
        // 에러 발생 시 사용자에게 에러 메시지를 보여줄 수 있습니다.
        alert('결과를 불러오는 중 오류가 발생했습니다. 서버 상태를 확인해주세요.');
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
          questions[currentQuestion] && ( // currentQuestion이 questions.length에 도달하면 렌더링하지 않도록 추가
            <Question
              question={questions[currentQuestion]}
              onAnswer={handleAnswer}
            />
          )
        )}
      </header>
    </div>
  );
}

export default App;