'use client';
import { useState, useEffect, useRef } from 'react';

export default function Board({ account, setGameMessage, setGameCompleted, setGameData }) {
  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [preGameCountdown, setPreGameCountdown] = useState(3);
  const [isDisabled, setIsDisabled] = useState(true);

  const PARTICIPATION_PRICE = parseFloat(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE);
  const preGameIntervalRef = useRef(null);
  const solveIntervalRef = useRef(null);

  useEffect(() => {
    generateProblem();

    // Cuenta atrás inicial de 3 segundos
    preGameIntervalRef.current = setInterval(() => {
      setPreGameCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(preGameIntervalRef.current);
          startSolveTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(preGameIntervalRef.current);
      clearInterval(solveIntervalRef.current);
    };
  }, []);

  const generateProblem = () => {
    const num1 = Math.floor(Math.random() * 50) + 10;
    const num2 = Math.floor(Math.random() * 20) + 5;
    const operation = ['+', '-', '*'][Math.floor(Math.random() * 3)];
    let result;

    if (operation === '+') result = num1 + num2;
    if (operation === '-') result = num1 - num2;
    if (operation === '*') result = num1 * num2;

    setProblem({ num1, num2, operation, result });
    setUserAnswer('');
    setElapsedTime(0);
    setGameCompleted(false);
    setGameData(null);
  };

  const startSolveTimer = () => {
    setIsDisabled(false);
    const startTime = Date.now();

    solveIntervalRef.current = setInterval(() => {
      const timePassed = Date.now() - startTime;
      setElapsedTime(timePassed);

      if (timePassed >= 10000) {
        clearInterval(solveIntervalRef.current);
        setGameMessage("⏳ Time exceeded! No mining reward.");
        finalizeGame(false, 0);
      }
    }, 100);
  };

  const checkAnswer = () => {
    if (!problem || isDisabled) return;

    clearInterval(solveIntervalRef.current);

    const totalTime = elapsedTime;
    const correct = parseInt(userAnswer, 10) === problem.result;
    let miningAmount = 0;

    if (correct) {
      if (totalTime <= 5000) {
        // Recompensa positiva proporcional
        miningAmount = PARTICIPATION_PRICE * ((5000 - totalTime) / 5000);
      } else {
        // Penalización negativa de hasta el 10% del valor del token
        const overTime = Math.min(totalTime - 5000, 5000); // máximo 5s de penalización
        const penaltyRatio = overTime / 5000;
        miningAmount = -PARTICIPATION_PRICE * 0.10 * penaltyRatio;
      }
    
      const displayAmount =
      Math.abs(miningAmount) < 0.00000001
        ? '< 0.00000001'
        : miningAmount.toFixed(8);
    
    const message =
      miningAmount >= 0
        ? `✅ Correct! Mined: ${displayAmount} ETH (⏱ ${totalTime} ms)`
        : `✅ Correct... but slow! Penalty: ${displayAmount} ETH (⏱ ${totalTime} ms)`;
    
    
      setGameMessage(message);
    } else {
      setGameMessage("❌ Incorrect! No mining reward.");
    }
    

    finalizeGame(correct, miningAmount);
  };

  const finalizeGame = (isCorrect, miningAmount) => {
    setIsDisabled(true);
    setGameCompleted(true);

    setGameData({
      wallet: account,
      problem: `${problem.num1} ${problem.operation} ${problem.num2}`,
      user_answer: userAnswer,
      is_correct: isCorrect,
      time_ms: elapsedTime,
      mining_reward: miningAmount,
    });
  };

  return (
    <div className="text-center mt-4">
      {problem && (
        <div>
          <p className="text-xl">
            {problem.num1} {problem.operation} {problem.num2} = ?
          </p>
          <p className="text-sm text-gray-400">
            Time elapsed: <span className="text-yellow-300">{preGameCountdown > 0 ? 0 : elapsedTime} ms</span>
          </p>

          {preGameCountdown > 0 && (
            <p className="text-gray-500 mt-2">Wait {preGameCountdown} seconds to start...</p>
          )}

          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="border border-gray-300 p-2 rounded mt-2 text-black"
            disabled={isDisabled}
          />

          <button
            onClick={checkAnswer}
            className={`px-4 py-2 mt-2 ml-2 rounded ${
              isDisabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-black text-white'
            }`}
            disabled={isDisabled}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
