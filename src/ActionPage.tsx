import React, { useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import FileUpload from './components/FileUpload/FileUpload';
import { getFileArrayBuffer, serialize } from './utils/files';
import { SAVE_RESUME_ACTION } from './constants';
import { deleteResume, getResume } from './utils/messaging';
import Logo from './icons/Logo'

import './ActionPage.css'

// this is the "action page". opened from the browser toolbar
const ActionPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [htmlResume, setHTMLResume] = useState<string>('')

  const saveResume = (arrayBuffer: ArrayBuffer, fileType: string) => {
    return new Promise((resolve) => {
      (window as any).chrome.runtime.sendMessage({
        action: SAVE_RESUME_ACTION,
        data: {
          fileData: serialize(arrayBuffer),
          fileType
        }
      },
      (response: any) => {
        resolve(response)
      });
    })
  }

  useEffect(() => {
    getResume().then((resume: string) => {
      setHTMLResume(resume)
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <Logo width={64} height={64} fill={'#ffffff'} />
        Resume Tailor
      </header>
      <div className='intro'>
        This extension uses Google Gemini AI to automatically 
        adjust your resume to match the requirements of any job 
        description. To get started, simply upload your resume in 
        .docx format. As you browse job listings, your resume will 
        be updated in real-time to align with each position, and a 
        personalized cover letter will be created for you.
      </div>
      {isLoading && <CircularProgress />}
      {htmlResume && <Button sx={{marginRight: 2, textTransform: 'none'}} variant="outlined" onClick={() => {
        setIsLoading(true)
        deleteResume().then(() => {
          setIsLoading(false)
          setHTMLResume('')
        }
      )}}>DELETE RESUME</Button>}
      <FileUpload buttonText={htmlResume ? 'Upload New Resume' : 'Upload Resume'} onChange={async (files) => {
        if (files) {
          setIsLoading(true)
          const fileType = files[0].type ?? 'unknown';
          const arrayBuffer = await getFileArrayBuffer(files[0]);
          saveResume(arrayBuffer, fileType).then(() => {
            getResume().then((resume: string) => {
              setHTMLResume(resume)
              setIsLoading(false)
            })
          })
        }
      }} />

      {htmlResume && <div className='resume-tailor-info' dangerouslySetInnerHTML={{__html: htmlResume}} />}
      <div className='footer'>
        <a href="https://www.flaticon.com/free-icons/tailor" title="tailor icons">Tailor icons created by monkik - Flaticon</a>
      </div>
    </div>
  );
}

export default ActionPage;
