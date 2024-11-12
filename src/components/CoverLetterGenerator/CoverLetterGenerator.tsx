import React from 'react';
import Button from '@mui/material/Button/Button';

interface CoverLetterGeneratorProps {
    coverLetterHTML?: string
    errorMessage?: string
    generateCoverLetter: () => void
}

const copyToClipboard = () => {
    const innerText = document.getElementById("__dynamicCoverLetter")?.innerText;
    navigator.clipboard.writeText(innerText ?? '')
        .then(() => {
            console.log('Text successfully copied to clipboard');
        })
        .catch(err => {
            console.error('Failed to copy text to clipboard: ', err);
        });
}

const CoverLetterGenerator = ({ coverLetterHTML, errorMessage, generateCoverLetter }: CoverLetterGeneratorProps) => {
    return (
        <div>
            <Button color='info' variant='contained' sx={{ fontSize: 14 }} onClick={() => {
                generateCoverLetter()
            }}>Generate Cover Letter</Button>
            <Button color='info' variant='contained' sx={{ fontSize: 14 }} onClick={() => {
                generateCoverLetter()
            }}>Download As DOCX</Button>
            <Button color='info' variant='text' sx={{ fontSize: 14 }} onClick={() => {
                copyToClipboard()
            }}>Copy Text</Button>
            {coverLetterHTML && <div id="__dynamicCoverLetter" className='info' dangerouslySetInnerHTML={{ __html: coverLetterHTML }} />}
            {errorMessage && <div className='info'>{errorMessage}</div>}
        </div>
    );
}

export default CoverLetterGenerator;
