import { useEffect, useState } from 'react';
import { activityThreeDefaultInstruction, activityThreeDefaultLabel, modelSelectedHighlightingColor, modelSelectedHighlightingColorCheck, userAndModelSelectedHighlightingColor, userAndModelSelectedHighlightingColorCheck, userSelectedHighlightingColor, userSelectedHighlightingColorCheck } from '../../data/ActivityConstants';
import Boilerplate from './Boilerplate'
import './Stylesheets/Boilerplate.css'
import { Button, Typography } from '@mui/material';
import SwitchNewChain from '../../components/SwitchNewChain';
import { useNavigate, useParams } from 'react-router';
import DisplayTranscript from '../../components/DisplayTranscript';
import { ActivityThreeDataRetrieval } from '../../hooks/DataRetrieval';
import { ActivityDataStorage } from '../../hooks/DataStorage';
import { activityLogger } from '../../utils/Logger';

const ActivityThree = () => {

    const [isInstructor, setIsInstructor] = useState(false)
    const [isTranscriptBlank, setIsTranscriptBlank] = useState(false)
    const [isHighlightingAllowed, setIsHighlightingAllowed] = useState(false);
    const [isNewChain, setIsNewChain] = useState(false)
    const [isModelAllowed, setIsModelAllowed] = useState(false);
    const [model, setModel] = useState("");
    const [label, setLabel] = useState(activityThreeDefaultLabel)
    const [instruction, setInstruction] = useState(activityThreeDefaultInstruction)
    const [transcriptData, setTranscriptData] = useState({})

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // checks occupation of the user
        if (sessionStorage.getItem("Occupation") == "Instructor") {
            setIsInstructor(true);
        }

        if (id !== undefined) {
            //retrieve data from database
            ActivityThreeDataRetrieval(id, setModel, setIsHighlightingAllowed, setIsModelAllowed, setLabel, setInstruction, setIsTranscriptBlank, setTranscriptData)
        } else {
            //retrieve data from previous activity
            setTranscriptData(sessionStorage.getItem('ActivityTwoBundledData'))
        }
    }, [])

    // handles highlighting
    const handleClick = (e) => {
        if (isHighlightingAllowed) {
            //checks if background color is green
            if (e.target.style.backgroundColor === modelSelectedHighlightingColor) {
                //changes it to blue
                e.target.style.backgroundColor = userAndModelSelectedHighlightingColor;
                //checks if background color is blue
            } else if (e.target.style.backgroundColor === userAndModelSelectedHighlightingColor) {
                //changes it to green 
                e.target.style.backgroundColor = modelSelectedHighlightingColor;
                //no background color
            } else if (e.target.style.backgroundColor === "") {
                //background color changed to yellow
                e.target.style.backgroundColor = userSelectedHighlightingColor;
                e.target.style.borderRadius = "4px";
                e.target.style.padding = "2px";
                //changes it to no background color since it was initially yellow
            } else {
                e.target.style.backgroundColor = "";
                e.target.style.borderRadius = "";
                e.target.style.padding = "";
            }
        }
    };

    //model transcript highlighting
    const modelTranscriptHighlighting = () => {

    }

    const handleSubmit = (e) => {

        e.preventDefault()

        //get html and css for text in transcript
        const getActivityMVC = (value) => {
            const element = document.querySelector(`[id="${value}"]`);
            if (element) {
                const htmlContent = element.outerHTML;
                const inlineStyles = element.getAttribute("style") || "No inline styles";
                return { html: htmlContent, css: inlineStyles };
            } else {
                console.log("Element not found");
                return undefined;
            }
        };

        const bundledData = transcriptData

        //gets activity mvc after user changes
        for (let i = 1; i < Object.keys(bundledData.activity_mvc).length + 1; i++) {
            //interview text
            if (i % 2 != 0) {
                let activity_mvc_value = getActivityMVC(i.toString());
                bundledData.activity_mvc[i] = activity_mvc_value;
                bundledData.content[i].sentenceUserHighlightA3 = false;
            } else {
                //interviewee text
                for (let j = 1; j < Object.keys(bundledData.activity_mvc[i]).length + 1; j++) {
                    let activity_mvc_value = getActivityMVC(i.toString() + j.toString());
                    bundledData.activity_mvc[i][j] = activity_mvc_value;
                    if (activity_mvc_value.html.match(userSelectedHighlightingColorCheck)) {
                        bundledData.content[i].response_text[j].sentenceUserHighlightA3 = true;
                    } else if (activity_mvc_value.html.match(userAndModelSelectedHighlightingColorCheck)) {
                        bundledData.content[i].response_text[j].sentenceUserHighlightA3 = false;
                    } else if (activity_mvc_value.css.match(modelSelectedHighlightingColorCheck)) {
                        bundledData.content[i].response_text[j].sentenceUserHighlightA3 = true;
                    } else {
                        bundledData.content[i].response_text[j].sentenceUserHighlightA3 = false;
                    }
                }
            }
        }

        bundledData.isModelAllowed = isModelAllowed
        bundledData.model = model
        bundledData.lastAuthored = isInstructor ? "instructor" : "student";
        bundledData.label = document.getElementById("activity-three-label").innerHTML
        bundledData.instruction = document.getElementById("activity-three-instruction").innerHTML

        sessionStorage.setItem('ActivityThreeBundledData', bundledData)

        //requests to database
        ActivityDataStorage(id, 'activitythree', bundledData)

        // data logger
        activityLogger(isInstructor, id ? 'Update' : 'Create', 'activityThree', 'activityThreeId')

        //requests to database

        if (sessionStorage.getItem("ActivityFourId") !== null) {
            navigate(`/activityfour/${sessionStorage.getItem("ActivityFourId")}`);
        } else {
            navigate("/activityfour");
        }

    }

    return (

        <div className="container-activity">

            <Boilerplate activityLabel={'three'} label={label} instruction={instruction} isInstructor={isInstructor} setInstruction={setInstruction} setLabel={setLabel} />

            <form onSubmit={handleSubmit}>

                {/*if highlighting is standardised*/}
                {!isInstructor && isModelAllowed && (
                    <Typography className="info-text">
                        You are not allowed to edit the highlighting of the transcript in this template.
                    </Typography>
                )}

                {/*if no transcript has been provided*/}
                {isTranscriptBlank && <Typography className="info-text">
                    No transcript has been displayed since no data was entered in Activity 1.
                </Typography>}

                {/*if machine learning model has been enabled*/}
                {!isInstructor && isModelAllowed && (
                    <Typography className="info-text">
                        The template utilises {model} to generate results to assist you in your decision making.
                    </Typography>
                )}

                {/*switch button to create a new chain and reinitialise future activities*/}
                <SwitchNewChain activityLabel={3} isNewChain={isNewChain} setIsNewChain={setIsNewChain} />

                {/*displays transcript*/}
                <DisplayTranscript transcriptData={transcriptData} handleClick={handleClick} />

                <Button className="submit-btn" fullWidth type="submit" variant="outlined">
                    Submit
                </Button>

            </form>

        </div>
    )

}

export default ActivityThree
