import {useEffect, useState, useReducer, useRef} from 'react'
import './App.css'
import useKeyPress from "./hooks/useKeyPressHook";


import Card from "./components/Card";
import {ICard} from "./interface";
const initialState = { selectedIndex: 0 };


function App() {

  const itemsRef = useRef([]);

  const [filteredCardData, setFilteredCardData] = useState<ICard[]>([]);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, filteredCardData.length);
  }, [filteredCardData]);



  const reducer = (state: { selectedIndex: number; }, action: { type: any; payload: any; }) => {
    switch (action.type) {
      case 'arrowUp':
        return {
          selectedIndex:
            state.selectedIndex !== 0 ? state.selectedIndex - 1 : state.selectedIndex,
        };
      case 'arrowDown':
        return {
          selectedIndex:
            state.selectedIndex !== filteredCardData.length - 1 ? state.selectedIndex + 1 : state.selectedIndex,
        };
      case 'select':
        return { selectedIndex: action.payload };
      default:
        throw new Error();
    }
  };
  const [searchStr, setSearchStr] = useState("");
  const [cardData, setCardData] = useState<ICard[]>([]);
  const arrowUpPressed = useKeyPress('ArrowUp');
  const arrowDownPressed = useKeyPress('ArrowDown');
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch("http://www.mocky.io/v2/5ba8efb23100007200c2750c")
      .then((response) => response.json())
      .then((actualData) => setCardData(actualData))
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    if (arrowUpPressed) {
      dispatch({
        type: 'arrowUp',
        payload: undefined
      });
    }
  }, [arrowUpPressed]);

  useEffect(() => {
    if (arrowDownPressed) {
      dispatch({
        type: 'arrowDown',
        payload: undefined
      });
    }
  }, [arrowDownPressed]);

  useEffect(() => {
    filterCardData(cardData, searchStr);
  }, [searchStr, cardData]);

  useEffect(() => {
    // @ts-ignore
    itemsRef.current[state.selectedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [state.selectedIndex]);




  const filterCardData = (data: ICard[], filterStr: string) => {
    setFilteredCardData(data.filter(item => {
      return item.id.toLowerCase().includes(filterStr.toLowerCase())
        || item.address.toLowerCase().includes(filterStr.toLowerCase())
        || item.name.toLowerCase().includes(filterStr.toLowerCase())
      || item.pincode.toLowerCase().includes(filterStr.toLowerCase())
      || item.items.map(itemIter => itemIter.toLowerCase()).find(iter => iter.includes(filterStr.toLowerCase()))

    }));
  }

  return (
    <div className="App">
      <div style={{margin: "auto"}}>
        <div style={{width: "300px"}}>
          <input value={searchStr} onChange={(e) => setSearchStr(e.target.value)} type="text"/>
          {filteredCardData.map((card, i) => {

            return (
              <div
                // @ts-ignore
                ref={el => itemsRef.current[i] = el}
                style={{
                  cursor: 'pointer',
                  backgroundColor: i === state.selectedIndex ? 'yellow' : '',
                }}
                key={card.id} onMouseEnter={() => dispatch({ type: 'select', payload: i })}>
                <Card searchStr={searchStr}  data={card}/>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App
