import { Alert, Button, CircularProgress, LinearProgress, Typography } from '@mui/material'
import '../Stylesheets/Dashboard.css'
import { useEffect, useState } from 'react'
import { InstructorActivitiesDataRetrieval } from '../../../hooks/DataRetrieval'
import { DataCopy } from '../../../hooks/DataCopy'
import { activityLogger } from '../../../utils/Logger'
// import axios from 'axios'

const InstructorDesignedActivities = () => {

    const [listOfActivities, setListOfActivities] = useState({})
    const [loadingId, setLoadingId] = useState(null)
    const [isInstructor, setIsInstructor] = useState(false)

    useEffect(() => {

        //checks occupation of the user
        if (sessionStorage.getItem("Occupation") == "Instructor") {
            setIsInstructor(true);
        }

        //returns a list of all instructors
        InstructorActivitiesDataRetrieval(setListOfActivities)

    }, [])

    //retrieves data from the original set of activities and creates a copy
    //this is done so that the original copy can only be altered by the instructor
    const handleCopyTemplate = async (data) => {

        const activityLabels = ['One', 'Two', 'Three', 'Four', 'Five', 'Six']

        setLoadingId(data.id);

        try {

            DataCopy(data)

            activityLabels.forEach((label, index) => {
                activityLogger(isInstructor, 'Create', `activity${label}`, `activity${label}Id`)
            })

            setLoadingId(null);
            window.location.reload(false);

        } catch (error) {

            console.error('Failed to copy template:', error);
            setLoadingId(null);
        }
    }

    const sampleData = {
        "36": {
            "id": 36,
            "UserId": "10",
            "Published": null,
            "createdAt": "2025-01-29T09:51:34.000Z",
            "updatedAt": "2025-01-29T09:51:38.000Z",
            "activityIds": [1, 2, 3, 4, 5, null],
            "username": "S1",
            "activityTitle": "Title 1"
        },
        "37": {
            "id": 37,
            "UserId": "10",
            "Published": null,
            "createdAt": "2025-01-29T09:51:37.000Z",
            "updatedAt": "2025-01-29T09:51:40.000Z",
            "activityIds": [1, 2, 3, 4, 5, 6],
            "username": "S1",
            "activityTitle": "Title 2"
        }
    }

    return (
        <div className='custom-activities-container'>

            <Typography className="custom-activities-title">
                Instructor-Designed Activity Templates
            </Typography>

            <Alert className="alert-warning" severity="warning">
                Please do not refresh the page while the template is being copied. The page will refresh automatically once the duplication of activities is complete.
            </Alert>

            {/*displays the set of instructor activities available for students to work on*/}
            {/*If no templates have been published by the instructor*/}
            {Object.entries(listOfActivities).length === 0 ? (
                <div className='custom-activities-blank'>
                    Currently, no templates are available. Please consult your instructor.
                </div>
            ) : (
                Object.entries(listOfActivities).map(([key, value]) => {
                    return (
                        <div key={key} className="other-activities">
                            <div className='activity-container'>

                                {/*checks for the presence of a title*/}
                                <Typography className="activity-title">
                                    {value.activityTitle === "" ? "No Title Provided" : value.activityTitle}
                                </Typography>

                                <Typography className='activity-author'>
                                    ({value.username})
                                </Typography>

                            </div>

                            {loadingId === value.id ? (
                                <CircularProgress size={37} className='copy-template-loading' />
                            ) : (
                                <Button disableRipple className="copy-template-button" onClick={() => handleCopyTemplate(value)}>
                                    Launch
                                </Button>
                            )}

                        </div>
                    )
                })
            )}

        </div>
    )

}

export default InstructorDesignedActivities