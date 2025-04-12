import { useState, useEffect } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

interface AnimatedDiceProps {
  className?: string;
}

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export function AnimatedDice({ className }: AnimatedDiceProps) {
  const [currentDice, setCurrentDice] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDice((prev) => (prev + 1) % diceIcons.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const DiceIcon = diceIcons[currentDice];
  return <DiceIcon className={className} />;
}