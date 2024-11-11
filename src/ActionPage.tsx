import React, { useEffect, useState } from 'react';
import FileUpload from './components/FileUpload/FileUpload';
import { getFileArrayBuffer, serialize } from './utils/files';
import { SAVE_RESUME_ACTION } from './constants';
import { getResume } from './utils/messaging';
import './ActionPage.css'

// this is the "action page". opened from the browser toolbar
const ActionPage = () => {

  const [htmlResume, setHTMLResume] = useState<string>('')

  const saveResume = (arrayBuffer: ArrayBuffer, fileType: string) => {
    (window as any).chrome.runtime.sendMessage({
      action: SAVE_RESUME_ACTION,
      data: {
        fileData: serialize(arrayBuffer),
        fileType
      }
    },
    (response: any) => {
      console.log('Response from background:', response);
    });
  }

  useEffect(() => {
    getResume().then((resume: string) => {
      setHTMLResume(resume)
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        Welcome to Clever Apply
      </header>
      <div className='summary'>
        This extension uses Google Gemini AI to tailor your resume to match a job description.
      </div>
      <FileUpload onChange={async (files) => {
        if (files) {
          console.log(files)
          const fileType = files[0].type ?? 'unknown';
          const arrayBuffer = await getFileArrayBuffer(files[0]);

          console.log(arrayBuffer, fileType)

          saveResume(arrayBuffer, fileType)
        }
      }} />
      {htmlResume && <div className='info' dangerouslySetInnerHTML={{__html: htmlResume}} />}
    </div>
  );
}

export default ActionPage;
