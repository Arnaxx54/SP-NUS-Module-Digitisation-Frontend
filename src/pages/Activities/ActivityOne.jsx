import { Button, ButtonGroup, FormControlLabel, Switch, TextField, Tooltip, Typography } from "@mui/material";
import Boilerplate from "./Boilerplate"
import { useEffect, useState } from "react";
import InfoIcon from '@mui/icons-material/Info';
import './Stylesheets/Boilerplate.css'
import './Stylesheets/ActivityOne.css'
import { activityOneDefaultInstruction, activityOneDefaultLabel } from "../../data/ActivityConstants";
import SwitchNewChain from "../../components/SwitchNewChain";
import { useNavigate, useParams } from "react-router";
import { ActivityOneDataRetrieval } from "../../hooks/DataRetrieval";
import { ActivityDataStorage } from "../../hooks/DataStorage";
import { activityLogger } from "../../utils/Logger";

const ActivityOne = () => {

    //use state hooks to store relevant values
    const [interviewer, setInterviewer] = useState("");
    const [interviewee, setInterviewee] = useState("");
    const [transcript, setTranscript] = useState("");
    const [isInterviewerError, setIsInterviewerError] = useState(false);
    const [isIntervieweeError, setIsIntervieweeError] = useState(false);
    const [isTranscriptError, setIsTranscriptError] = useState(false);
    const [helperText, setHelperText] = useState("");
    const [previewTranscript, setPreviewTranscript] = useState({});
    const [isPreviewClicked, setIsPreviewClicked] = useState(false);
    const [transcriptTitle, setTranscriptTitle] = useState("");
    const [isInstructor, setIsInstructor] = useState(false);
    const [transcriptEditable, setTranscriptEditable] = useState(true);
    const [isNewChain, setIsNewChain] = useState(false);
    const [previewClickedError, setPreviewClickedError] = useState("");
    const [label, setLabel] = useState(activityOneDefaultLabel)
    const [instruction, setInstruction] = useState(activityOneDefaultInstruction)
    const [isNewActivityInit, setIsNewActivityInit] = useState(false)

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {

        //checks occupation of the user
        if (sessionStorage.getItem("Occupation") == "Instructor") {
            setIsInstructor(true);
        }

        setIsNewActivityInit(sessionStorage.getItem('NewActivityInit'))

        //retrieve data from database
        if (id !== undefined) {
            ActivityOneDataRetrieval(id, setTranscriptTitle, setInterviewer, setInterviewee, setTranscriptEditable, setLabel, setInstruction, setTranscript)
        }

    }, [])

    //submission of activity one
    const handleSubmit = (e) => {

        //gets html and css of each of the sentences in the transcript
        const getActivityMVC = (elementId) => {
            const element = document.querySelector(`[id="${elementId}"]`);
            if (element) {
                const htmlContent = element.outerHTML;
                const inlineStyles = element.getAttribute("style") || "No inline styles";
                return { html: htmlContent, css: inlineStyles };
            } else {
                alert("Element not found");
                return undefined;
            }
        };

        e.preventDefault()

        let transcript_source_id = transcriptTitle;
        let activity_mvc_content = {};

        setPreviewClickedError("");

        //checks whether preview button has been previously clicked
        if (!isPreviewClicked) {
            setPreviewClickedError("Please click the 'Preview' button to review the transcript before submitting.");
            return;
        } else if (transcript) {
            //iterates through transcript and retrives associated html and css
            Object.entries(previewTranscript).map(([key, line]) => {
                if (line.questioner_tag !== undefined) {
                    console.log(key)
                    activity_mvc_content[key] = getActivityMVC(key);
                } else {
                    activity_mvc_content[key] = {};
                    Object.entries(previewTranscript[key].response_text).map(
                        ([key2, responseLine]) => {
                            activity_mvc_content[key][key2] = getActivityMVC(key.toString() + key2.toString());
                        }
                    );
                }
            });
        }

        let bundledData = {
            transcript_source_id: transcript_source_id,
            interviewer: interviewer,
            interviewee: interviewee,
            content: previewTranscript,
            UserId: sessionStorage.getItem("UserId"),
            transcriptEditable: transcriptEditable,
            label: document.getElementById("activity-one-label").innerHTML,
            instruction: document.getElementById("activity-one-instruction").innerHTML,
            activity_mvc: activity_mvc_content,
            lastAuthored: isInstructor ? "instructor" : "student",
            transcriptBlank: previewTranscript === null ? true : false
        };

        sessionStorage.setItem('ActivityOneBundledData', JSON.stringify(bundledData))

        // requests to database
        ActivityDataStorage(id, 'activityone', bundledData)

        // data logger
        activityLogger(isInstructor, id ? 'Update' : 'Create', 'activityOne', 'activityOneId')

        if (sessionStorage.getItem("ActivityTwoId") !== null) {
            navigate(`/activitytwo/${sessionStorage.getItem("ActivityTwoId")}`);
        } else {
            navigate("/activitytwo");
        }

    }

    //checks whether all necessary fields have been filled
    const inputValidation = () => {
        setHelperText('');
        setPreviewClickedError('');
        setIsInterviewerError(false);
        setIsIntervieweeError(false);
        setIsTranscriptError(false);

        let flag = false;
        if (!interviewer) {
            setIsInterviewerError(true);
            flag = true;
        }
        if (!interviewee) {
            setIsIntervieweeError(true);
            flag = true;
        }
        if (!transcript) {
            setIsTranscriptError(true);
            flag = true;
        }

        return !flag ? true : false;
    }

    const previewTranscriptDataCleaning = () => {

        const cleaning = (text) => {
            //tabs are replaced by single space
            text = text.replace(/\s{4}/g, "");
            //multiple spaces are replaced by single space
            text = text.replace(/\s\s+/g, "");
            //multiple fullstops are replaced by a single fullstop
            text = text.replace(/\.+/g, ".");
            //?. is replaced by ?
            text = text.replace(/\?\./g, "?");
            //. . is replaced by .
            text = text.replace(/\. \./g, ". ");
            return text;
        };

        const splitFirstOccurrence = (str, separator) => {
            const index = str.indexOf(separator);
            //ensures function always returns two elements
            if (index === -1) return [str, ''];
            return [str.slice(0, index).trim(), str.slice(index + separator.length).trim()];
        }

        let transcriptJSON = {};

        if (transcript.trim() !== "") {

            if (inputValidation()) {

                //matches any string starting with one or more characters followed by a colon
                const check1 = new RegExp(`^.+:`);

                let isQuestion = false;
                let sentence_num = 1;
                let question_num = 0;
                let answer_num = 1;

                //split the transcript into sentences based on punctuation marks (., !, ?, ;) 
                let individualLines = cleaning(transcript).split(/\s*(?<=[.!?;])\s*|\n+/g);

                //checks whether correct interview and interviewee labels have been used
                for (const line of individualLines) {
                    if (!(line.match(check1) && line.trim().startsWith(interviewer + ":")) && !(line.match(check1) && line.trim().startsWith(interviewee + ":")) && !(!line.match(check1))) {
                        setHelperText('Include the correct interviewer and interviewee labels.')
                        setPreviewTranscript('')
                        return
                    }
                }

                individualLines.forEach(line => {

                    if (line.match(check1) && line.trim().startsWith(interviewer + ":")) {

                        //handles interview questions
                        isQuestion = true;
                        question_num++;
                        transcriptJSON[sentence_num] = {
                            sentence_num: sentence_num,
                            question_id: question_num,
                            questioner_tag: interviewer,
                            question_text: splitFirstOccurrence(line, ":")[1],
                        };
                        sentence_num++;
                        answer_num = 1;

                    } else if (line.match(check1) && line.trim().startsWith(interviewee + ":")) {

                        //handles interviewer answer
                        isQuestion = false;
                        if (!transcriptJSON[sentence_num] || !transcriptJSON[sentence_num].response_text) {
                            transcriptJSON[sentence_num] = {
                                sentence_num: sentence_num,
                                response_id: question_num,
                                response_tag: interviewee,
                                response_text: {},
                            };
                        }
                        transcriptJSON[sentence_num].response_text[answer_num] = {
                            text: splitFirstOccurrence(line, ":")[1],
                        };
                        sentence_num++;
                        answer_num++;

                    } else if (!line.match(check1)) {

                        //handle continuation of interviewer questions and interviewee answers
                        if (isQuestion) {
                            transcriptJSON[sentence_num - 1].question_text += " " + cleaning(line);
                        } else {
                            transcriptJSON[sentence_num - 1].response_text[answer_num] = { text: cleaning(line) };
                            answer_num++
                        }
                    }

                })
            }

            setHelperText('')
            setPreviewTranscript(transcriptJSON)
        }
    }

    return (

        <div className='container-activity'>

            <Boilerplate activityLabel={'one'} label={label} instruction={instruction} isInstructor={isInstructor} setInstruction={setInstruction} setLabel={setLabel}/>

            <form onSubmit={handleSubmit} noValidate autoComplete="off">

                {/*displays switch button to instructors only for selecting whether transcript is editable*/}
                {isInstructor && (<FormControlLabel className="switch-label"
                    control={
                        <Switch checked={!transcriptEditable} onChange={() => setTranscriptEditable((prev) => !prev)} />
                    }
                    label={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            Standardised Script
                            <Tooltip title="The transcript is standardized and cannot be edited by students across all template copies.">
                                <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
                            </Tooltip>
                        </div>
                    }
                />
                )}

                {/*switch button to create a new chain and reinitialise future */}
                <SwitchNewChain activityLabel={1} isNewChain={isNewChain} setIsNewChain={setIsNewChain} isActivityOne={true} isNewActivityInit={isNewActivityInit} />

                {/*informs students whether transcript is editable*/}
                {!isInstructor && !transcriptEditable && (
                    <Typography className="switch-label">The transcript cannot be edited in this template.</Typography>
                )}

                {/*title*/}
                <TextField
                    className="text-field-activity"
                    margin="normal"
                    value={transcriptTitle}
                    label="Transcript title"
                    fullWidth
                    onChange={(e) => setTranscriptTitle(e.target.value)}
                ></TextField>

                {/*interviewer*/}
                <TextField
                    className="text-field-activity"
                    disabled={!isInstructor && !transcriptEditable}
                    error={isInterviewerError}
                    margin="normal"
                    value={interviewer}
                    fullWidth
                    variant="outlined"
                    label="Interviewer label (e.g. Interviewer)"
                    onChange={(e) => setInterviewer(e.target.value)}
                ></TextField>

                {/*interviewee*/}
                <TextField
                    className="text-field-activity"
                    disabled={!isInstructor && !transcriptEditable}
                    error={isIntervieweeError}
                    margin="normal"
                    value={interviewee}
                    fullWidth
                    variant="outlined"
                    label="Interviewee label (e.g. Interviewee)"
                    onChange={(e) => setInterviewee(e.target.value)}
                ></TextField>

                {/*transcript*/}
                <TextField
                    className="text-field-activity"
                    disabled={!isInstructor && !transcriptEditable}
                    helperText={helperText}
                    error={isTranscriptError}
                    margin="normal"
                    value={transcript}
                    rows={15}
                    fullWidth
                    multiline
                    variant="outlined"
                    label="Transcript"
                    onChange={(e) => setTranscript(e.target.value)}
                ></TextField>

                {/*preview transcript*/}
                <div className="preview-box">

                    {!isPreviewClicked && <Typography align="center">Please click the 'Preview' button to view the transcript.</Typography>}

                    {isPreviewClicked && Object.keys(previewTranscript).length === 0 && (
                        <Typography align="center">No valid transcript data has been entered yet.</Typography>
                    )}

                    {isPreviewClicked && Object.keys(previewTranscript).length !== 0 && (
                        Object.entries(previewTranscript).map(([key, line]) => {

                            if (line.questioner_tag !== undefined) {
                                //interviewer text
                                return (
                                    <div key={key}>
                                        <Typography display="inline">{line.questioner_tag}: </Typography>
                                        <Typography display="inline" id={key}>
                                            {line.question_text}
                                        </Typography>
                                        <br /><br />
                                    </div>
                                );
                            } else {
                                //interviewee text
                                return (
                                    <>
                                        <div key={key}>
                                            <Typography display="inline">{line.response_tag}: </Typography>
                                            {Object.entries(line.response_text).map(([responseKey, responseLine]) => {
                                                return (
                                                    <Typography id={key.toString() + responseKey} style={{ display: "inline" }}>{responseLine.text}{" "}</Typography>
                                                )
                                            })}
                                        </div>
                                        <br />
                                    </>
                                );
                            }
                        })
                    )}

                </div>

                <Typography>
                    {previewClickedError}
                </Typography>

                <ButtonGroup fullWidth>
                    <Button onClick={() => { setIsPreviewClicked(true); setPreviewClickedError(""); previewTranscriptDataCleaning() }} className="preview-btn" variant="text" fullWidth>
                        Preview
                    </Button>
                    <Button className="submit-btn" fullWidth type="submit" variant="outlined">
                        Submit
                    </Button>
                </ButtonGroup>

            </form>

        </div>
    )
}

export default ActivityOne