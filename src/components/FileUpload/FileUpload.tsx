import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface FileUploadProps {
    buttonText?: string
    onChange: (files: FileList | null) => void
}

const FileUpload = ({ onChange, buttonText }: FileUploadProps) => {
    return (
        <Button
            sx={{ textTransform: 'none' }}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
        >
            {buttonText ? buttonText : 'Upload'}
            <VisuallyHiddenInput
                type="file"
                onChange={(event) => onChange(event.target.files)}
                multiple={false}
                accept=".docx"
            />
        </Button>
    );
}

export default FileUpload;