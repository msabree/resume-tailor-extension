import React from 'react';
import Button from '@mui/material/Button/Button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


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

const downloadAsPdf = () => {
    const input = document.getElementById("__dynamicCoverLetter")
    if(input){
        html2canvas(input)
          .then((canvas) => {
            console.log(canvas)
            const pdf = new jsPDF();
              pdf.html(input, {
                callback(doc) {
                    doc.output("dataurlnewwindow")
                },
                x: 10,  // Optional x-position
                y: 10,  // Optional y-position
                width: 180,  // Set the content width (optional)
                windowWidth: 800
              })        
          });
        }
}   

const CoverLetterGenerator = ({ coverLetterHTML, errorMessage, generateCoverLetter }: CoverLetterGeneratorProps) => {
    return (
        <div>
            <Button color='info' variant='contained' sx={{ fontSize: 14, textTransform: 'none', marginRight: 2 }} onClick={() => {
                generateCoverLetter()
            }}>Generate</Button>
            <Button color='info' variant='outlined' sx={{ fontSize: 14, textTransform: 'none', marginRight: 2 }} onClick={() => {
                downloadAsPdf()
            }}>Download as PDF</Button>
            <Button color='info' variant='text' sx={{ fontSize: 14, textTransform: 'none' }} onClick={() => {
                copyToClipboard()
            }}>Copy Text</Button>
            {coverLetterHTML && <div id="__dynamicCoverLetter" className='info' dangerouslySetInnerHTML={{ __html: coverLetterHTML }} />}
            {errorMessage && <div className='info'>{errorMessage}</div>}
        </div>
    );
}

export default CoverLetterGenerator;
