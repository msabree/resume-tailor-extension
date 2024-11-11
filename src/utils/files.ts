export type File_Type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' | 'application/msword'

export const getFileArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result as ArrayBuffer); // Resolve the promise with the ArrayBuffer
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file as ArrayBuffer'));
        };

        reader.readAsArrayBuffer(file); // Reads the file as an ArrayBuffer
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