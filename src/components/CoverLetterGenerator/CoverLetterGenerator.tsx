import React from 'react';
import Button from '@mui/material/Button/Button';
import { downloadAsPdf } from '../../utils/files';
import './styles.css'
import { CircularProgress } from '@mui/material';

interface CoverLetterGeneratorProps {
    coverLetterHTML?: string
    errorMessage?: string
    generateCoverLetter: () => void
    isLoading: boolean
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

const CoverLetterGenerator = ({ coverLetterHTML, errorMessage, generateCoverLetter, isLoading }: CoverLetterGeneratorProps) => {
    return (
        <div>
            {isLoading && <CircularProgress />}
            <Button color='info' variant='outlined' sx={{ fontSize: 14, textTransform: 'none', marginRight: 2 }} onClick={() => {
                generateCoverLetter()
            }}>{coverLetterHTML === '' ? 'Generate' : 'Regenerate'}</Button>
            <Button disabled={coverLetterHTML === ''} color='info' variant='outlined' sx={{ fontSize: 14, textTransform: 'none', marginRight: 2 }} onClick={() => {
                downloadAsPdf(document.getElementById("__dynamicCoverLetter"))
            }}>Download as PDF</Button>
            <Button disabled={coverLetterHTML === ''} color='info' variant='outlined' sx={{ fontSize: 14, textTransform: 'none' }} onClick={() => {
                copyToClipboard()
            }}>Copy Text</Button>
            {coverLetterHTML && <div id="__dynamicCoverLetter" className='cover-letter' dangerouslySetInnerHTML={{ __html: coverLetterHTML }} />}
            {errorMessage && <div className='error'>{errorMessage}</div>}
        </div>
    );
}

export default CoverLetterGenerator;
