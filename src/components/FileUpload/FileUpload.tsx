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
    onChange: (files: FileList|null) => void
}

const FileUpload = ({onChange}: FileUploadProps) => {
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
    >
      Upload Resume
      <VisuallyHiddenInput
        type="file"
        onChange={(event) => onChange(event.target.files)}
        multiple={false}
        accept=".txt, .doc, .docx"
      />
    </Button>
  );
}

export default FileUpload;