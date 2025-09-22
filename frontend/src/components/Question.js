
import React from 'react';

function Question({ question, onAnswer }) {
  return (
    <div>
      <h2>{question.text}</h2>
      {question.options.map((option) => (
        <button key={option.text} onClick={() => onAnswer(option.type, option.value)}>
          {option.text}
        </button>
      ))}
    </div>
  );
}

export default Question;
