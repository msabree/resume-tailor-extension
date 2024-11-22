import React from 'react';
import { CircularProgress } from '@mui/material';
import Bot from '../../icons/Bot';
import Markdown from 'react-markdown'
import '../../index.css';

interface SummaryProps {
    summary?: string
    errorMessage?: string
    isLoading: boolean
}


const Summary = ({ summary, errorMessage, isLoading }: SummaryProps) => {
    return (
        <div>
            {errorMessage && !isLoading && (
                <div className='resume-tailor-engine-error'>
                    <div>
                        <Bot width={100} height={100} />
                    </div>
                    <div><span style={{ fontWeight: 'bold' }}>Error: </span>{errorMessage}.</div>
                </div>
            )}
            {isLoading && !errorMessage && (
                <div className='resume-tailor-loader'>
                    <CircularProgress sx={{ marginRight: 3 }} />
                    Summarizing jon posting... Please wait.
                </div>
            )}
            {summary && !isLoading && !errorMessage && (
                <Markdown>{summary}</Markdown>
            )}
        </div>
    );
}

export default Summary;
