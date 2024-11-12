import React from 'react';
import Button from '@mui/material/Button/Button';
import { downloadAsPdf } from '../../utils/files';
import './styles.css'

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
            <Button color='info' variant='outlined' sx={{ fontSize: 14, textTransform: 'none', marginRight: 2 }} onClick={() => {
                generateCoverLetter()
            }}>Regenerate</Button>
            <Button disabled={coverLetterHTML === ''} color='info' variant='outlined' sx={{ fontSize: 14, textTransform: 'none', marginRight: 2 }} onClick={() => {
                downloadAsPdf(document.getElementById("__dynamicCoverLetter"))
            }}>Download as PDF</Button>
            <Button disabled={coverLetterHTML === ''} color='info' variant='outlined' sx={{ fontSize: 14, textTransform: 'none' }} onClick={() => {
                copyToClipboard()
            }}>Copy Text</Button>
            {coverLetterHTML && <div id="__dynamicCoverLetter" className='cover-letter' dangerouslySetInnerHTML={{ __html: coverLetterHTML }} />}
            {errorMessage && <div className='info'>{errorMessage}</div>}
        </div>
    );
}

export default CoverLetterGenerator;
