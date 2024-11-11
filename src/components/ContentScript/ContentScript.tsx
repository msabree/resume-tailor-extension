import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import {
    restrictToWindowEdges, restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import Popover from '@mui/material/Popover/Popover';
import Button from '@mui/material/Button/Button';
import DragHandle from '../DragHandle/DragHandle';
import { Box, Tabs, Tab, CircularProgress } from '@mui/material';
import InterviewPrep from '../InterviewPrep/InterviewPrep';
import "./styles.css";
import { getResume } from '../../utils/messaging';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// this is the context script, injected into the page itself
const ContentScript = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [top, setTop] = useState(50);
    const [jobInfo, setJobInfo] = useState("")
    const [htmlResume, setHTMLResume] = useState<string>('')
    const [enhancedResume, setEnhancedResume] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleDragEnd = (evt: DragEndEvent) => {
        setTop(top + evt.delta.y);
    }

    const checkForJobPosting = () => {
        const pageInnerText = document.body.innerText.trim();
        if (pageInnerText !== '') {
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
            `;

            model.generateContent(prompt).then((result) => {
                setIsLoading(false)
                const rawString = result.response.text();
                console.log(rawString)
                setJobInfo(rawString.trim())
            }).catch((err) => {
                setIsLoading(false)
                console.log(err)
            })
        }
    }

    const summarizeJobDescription = (resume: string) => {
        if (jobInfo !== "false") {
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
                
                Job Description (HTML format): ${jobInfo}

                Resume (HTML format): ${resume}

                Return only the tailored resume in HTML format, without any extra text.
            `;

            model.generateContent(prompt).then((result) => {
                setIsLoading(false)
                const rawString = result.response.text();
                console.log(rawString)
                setEnhancedResume(rawString.trim())
            }).catch((err) => {
                setIsLoading(false)
                console.log(err)
            })
        }
    }

    useEffect(() => {
        checkForJobPosting()
    }, [])

    useEffect(() => {
        if (jobInfo !== "false") {
            getResume().then((resume: string) => {
                setHTMLResume(resume) // added to state in case we need it later... otherwise remove at will
                summarizeJobDescription(resume)
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
                <div className='draggable-container' style={{ top }}>
                    <DragHandle badgeCount={jobInfo === "false" ? 0 : 1} />
                    <Button
                        size='small'
                        sx={{ width: 10, margin: 0, padding: 0, fontSize: 14, textTransform: 'none' }}
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
                        <Tabs value={tabIndex} onChange={(_evt: any, index: number) => setTabIndex(index)} aria-label="Clever Apply Tabs">
                            <Tab label="Resume Enhancer" sx={{ textTransform: 'none', fontSize: 16 }} />
                            <Tab label="Interview Tips" sx={{ textTransform: 'none', fontSize: 16 }} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={tabIndex} index={0}>
                        {isLoading && <CircularProgress />}
                        <div style={{ fontSize: '12px' }}>
                            <span style={{ fontWeight: 'bold' }}>Disclaimer: </span>
                            By using this resume adjustment tool, you acknowledge that
                            the AI-generated content is intended to assist in tailoring
                            your resume based on the provided job description. However, it
                            is your responsibility to verify that all information, including
                            job titles, dates, qualifications, and other details, is accurate
                            and truthful.
                        </div>
                        <br></br>
                        {enhancedResume && <div className='info' dangerouslySetInnerHTML={{__html: enhancedResume}} />}
                    </CustomTabPanel>
                    <CustomTabPanel value={tabIndex} index={1}>
                        <InterviewPrep data={'foobar'} errorMessage={''} regenerate={() => { }} />
                    </CustomTabPanel>
                </Box>
            </Popover>
        </div>
    )
}

export default ContentScript; 