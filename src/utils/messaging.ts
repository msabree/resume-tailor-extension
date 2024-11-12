import mammoth from 'mammoth';
import { DELETE_RESUME_ACTION, GET_RESUME_ACTION } from "../constants";
import { deserialize, File_Type } from "./files";

interface ResumeData {
    fileData: string // base64
    fileType: File_Type
}

export const getResume = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      (window as any).chrome.runtime.sendMessage({
        action: GET_RESUME_ACTION,
      },
      (response: ResumeData) => {
        const error = (window as any).chrome.runtime.lastError
        if (error) {
            reject(new Error(error));
            return;
        }
        if(!response){
            resolve('')
            return
        }
        const arrayBuffer = deserialize(response.fileData);
        mammoth.convertToHtml({arrayBuffer})
        .then((result: { value: any; messages: any; }) => {
            const html = result.value; // The generated HTML
            const messages = result.messages; // Any messages, such as warnings during conversion
            resolve(html)
            console.log(messages)
        }).catch((e: any) => {
          console.log(e)
        }).done();
      });
    })
} 

export const deleteResume = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      (window as any).chrome.runtime.sendMessage({
        action: DELETE_RESUME_ACTION,
      },
      (response: any) => {
        const error = (window as any).chrome.runtime.lastError
        if (error) {
            reject(new Error(error));
            return;
        }
        resolve(response)
      });
    })
} 