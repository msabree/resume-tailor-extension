import React from 'react';
import './ActionPage.css'

// this is the "action page". opened from the browser toolbar
const ActionPage = () => {
  return (
    <div className="App">
      <header className="App-header">
        Welcome to Clever Apply
      </header>
      <div className='summary'>
        This extension uses Google Gemini AI to tailor your resume to match a job description.
      </div>
    </div>
  );
}

export default ActionPage;
