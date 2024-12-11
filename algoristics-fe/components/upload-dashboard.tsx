"use client";

import React, { useState } from "react";

import useLocalStorageState from 'use-local-storage-state'

import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";

const StepBar = ({ active, title, description, onSelect }) => {
  const colorActive = active ? '#6A64F1' : '#6b7280';
  return (<div
    className={`relative z-10 grid w-10 h-10 font-bold text-white transition-all duration-300 rounded-full place-items-center cursor-pointer hover:opacity-90 hover:ring`}
    onClick={() => onSelect()}
    style={{'backgroundColor': colorActive}}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
      aria-hidden="true" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z">
      </path>
    </svg>
    <div className="absolute -bottom-[4.5rem] w-max text-center">
      <h6
        className={`block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal`}
        style={{'color': colorActive}}>
        {title}
      </h6>
      <p className={`block font-sans text-base antialiased font-normal leading-relaxed`}
      style={{'color': colorActive}}>
        {description}
      </p>
    </div>
  </div>)
}

export default function UploadDashboard({ endpoint }) {
  const [step, setStep] = useLocalStorageState('step', 1)
  const [resultData, setResultData] = useLocalStorageState('fileData', {});

  return (
    <>
    <section className="relative mt-24 mx-auto max-w-6xl px-4 sm:px-6 m-auto">
      <div className="w-full px-24 py-4">
  <div className="relative flex items-center justify-between w-full">
    <div className="absolute left-0 top-2/4 h-0.5 w-full -translate-y-2/4 bg-gray-300"></div>
    <div className="absolute left-0 top-2/4 h-0.5 w-full -translate-y-2/4 bg-gray-500 transition-all duration-500">
    </div>
    <StepBar active={step === 1} title="Step 1" description="Upload document." onSelect={() => {
      setResultData({})
      setStep(1)
      }} />
    <StepBar active={step === 2} title="Step 2" description="AI processing." onSelect={() => setStep(2)} />
    <StepBar active={step === 3} title="Step 3" description="Finish." onSelect={() => setStep(3)} />
  </div>
</div>
      
{step === 1 && <Step1 endpoint={endpoint} onChangeStep={(step, data) => {
  setStep(step)
  if (data) {
    setResultData(data)
  }
  }}/>}
      {step === 3 && <Step3 data={resultData} endpoint={endpoint} />}
    </section>

    {step === 2 && <Step2 />}
    </>
  );
}
