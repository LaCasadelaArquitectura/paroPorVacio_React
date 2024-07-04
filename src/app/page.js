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
  const [compresor, setCompresor] = React.useState(false)
  const [workTemp, setWorkTemp] = React.useState(7)
  const [lowPressure, setLowPressure] = React.useState(0.40)
  const [highPressure, setHighPressure] = React.useState(6.46)
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

  useEffect(() => {
    if (solenoidOpen === true && lowPressure > 2.2) {
      setCompresor(true)
    } else if (solenoidOpen === false && lowPressure < 0.4) {
      setCompresor(false)
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

  //work temperature set
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

  // low pressure set

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLowPressure(prev => {

        if (!solenoidOpen && prev > 0.40) {
          return prev - 0.2;
        }
        if (solenoidOpen && prev < 2.40) {
          return prev + 0.2;
        }
        return prev;
      });
    }, 1000);
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

       {compresor ? <div class="led-green"></div> : <div class="led-red"></div>}
        
        

        <div className="recalentamiento apagado"></div>

        <div className="termostato">
          <p className="T">Temperatura de la cámara: <span >{workTemp}</span>ºC</p>
        </div>

        <div className="tempExterior">
          <label className="TExt">Temperatura Exterior: <span id="tExt">24</span>ºC</label>
        </div>

  
        <div className="hp">
          <p>HP <span id="HiPressure">{highPressure}</span>bar</p>
        </div>

        <div className="lp">
          <p>LP <span id="LowPressure">{lowPressure.toFixed(2)}</span>bar</p>
        </div>



        <div className="toggleWrapper">
          <input className="dn" id="dn" type="checkbox" onChange={powerOnOf} />
          <label className="toggle" for="dn"><span className="toggle__handler"></span></label>
        </div>



      </main>
    </>
  );
}
