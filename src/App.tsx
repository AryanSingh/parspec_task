import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import SearchBox from "./components/SearchBox";


import Card from "./components/Card";
import {ICard} from "./interface";

function App() {
  const [searchStr, setSearchStr] = useState("");
  const [cardData, setCardData] = useState<ICard[]>([]);
  useEffect(() => {
    fetch("http://www.mocky.io/v2/5ba8efb23100007200c2750c")
      .then((response) => response.json())
      .then((actualData) => setCardData(actualData))
      .catch((err) => {
        console.log(err.message);
      });
    // fetch("http://www.mocky.io/v2/5ba8efb23100007200c2750c").then((data) => console.log("data", data.json()));
  }, []);

  // {
  //   "id": "123-s3-146",
  //   "name": "David Mire",
  //   "items": ["Bedroom Set"],
  //   "address": "2nd Cross, BTI Apartment",
  //   "pincode": "4xx012"
  // },


  const filterCardData = (data: ICard[], filterStr: string) => {
    let filteredData =  data.filter(item => {
      // console.log(item.items.map(itemIter => itemIter.toLowerCase()));
      return item.id.toLowerCase().includes(filterStr.toLowerCase())
        || item.address.toLowerCase().includes(filterStr.toLowerCase())
        || item.name.toLowerCase().includes(filterStr.toLowerCase())
      || item.pincode.toLowerCase().includes(filterStr.toLowerCase())
      || item.items.map(itemIter => itemIter.toLowerCase()).find(iter => iter.includes(filterStr.toLowerCase()))

    });
    return filteredData;
  }

  return (
    <div className="App">
      <div style={{margin: "auto"}}>
        <div style={{width: "300px"}}>
          <input value={searchStr} onChange={(e) => setSearchStr(e.target.value)} type="text"/>
          {filterCardData(cardData, searchStr).map(card => {
            return (
              <Card searchStr={searchStr}  data={card}/>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App
