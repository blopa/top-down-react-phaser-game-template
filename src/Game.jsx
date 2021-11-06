import './Game.css';
import { useDispatch, useSelector } from "react-redux";
import { simpleAction } from "./redux/actions/simpleAction";

function Game() {
  const number = useSelector((state) => {
      return state.simple.number;
  });
  const dispatch = useDispatch();

  return (
    <div className="App">
        {number}
      <button
          type="button"
          onClick={() => {
              return dispatch(simpleAction());
          }}
      >
        Click!
      </button>
    </div>
  );
}

export default Game;
