
import React from 'react';

function Result({ result }) {
  return (
    <div>
      <h2>당신의 타입은...</h2>
      {result.image && <img src={`/images/${result.image}`} alt={result.name} style={{ maxWidth: '300px', margin: '20px 0' }} />}
      <h3>{result.name}</h3>
      <p>{result.description}</p>
    </div>
  );
}

export default Result;
