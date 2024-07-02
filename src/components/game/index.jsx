import React, { useState, useEffect } from 'react';
import styles from './Game1.module.css'; // Importa o arquivo CSS Modules

const Game1 = () => {
  const [squareColors, setSquareColors] = useState(Array.from({ length: 30 }, () => getRandomColor()));
  const [iterations, setIterations] = useState(25); // Estado para armazenar o número de iterações
  const [running, setRunning] = useState(false); // Estado para controlar se está rodando ou não

  // Função para obter uma cor aleatória
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Função para iniciar a execução com o número de iterações especificado
  const startGame = () => {
    if (iterations > 0) {
      setRunning(true);
    } else {
      alert('Por favor, insira um número maior que zero para iniciar.');
    }
  };

  // Efeito para atualizar as cores a cada segundo, controlado pelas iterações
  useEffect(() => {
    let interval;

    if (running && iterations > 0) {
      interval = setInterval(() => {
        setSquareColors(prevColors => 
          prevColors.map(() => getRandomColor())
        );
        setIterations(prevIterations => prevIterations - 1);
      }, 3000);
    } else {
      setRunning(false); // Para a execução quando as iterações chegarem a zero
    }

    return () => clearInterval(interval);
  }, [running, iterations]); // Dependências: `running` e `iterations`

  // Função para reiniciar
  const resetGame = () => {
    setSquareColors(Array.from({ length: 30 }, () => getRandomColor()));
    setIterations();
    setRunning(false);
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    const intValue = parseInt(value, 10);
    setIterations(intValue);
  };

  const incrementIterations = () => {
    setIterations(prevIterations => prevIterations + 5);
  };

  const decrementIterations = () => {
    if (iterations > 0) {
      setIterations(prevIterations => prevIterations - 5);
    }
  };

  const squares = squareColors.map((color, index) => (
    <div key={index} className={styles.square} style={{ backgroundColor: color }}></div>
  ));

  return (
    <div className={styles.gameContainer}>
      <div className={styles.controls}>
        <div className={styles.inputWrapper}>
          <button className={styles.inputButtons} onClick={decrementIterations} disabled={running}>-5</button>
          <div className={styles.rodas}>
            <p>Rodadas</p>
            <input
              type="text"
              id="iterations"
              className={styles.inputCircle}
              value={iterations}
              onChange={handleInputChange}
              readOnly
            />
          </div>
          <button className={styles.inputButtons} onClick={incrementIterations} disabled={running}>+5</button>
        </div>
        <button className={styles.button2} onClick={startGame} disabled={running}>Iniciar</button>
        <button className={styles.button2} onClick={stopGame} disabled={!running}>Parar</button>
        <button className={styles.button2} onClick={resetGame} disabled={running}>Reiniciar</button>
      </div>
      <div className={styles.grid}>
        {squares}
      </div>
    </div>
  );
}

export default Game1;
