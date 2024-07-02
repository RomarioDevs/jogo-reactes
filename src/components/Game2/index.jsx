import React, { useState, useEffect } from 'react';
import styles from './Game1.module.css'; // Importa o arquivo CSS Modules

const Game1 = () => {
  const initialColors = Array.from({ length: 30 }, () => '#ffffff'); // Array de cores vazias
  const [squareColors, setSquareColors] = useState(initialColors);
  const [iterations, setIterations] = useState(25); // Estado para armazenar o número de iterações
  const [running, setRunning] = useState(false); // Estado para controlar se está rodando ou não
  const [currentInterval, setCurrentInterval] = useState(null); // Estado para armazenar o intervalo atual
  const [stopClicked, setStopClicked] = useState(false); // Estado para verificar se o botão de parar foi clicado
  const [allSquaresFilled, setAllSquaresFilled] = useState(false); // Estado para verificar se todos os quadrados estão preenchidos

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color === '#ffffff' ? getRandomColor() : color; // Evita a cor branca
  }

  // Função para verificar se todos os slots estão preenchidos com cores diferentes de branco
  const allFilled = () => {
    return squareColors.every(color => color !== '#ffffff');
  };

  // Função para iniciar a execução com o número de iterações especificado
  const startGame = () => {
    if (iterations > 0) {
      setSquareColors(initialColors); // Define todas as cores como vazias
      setRunning(true);
      setStopClicked(false); // Reinicia o estado de clique do botão de parar
    } else {
      alert('Por favor, insira um número maior que zero para iniciar.');
    }
  };

  // Função para parar a execução
  const stopGame = () => {
    setRunning(false);
    clearInterval(currentInterval); // Limpa o intervalo atual
    setStopClicked(true); // Define que o botão de parar foi clicado
  };

  // Efeito para atualizar as cores a cada segundo, controlado pelas iterações
  useEffect(() => {
    let interval;

    if (running && iterations > 0) {
      interval = setInterval(() => {
        let index = 0;
        const newColors = Array.from({ length: 30 }, () => '#ffffff');

        const timer = setInterval(() => {
          if (index < 30 && !stopClicked) {
            newColors[index] = getRandomColor();
            setSquareColors([...newColors]);
            index++;
          } else {
            clearInterval(timer);

            setTimeout(() => {
              const fadeTimer = setInterval(() => {
                let faded = false;
                const fadedColors = squareColors.map(color => {
                  const fadedColor = fadeColor(color);
                  if (fadedColor !== '#ffffff') {
                    faded = true;
                  }
                  return fadedColor;
                });
                setSquareColors(fadedColors);
                if (!faded) {
                  clearInterval(fadeTimer);
                  setIterations(prevIterations => prevIterations - 1);

                  // Verifica se ainda há iterações restantes
                  if (iterations > 1 && running) {
                    setTimeout(() => {
                      startGame(); // Inicia a próxima rodada se ainda estiver rodando
                    }, 0); // Espera 1 segundo para iniciar a próxima rodada
                  } else {
                    setRunning(false); // Para a execução quando as iterações chegarem a zero ou se foi parado
                  }
                }
              }, 25);
            }, 4000); // Espera 1 segundo após os quadrados se esvaziarem
          }
        }, 25);

        setCurrentInterval(interval);
      }, 4100); // Intervalo de 2 segundos para mudança de cores
    } else {
      setRunning(false);
    }

    return () => {
      clearInterval(interval);
      clearInterval(currentInterval);
    };
  }, [running, iterations, squareColors, currentInterval, stopClicked]);

  // Efeito para verificar se todos os quadrados estão preenchidos
  useEffect(() => {
    setAllSquaresFilled(allFilled());
  }, [squareColors]);

  // Efeito para esvaziar os quadrados após serem preenchidos por 3 segundos, se todos estiverem preenchidos
  useEffect(() => {
    if (allSquaresFilled) {
      const timeout = setTimeout(() => {
        setSquareColors(initialColors);
      }, 5000); // Espera 3 segundos antes de esvaziar os quadrados
      return () => clearTimeout(timeout);
    }
  }, [allSquaresFilled, initialColors]);

  // Efeito para garantir que o valor do input seja atualizado ao final de cada rodada
  useEffect(() => {
    document.getElementById('iterations').value = iterations;
  }, [iterations]);

  // Função para reiniciar
  const resetGame = () => {
    setSquareColors(initialColors); // Define todas as cores como vazias
    setIterations(25); // Reinicia com 25 iterações
    setRunning(false);
    setStopClicked(false); // Reinicia o estado de clique do botão de parar
    clearInterval(currentInterval); // Limpa o intervalo atual
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    const intValue = parseInt(value, 10);
    setIterations(intValue);
  };

  const incrementIterations = () => {
    setIterations(prevIterations => (prevIterations + 5 <= 50 ? prevIterations + 5 : 50));
  };

  const decrementIterations = () => {
    setIterations(prevIterations => (prevIterations - 5 >= 0 ? prevIterations - 5 : 0));
  };

  // Função para suavizar a transição de cor para branco
  const fadeColor = (color) => {
    const hex = parseInt(color.slice(1), 16);
    const r = (hex >> 16) & 255;
    const g = (hex >> 8) & 255;
    const b = hex & 255;
    if (r === 255 && g === 255 && b === 255) {
      return '#ffffff';
    }
    const newR = Math.min(255, r + 5);
    const newG = Math.min(255, g + 5);
    const newB = Math.min(255, b + 5);
    return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')}`;
  };

  const squares = squareColors.map((color, index) => (
    <div key={index} className={styles.square} style={{ backgroundColor: color, border: color === '#ffffff' ? '1px solid #007bff' : 'none' }}></div>
  ));

  return (
    <div className={styles.gameContainer}>
      <div className={styles.controls}>
        <div className={styles.inputWrapper}>
          <button className={styles.inputButtons} onClick={decrementIterations} disabled={running}>-5</button>
          <input
            type="text"
            id="iterations"
            className={styles.inputCircle}
            value={iterations}
            onChange={handleInputChange}
            readOnly
          />
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
