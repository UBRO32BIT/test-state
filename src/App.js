import logo from './logo.svg';
import './App.css';
import { Text } from "./Text";
import { useState } from "react"
import React from 'react';
import Axios from "axios";
import { Client } from "@stomp/stompjs";
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const client = new Client({
  brokerURL: "ws://localhost:8082/ws",
  debug: console.log,
});

function App() {
  const [value, setValue] = useState(0);
  const increaseValue = () => {
    setValue(value + 1);
  }
  const decreaseValue = () => {
    setValue(value - 1);
  }
  const setValueToZero = () => {
    setValue(0);
  }
  const [showText, setShowText] = useState(false);
  const [catFact, setCatFact] = useState("");
  const fetchCatFact = () => {
    Axios.get("https://catfact.ninja/fact").then((res) => {
      setCatFact(res.data.fact);
    })
  }

  const [message, setMessage] = React.useState();
  var stompClient;

  React.useEffect(() => {
    const socket = new SockJS("http://localhost:8082/ws")
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function(frame) {
      console.log(frame);
      stompClient.subscribe('/user/10/queue/messages', function(result) {
        console.log(JSON.parse(result.body));
        setMessage(result.body);
      })
    })
  }, []);

  return (
    <>
      <div style={{display: 'flex', justifyContent: 'center', paddingTop: '5vh'}}>
        <button onClick={increaseValue}>Increase</button>
        <button onClick={decreaseValue}>Decrease</button>
        <button onClick={setValueToZero}>Set To Zero</button>
        {value}
      </div>
      <div style={{display: 'flex', justifyContent: 'center', paddingTop: '5vh'}}>
        <button
        onClick={() => {
          setShowText(!showText);
        }}
        >
          Show Text
        </button>
      </div>
      {showText && <Text/>}
      <div style={{display: 'flex', justifyContent: 'center', paddingTop: '5vh'}}>
        <button onClick={fetchCatFact}>Generate Cat Fact</button>
      </div>
      <div style={{textAlign: 'center'}}>
        {catFact}
      </div>
      <div style={{display: 'flex', justifyContent: 'center', paddingTop: '5vh'}}>
          <h1>Tao</h1>
          <h2>test websocket</h2>        
      </div>
      <div>{message}</div>
    </>
  );
}

export default App;
