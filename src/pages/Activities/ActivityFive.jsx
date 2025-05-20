import { useEffect, useState } from 'react';
import SwitchNewChain from '../../components/SwitchNewChain';
import { activityFiveDefaultInstruction, activityFiveDefaultLabel, activityFourDefaultInstruction } from '../../data/ActivityConstants';
import Boilerplate from './Boilerplate'
import './Stylesheets/Boilerplate.css'
import { Button, FormControlLabel, Switch, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DisplayTranscriptGraphically from '../../components/DisplayTranscriptGraphically';
import { useNavigate, useParams } from 'react-router';
import { ActivityFiveDataRetrieval } from '../../hooks/DataRetrieval';
import { ActivityDataStorage } from '../../hooks/DataStorage';
import { activityLogger } from '../../utils/Logger';

const ActivityFive = () => {

    const [isInstructor, setIsInstructor] = useState(false)
    const [isNewChain, setIsNewChain] = useState(false)
    const [isTranscriptBlank, setIsTranscriptBlank] = useState(false)
    const [isClustering, setClustering] = useState(false);
    const [isAlternateView, setIsAlternateView] = useState(false);
    const [label, setLabel] = useState(activityFiveDefaultLabel)
    const [instruction, setInstruction] = useState(activityFourDefaultInstruction)
    const [transcriptData, setTranscriptData] = useState({})

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        // checks occupation of the user
        if (sessionStorage.getItem("Occupation") == "Instructor") {
            setIsInstructor(true);
        }

        if (id !== undefined) {
            //retrieve data from database
            ActivityFiveDataRetrieval(id, setLabel, setInstruction, setIsTranscriptBlank, setClustering, setTranscriptData)
        } else {
            //retrieve data from previous activity
            setTranscriptData(sessionStorage.getItem('ActivityFourBundledData'))
        }

    }, [])

    const handleSubmit = (e) => {

        e.preventDefault()

        if (transcriptData.content !== undefined) {
            Object.entries(transcriptData.content).map(([key, data]) => {
                if (data.type === "label") {
                    const element = document.querySelector(`[data-height-id="${data.id}"]`);
                    transcriptData.content[key].height = element.clientHeight;
                } else if (data.response_id) {
                    Object.entries(data.response_text).map(([responseKey, responseData]) => {
                        if (responseData.clusterData) {
                            const element = document.querySelector(`[data-height-id="${responseData.clusterData.id}"]`);
                            transcriptData.content[key].response_text[responseKey].clusterData.height = element.clientHeight;
                        }
                    });
                }
            });
        }

        transcriptData.lastAuthored = isInstructor ? "instructor" : "student";
        transcriptData.label = document.getElementById("activity-five-label").innerHTML
        transcriptData.instruction = document.getElementById("activity-five-instruction").innerHTML
        transcriptData.clustering = isClustering

        //requests to database
        sessionStorage.setItem('ActivityFiveBundledData', transcriptData)

        //requests to database
        ActivityDataStorage(id, 'activityfive', transcriptData)

        // data logger
        activityLogger(isInstructor, id ? 'Update' : 'Create', 'activityFive', 'activityFiveId')

        if (sessionStorage.getItem("ActivitySixId") !== null) {
            navigate(`/activitysix/${sessionStorage.getItem("ActivitySixId")}`);
        } else {
            navigate("/activitysix");
        }

    }

    // model clustering

    return (

        <div className="container-activity">

            <Boilerplate activityLabel={'five'} label={label} instruction={instruction} isInstructor={isInstructor} setInstruction={setInstruction} setLabel={setLabel} />

            <form onSubmit={handleSubmit}>

                {/*machine learning clustering has been disabled*/}
                {!isClustering && <Typography className="info-text">
                    The instructor has disabled viewing alternate machine learning clustering.
                </Typography>}

                {/*if no transcript has been provided*/}
                {isTranscriptBlank && <Typography className="info-text">
                    No transcript has been displayed since no data was entered in Activity 1.
                </Typography>}

                {/*switch button to create a new chain and reinitialise future activities*/}
                <SwitchNewChain activityLabel={5} isNewChain={isNewChain} setIsNewChain={setIsNewChain} />

                {/*switch to view alternative machine learning clustering*/}
                <FormControlLabel style={{ marginTop: 10 }} className="formControlLabelTop" control={
                    <Switch
                        checked={isAlternateView}
                        disabled={!isClustering}
                        onChange={() => {
                            // createAIClustering();
                            // setAlternateView((prev) => !prev);
                        }}
                    />
                }
                    label={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            View AI Clustering
                            <Tooltip title="Use this switch when you would like to view clusters generated by the ML model.">
                                <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
                            </Tooltip>
                        </div>
                    }
                />

                {/*displays components*/}
                <DisplayTranscriptGraphically transcriptData={transcriptData} setTranscriptData={setTranscriptData} />

                <Button className="submit-btn" fullWidth type="submit" variant="outlined">
                    Submit
                </Button>

            </form>

        </div>

    )

}

export default ActivityFive