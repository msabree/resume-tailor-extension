import html2canvas from "html2canvas";
import jsPDF from 'jspdf';

export type File_Type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export const getFileArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result as ArrayBuffer);
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file as ArrayBuffer'));
        };

        reader.readAsArrayBuffer(file);
    });
};

export const serialize = (buffer: ArrayBuffer): string => {
    const uint8Array = new Uint8Array(buffer)
    return btoa(String.fromCharCode.apply(null, [...uint8Array]));
};

export const deserialize = (fileDataString: string): ArrayBuffer => {
    const binaryString = atob(fileDataString);
    const uint8Array = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }

    return uint8Array.buffer;
};

export const downloadAsPdf = (input: HTMLElement | null) => {
    if (input) {
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
                    width: 200,  // Set the content width (optional)
                    windowWidth: 800
                })
            });
    }
}  