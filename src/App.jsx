import './App.css'
import ChartCandle from './chart/Chart'
import { getCandles } from './services/DataService'
import { useEffect, useState } from 'react'
import Candle from './services/Candle'
import useWebSocket from 'react-use-websocket'

function App() {
  const [data, setData] = useState([]);
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1m');
  useEffect(() => {
    getCandles(symbol, interval)
      .then(data => setData(data))
      .catch(err => alert(err.response ? err.response.data : err.message));
  }, [symbol, interval])

  const {lastJsonMessage} = useWebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval.toLowerCase()}`, {
    onOpen: () => console.log('Connect to Binance'),
    onError: (err) => console.error(err),
    shouldReconnect: () => true,
    reconnectInterval: 3000,
    onMessage:() =>{
      if(lastJsonMessage){
        const newCandle = new Candle(lastJsonMessage.k.t, lastJsonMessage.k.o, lastJsonMessage.k.h, lastJsonMessage.k.l, lastJsonMessage.k.c)
        const newData = [...data];

        if(lastJsonMessage.k.x === false){
          newData[newData.length - 1] = newCandle;
        }else {
          newData.slice(0,1);
          newData.push(newCandle)
        }
        setData(newData);
      }
    }

  });

  function onSymbolChange(event){
    setSymbol(event.target.value)
  }

  function onIntervalChange(event){
    setInterval(event.target.value)
  }

  return (
    <>
      <div>
        <select onChange={onSymbolChange}>
          <option value="BTCUSDT">BTCUSDT</option>
          <option value="ETHUSDT">ETHUSDT</option>
          <option value="ADAUSDT">ADAUSDT</option>
        </select>
        <select onChange={onIntervalChange}>
          <option value="1m">1m</option>
          <option value="1d">1d</option>
          <option value="1w">1w</option>
        </select>
        <ChartCandle 
          data={data}
        />
      </div>
    </>
  )
}

export default App
