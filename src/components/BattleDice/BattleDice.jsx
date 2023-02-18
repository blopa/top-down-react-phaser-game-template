import { useMemo, useState } from 'react';
import { DiceWithAnimation } from 'cyber-dice';

// Store
import { useGameStore } from '../../zustand/store';

// Selectors
import { selectGameZoom } from '../../zustand/game/selectGameData';

function BattleDice() {
    const gameZoom = useGameStore(selectGameZoom);

    const [shouldAnimateDice, setShouldAnimateDice] = useState(true);
    const [randomNumber, setRandomNumber] = useState(Math.floor(Math.random() * 6) + 1);
    const diceSize = useMemo(() => 80 * gameZoom, [gameZoom]);

    const animationEndHandler = () => {
        setShouldAnimateDice(false);
        console.log(randomNumber);
    };

    return (
        <DiceWithAnimation
            key={diceSize}
            size={diceSize}
            randomNumber={randomNumber}
            isAnimation={shouldAnimateDice}
            animationEndHandler={animationEndHandler}
        />
    );
}

export default BattleDice;
