import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import {
    restrictToWindowEdges, restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import Popover from '@mui/material/Popover/Popover';
import Button from '@mui/material/Button/Button';
import DragHandle from '../DragHandle/DragHandle';
import "./styles.css";
import { Box, Tabs, Tab, CircularProgress } from '@mui/material';
import InterviewPrep from '../InterviewPrep/InterviewPrep';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// this is the context script, injected into the page itself
const ContentScript = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [top, setTop] = useState(50);
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleDragEnd = (evt: DragEndEvent) => {
        setTop(top + evt.delta.y);
    }

    const getBadgeCount = () => {
        return 1
    }

    const isJobDescriptionDetected = () => {
        if (document.body.innerText.trim() !== '') {
            setIsLoading(true)
            const genAI = new GoogleGenerativeAI(process.env.REACT_APP_AI_API_KEY ?? '');
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
                Here is the innerText of a website. I need to know if this is a job site 
                with a job description prompting someone to apply. Please return only a 
                boolean value—nothing else. No extra text or delimiters. This will be 
                assigned to a variable.
            `;

            model.generateContent(prompt).then((result) => {
                setIsLoading(false)
                const rawString = result.response.text();
                console.log(rawString)
            }).catch((err) => {
                setIsLoading(false)
                console.log(err)
            })
        }
    }

    useEffect(() => {
        isJobDescriptionDetected()
    }, [])

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
                    <DragHandle badgeCount={getBadgeCount()} />
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
                        <div style={{fontSize: '12px'}}>
                            <span style={{fontWeight: 'bold'}}>Disclaimer: </span> 
                            By using this resume adjustment tool, you acknowledge that 
                            the AI-generated content is intended to assist in tailoring 
                            your resume based on the provided job description. However, it 
                            is your responsibility to verify that all information, including 
                            job titles, dates, qualifications, and other details, is accurate 
                            and truthful.
                        </div>
                        <br></br>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabIndex} index={1}>
                        <InterviewPrep data={'foobar'} errorMessage={''} regenerate={() => {}} />
                    </CustomTabPanel>
                </Box>
            </Popover>
        </div>
    )
}

export default ContentScript; 