import React from 'react';
import Button from '@mui/material/Button/Button';

interface InterviewPrepProps {
    data?: string
    errorMessage?: string
    regenerate: () => void
}

const InterviewPrep = ({ data, errorMessage, regenerate }: InterviewPrepProps) => {
  return (
    <div>
      <Button color='info' variant='contained' sx={{ fontSize: 14 }} onClick={() => {
        regenerate()
      }}>Summarize</Button>
      {data && <div className='info' dangerouslySetInnerHTML={{__html: data}} />}
      {errorMessage && <div className='info'>{errorMessage}</div>}
    </div>
  );
}

export default InterviewPrep;
