import React from 'react';
import Button from '@mui/material/Button/Button';
import { downloadAsPdf } from '../../utils/files';
import { CircularProgress } from '@mui/material';
import Bot from '../../icons/Bot';
import '../../index.css';

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
            <Button disabled={isLoading} color='info' variant='outlined' sx={{ fontSize: 14, textTransform: 'none', marginRight: 2 }} onClick={() => {
                generateCoverLetter()
            }}>{coverLetterHTML === '' ? 'Generate' : 'Regenerate'}</Button>
            <Button disabled={coverLetterHTML === '' || isLoading} color='info' variant='outlined' sx={{ fontSize: 14, textTransform: 'none', marginRight: 2 }} onClick={() => {
                downloadAsPdf(document.getElementById("__dynamicCoverLetter"))
            }}>Download as PDF</Button>
            <Button disabled={coverLetterHTML === '' || isLoading} color='info' variant='outlined' sx={{ fontSize: 14, textTransform: 'none' }} onClick={() => {
                copyToClipboard()
            }}>Copy Text</Button>
            {coverLetterHTML && !isLoading && <div id="__dynamicCoverLetter" className='resume-tailor-cover-letter' dangerouslySetInnerHTML={{ __html: coverLetterHTML }} />}
            {!coverLetterHTML && errorMessage && (
                <div className='resume-tailor-engine-error'>
                    <div>
                        <Bot width={100} height={100} />
                    </div>
                    <div><span style={{ fontWeight: 'bold' }}>Error: </span>The AI Engine is currently overloaded.</div>
                    <div>Try refreshing the page or you can try again later.</div>
                </div>
            )}
            {isLoading && (
                <div className='resume-tailor-loader'>
                    <CircularProgress sx={{ marginRight: 3 }} />
                    Generating a customized cover letter... Please wait.
                </div>
            )}
        </div>
    );
}

export default CoverLetterGenerator;
