import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import {
    restrictToWindowEdges, restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import Popover from '@mui/material/Popover/Popover';
import Button from '@mui/material/Button/Button';
import DragHandle from '../DragHandle/DragHandle';
import { Box, Tabs, Tab, CircularProgress, Divider } from '@mui/material';
import CoverLetterGenerator from '../CoverLetterGenerator/CoverLetterGenerator';
import { getResume } from '../../utils/messaging';
import { downloadAsPdf } from '../../utils/files';
import { detectPlaceholders } from '../../utils/strings';
import Bot from '../../icons/Bot';
import '../../index.css';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// this is the context script, injected into the page itself
const ContentScript = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [top, setTop] = useState(50);
    const [jobInfo, setJobInfo] = useState("false")
    const [isAiError, setIsAiError] = useState(false)
    const [isLoadError, setIsLoadError] = useState(false)
    const [htmlResume, setHTMLResume] = useState<string>('')
    const [enhancedResume, setEnhancedResume] = useState<string>('')
    const [coverLetterHTML, setCoverLetterHTML] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleDragEnd = (evt: DragEndEvent) => {
        setTop(top + evt.delta.y);
    }

    const checkForJobPosting = () => {
        const pageInnerText = document.body.innerText.trim();
        if (pageInnerText !== '') {
            setIsAiError(false)
            setIsLoadError(false)
            setIsLoading(true)
            const genAI = new GoogleGenerativeAI(process.env.REACT_APP_AI_API_KEY ?? '');
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
                You are given the innerText of a website page. 
                Determine whether the page contains a job listing 
                with a job description and a clear prompt to apply 
                for the position. If the page contains a job listing, 
                return a detailed description of the job (e.g., 
                job title, position, job description, application instructions). 
                If it does not, return "false". Do not include any additional text 
                or delimiters. Just return the job description or "false". 
                InnerText --> ${pageInnerText}

                If the page does not contain a job listing, return "false." Be flexible with formatting and keyword variations, and look for common job-related terms like "We are hiring," "Join our team," "Position available," "Responsibilities," "Apply now," "Send resume to," etc. Consider that job listings may not always follow a standard format.

                Return only the job description as a string or "false" if no job listing is found.
            `;

            model.generateContent(prompt).then((result) => {
                setIsLoading(false)
                const rawString = result.response.text();
                setJobInfo(rawString.trim())
            }).catch((err) => {
                setIsAiError(true)
                setIsLoadError(true)
                setIsLoading(false)
                console.log(err)
            })
        }
    }

    const enhanceResume = (resume: string) => {
        if (jobInfo !== "false") {
            setIsAiError(false)
            setIsLoading(true)
            const genAI = new GoogleGenerativeAI(process.env.REACT_APP_AI_API_KEY ?? '');
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
                You are given a detailed job description and a resume in HTML format. 
                Please adjust the resume and tailor it to the job description. Focus on the following:

                1. Highlight relevant skills, experience, and qualifications that match the job description.
                2. Emphasize achievements and responsibilities that align with the job role.
                3. Remove or minimize information that is less relevant to the specific job position.
                4. Ensure the resume format and language are aligned with the job description (e.g., use of keywords, job-specific jargon, etc.).
                5. Provide the modified resume in HTML format, maintaining the structure and readability.
                
                Do not include placeholders (inside sqaure brackets) or any missing details; either fully 
                populate the fields or omit them if not available.

                Job Description: ${jobInfo}

                Resume (HTML format): ${resume}

                Return only the tailored resume in HTML format, without any extra text.
            `;

            model.generateContent(prompt).then((result) => {
                setIsLoading(false)
                const rawString = result.response.text().replace("```html", "").replace("```", "");
                setEnhancedResume(rawString.trim())
            }).catch((err) => {
                setIsAiError(true)
                setIsLoading(false)
                console.log(err)
            })
        }
    }

    // WHEN AI fails we fallback here to have AI redo its work...
    const replacePlaceholders = (aiGeneratedCoverLetter: string) => {
        setIsAiError(false)
        setIsLoading(true)
        const genAI = new GoogleGenerativeAI(process.env.REACT_APP_AI_API_KEY ?? '');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You have been provided with a cover letter that contains placeholders (e.g., "[Date]", "[Hiring Manager Name]", "[Company Name]"). Your task is to rewrite the cover letter, removing all placeholders, and generate a more generic version of the cover letter that can be used for any job application. The letter should be professional, polite, and tailored in tone but avoid specifics that were originally placeholders.

            Please do not include any NEW placeholders (or my code will get stuck in a loop), and create a new version that looks complete and well-structured. It's fine for the letter to be generic, as more specific data was needed in the original, but it should still be coherent and presentable.

            Return only the HTML code for the cover letter. Do not include any commentary, explanations, or additional text.

            ORIGINAL COVER LETTER: ${aiGeneratedCoverLetter}
        `;

        model.generateContent(prompt).then((result) => {
            setIsLoading(false)
            const rawString = result.response.text().replace("```html", "").replace("```", "");
            const hasPlaceholders = detectPlaceholders(rawString)
            if (hasPlaceholders) {
                console.log('Still has placeholders...')
                setCoverLetterHTML(rawString.trim())
            }
            else {
                setCoverLetterHTML(rawString.trim())
            }
        }).catch((err) => {
            setIsLoading(false)
            setIsAiError(true)
            console.log(err)
        })
    }

    const generateCoverLetter = (_resume: string) => {
        if (jobInfo !== "false" && _resume !== "") {
            setIsLoading(true)
            const genAI = new GoogleGenerativeAI(process.env.REACT_APP_AI_API_KEY ?? '');
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
                You are given a job description and a resume in HTML format. Do not use any placeholders. Instead, extract the necessary details from both the job description and the resume and generate a fully customized, professional cover letter in HTML format.

                Job Description: ${jobInfo}
                Resume: ${_resume}

                Instructions:
                Extract real contact information (e.g., name, phone number, email) directly from the provided resume HTML.
                Tailor the cover letter to the specific job description by using the most relevant skills, experiences, and qualifications from the resume.
                Ensure no placeholders like "[Date]", "[Hiring Manager Name]", or "[Platform where you saw the job posting]" are included.
                Include all necessary details, including name, phone number, email, relevant experience, and skills directly from the resume and job description.
                The cover letter must be in HTML format and must not include any extra text or commentary.
                Do not generate placeholders or any text that would require manual input later (e.g., "[Date]" or "[Hiring Manager Name]"). Fully extract and use the available data.

                Return only the HTML code for the cover letter. Do not include any commentary, explanations, or additional text.
            `;

            model.generateContent(prompt).then((result) => {
                setIsLoading(false)
                const rawString = result.response.text().replace("```html", "").replace("```", "");
                const hasPlaceholders = detectPlaceholders(rawString)
                if (hasPlaceholders) {
                    replacePlaceholders(rawString)
                }
                else {
                    setCoverLetterHTML(rawString.trim())
                }
            }).catch((err) => {
                setIsLoading(false)
                console.log(err)
            })
        }
    }

    const generateAutofillCommands = () => {
        const pageInnerHTML = document.body.innerHTML
        if (pageInnerHTML && htmlResume !== "") {
            setIsLoading(true)
            const genAI = new GoogleGenerativeAI(process.env.REACT_APP_AI_API_KEY ?? '');
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
                You are given the innerHTML of a job listing page, along with a 
                resume and cover letter. Please scan the HTML and identify all 
                form input elements. Return **one array** of data I can use to populate 
                these form fields with relevant data extracted from the resume 
                and cover letter. Only populate fields that can be set from the 
                provided documents (e.g., name, contact information, work experience, 
                skills, cover letter content). Any items that cannot be filled based on 
                the resume or cover letter should be omitted.

                The information you'll be provided includes:

                INNER HTML OF PAGE: ${pageInnerHTML}
                RESUME: ${htmlResume}
                COVER LETTER: ${coverLetterHTML}

                Return one array of JSON with INPUT IDS AND VALUES like: [{id: <inputid>, value: <field_value>}]

                PLEASE RETURN A VALID STRINGIFIED ARRAY THAT I CAN USE JSON.PARSE ON

                DO NOT INCLUDE ANY EXPLANATION, ONLY RETURN THE ARRAY.
            `;

            model.generateContent(prompt).then((result) => {
                setIsLoading(false)
                const aiResponseRawText = result.response.text();
                if (aiResponseRawText.includes('```json')) {
                    const firstPart = aiResponseRawText.split("```json")[1]
                    const jsonStringOnly = firstPart.split("```")[0]
                    console.log(jsonStringOnly)
                    try {
                        const inputData: { id: string, value: string }[] = JSON.parse(jsonStringOnly)
                        inputData.forEach((input) => {
                            const element = document.getElementById(input.id) as HTMLInputElement;
                            if (element) {
                                const event = new Event('input', { bubbles: true });
                                element.value = input.value;
                                element.dispatchEvent(event);
                            } else {
                                console.log(`Element with ID ${input.id} not found.`);
                            }
                        })
                    } catch (e) {
                        console.log(e)
                    }
                } else {
                    // console.log(aiResponseRawText)
                    try {
                        const inputData: { id: string, value: string }[] = JSON.parse(aiResponseRawText)
                        inputData.forEach((input) => {
                            const element = document.getElementById(input.id) as HTMLInputElement;
                            if (element) {
                                const event = new Event('input', { bubbles: true });
                                element.value = input.value;
                                element.dispatchEvent(event);
                            } else {
                                console.log(`Element with ID ${input.id} not found.`);
                            }
                        })
                    } catch (e) {
                        console.log(e)
                    }
                }
            }).catch((err) => {
                setIsLoading(false)
                console.log(err)
            })
        }
    }


    const copyToClipboard = () => {
        const innerText = document.getElementById("__dynamicHTMLResume")?.innerText;
        navigator.clipboard.writeText(innerText ?? '')
            .then(() => {
                console.log('Text successfully copied to clipboard');
            })
            .catch(err => {
                console.error('Failed to copy text to clipboard: ', err);
            });
    }

    useEffect(() => {
        checkForJobPosting()
    }, [])

    useEffect(() => {
        if (jobInfo !== "false") {
            getResume().then((resume: string) => {
                setHTMLResume(resume)
                enhanceResume(resume)
                generateCoverLetter(resume)
            }).catch((err) => {
                console.log(err)
            })
        }
    }, [jobInfo])

    const CustomTabPanel = (props: TabPanelProps) => {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
            </div>
        );
    }

    return (
        <div>
            <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
                <div className='resume-tailor-draggable-container' style={{ top, visibility: jobInfo === 'false' && !isLoadError ? 'hidden' : 'visible' }}>
                    <DragHandle badgeCount={jobInfo === "false" ? 0 : 1} />
                    <Button
                        size='small'
                        sx={{ color: '#ff4c00', width: 10, margin: 0, padding: 0, fontSize: 14, fontWeight: 'bolder', textTransform: 'none' }}
                        onClick={(event) => {
                            setOpen(!open)
                            if (open) {
                                setAnchorEl(null)
                            }
                            else {
                                setAnchorEl(event.currentTarget)
                            }
                        }}>
                        {open ? 'Hide' : 'View'}
                    </Button>
                </div>
            </DndContext>
            <Popover
                id={open ? 'simple-popover' : undefined}
                style={{ zIndex: 999999999 }}
                open={open}
                anchorEl={anchorEl}
                onClose={() => {
                    setOpen(false)
                    setAnchorEl(null)
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ width: 700 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabIndex} onChange={(_evt: any, index: number) => setTabIndex(index)} aria-label="Resume Tailor Tabs">
                            <Tab label="Resume Tailor" sx={{ textTransform: 'none', fontSize: 16 }} />
                            <Tab label="Cover Letter Generator" sx={{ textTransform: 'none', fontSize: 16 }} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={tabIndex} index={0}>
                        <div style={{ padding: 5 }}>
                            <Button disabled={isLoading} color='info' variant='outlined' sx={{ fontSize: 14, textTransform: 'none', marginBottom: 2, marginLeft: 2 }} onClick={() => {
                                enhanceResume(htmlResume)
                            }}>{enhancedResume === '' ? 'Generate' : 'Regenerate'}</Button>
                            <Button disabled={enhancedResume === '' || isLoading} color='info' variant='outlined' sx={{ fontSize: 14, textTransform: 'none', marginBottom: 2, marginLeft: 2 }} onClick={() => {
                                downloadAsPdf(document.getElementById("__dynamicHTMLResume"))
                            }}>Download as PDF</Button>
                            <Button disabled={enhancedResume === '' || isLoading} color='info' variant='outlined' sx={{ fontSize: 14, textTransform: 'none', marginBottom: 2, marginLeft: 2 }} onClick={() => {
                                copyToClipboard()
                            }}>Copy Text</Button>
                            <Button disabled={enhancedResume === '' || isLoading} color='info' variant='outlined' sx={{ fontSize: 14, textTransform: 'none', marginBottom: 2, marginLeft: 2 }} onClick={() => {
                                generateAutofillCommands()
                            }}>Auto Fill</Button>
                            {isLoading && (
                                <div className='resume-tailor-loader'>
                                    <CircularProgress sx={{ marginRight: 3 }} />
                                    Tailoring your resume to match this job posting... Please wait.
                                </div>
                            )}
                            {enhancedResume && !isLoading && <div id="__dynamicHTMLResume" className='info' dangerouslySetInnerHTML={{ __html: enhancedResume }} />}
                            {!enhancedResume && isAiError && (
                                <div className='resume-tailor-engine-error'>
                                    <div>
                                        <Bot width={100} height={100} />
                                    </div>
                                    <div><span style={{ fontWeight: 'bold' }}>Error: </span>The AI Engine is currently overloaded.</div>
                                    <div>Try refreshing the page or you can try again later.</div>
                                </div>
                            )}
                        </div>
                        <br></br>
                        <Divider />
                        <div style={{ fontSize: '12px' }}>
                            <span style={{ fontWeight: 'bold' }}>Disclaimer: </span>
                            By using this resume adjustment tool, you acknowledge that
                            the AI-generated content is intended to assist in tailoring
                            your resume based on the provided job description. However, it
                            is your responsibility to verify that all information, including
                            job titles, dates, qualifications, and other details, is accurate
                            and truthful.
                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabIndex} index={1}>
                        <CoverLetterGenerator isLoading={isLoading} coverLetterHTML={coverLetterHTML} errorMessage={isAiError ? 'true' : ''} generateCoverLetter={() => {
                            generateCoverLetter(htmlResume)
                        }} />
                    </CustomTabPanel>
                </Box>
            </Popover>
        </div>
    )
}

export default ContentScript; 