'use client'
import Image from "next/image";
import React from "react";
import Compresor from "./Compresor";
import Condensador from "./Condensador";
import Evaporador from "./Evaporador";
import Expansion from "./Expansion";
import { useEffect } from "react";



export default function Home() {

  const [power, setPower] = React.useState(false)
  const [workTemp, setWorkTemp] = React.useState(7)
  const [lowPressure, setLowPressure] = React.useState(2)
  const [solenoidOpen, setSolenoidOpen] = React.useState(false)


  const powerOnOf = () => {
    setPower(!power)
  }

  useEffect(() => {
    if (power === true && workTemp >= 8) {
      setSolenoidOpen(true)
      activate()
    } else if (power === false || workTemp <= 3) {
      setSolenoidOpen(false)
      deactivate()
    }
  })

  function activate() {
    let elements = document.querySelectorAll('.apagado');
    elements.forEach(element => {
      element.classList.add('active');
    });

    let divInterno = document.querySelector('.llenado');
    let porcentaje = 40; // Cambiar por el porcentaje deseado
    divInterno.style.height = porcentaje + '%';

  }

  function deactivate() {
    let elements = document.querySelectorAll('.apagado');
    elements.forEach(element => {
      element.classList.remove('active');
    });
    
    let divInterno = document.querySelector('.llenado');
    let porcentaje = 80; // change to the percentage you want at off state
    divInterno.style.height = porcentaje + '%';
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setWorkTemp(prev => {

        if (!solenoidOpen && prev < 24) {
          return prev + 1;
        }
        if (solenoidOpen) {
          return prev - 1;
        }
        return prev;
      });
    }, 10000);
    // Limpiar el intervalo si el efecto se vuelve a ejecutar o el componente se desmonta
    return () => clearInterval(intervalId);
  }, [solenoidOpen]);

  console.log(`power is ${power}`)
  console.log(`solenoid is ${solenoidOpen}`)
  console.log(`temp is ${workTemp}`)




  return (
    <>
      <header>
        <h1>Simulador de circuitos frigoríficos</h1>
      </header>
      <main>

        <div className="gas">R134A</div>

        <Compresor />
        <Condensador />
        <Evaporador />
        <Expansion open={solenoidOpen} />


        <div className="recalentamiento apagado"></div>

        <div className="termostato">
          <p className="T">Temperatura de la cámara: <span >{workTemp}</span>ºC</p>
        </div>

        <div className="TempEvaporacion oculto">
          <label for="tempEvaporacion">T. evaporación: </label>
          <input type="number" id="tempEvaporacion" min="-10" max="5" step="0.1" value="-5" oninput="calculateLowPressure()"></input>
        </div>

        <div className="tempExterior">
          <input type="range" id="myRangeExt" min="-15" max="45" step="1" value="22" oninput="showTExt(); showTCondensacion(); calculateHiPressure()" ></input>
          <label className="TExt">Temperatura Exterior: <span id="tExt">22</span>ºC</label>
        </div>

        <div className="tempCondensacion">
          <p>T. condensación: <span id="tCondensacion">37</span>ºC</p>
        </div>

        <div className="hp">
          <p>HP <span id="HiPressure">9.40</span>bar</p>
        </div>

        <div className="lp">
          <p>LP <span id="LowPressure">0</span>bar</p>
        </div>



        <div className="toggleWrapper">
          <input className="dn" id="dn" type="checkbox" onChange={powerOnOf} />
          <label className="toggle" for="dn"><span className="toggle__handler"></span></label>
        </div>



      </main>
    </>
  );
}
