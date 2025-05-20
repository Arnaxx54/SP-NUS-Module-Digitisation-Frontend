import { Button, CircularProgress, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material'
import '../Stylesheets/Dashboard.css'
import { useNavigate } from 'react-router';
import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import ClearIcon from '@mui/icons-material/Clear';
import ActivityButtonGroup from '../../../components/ActivityButtonGroup';
import { ActivityOneRetrievalByUserId } from '../../../hooks/DataRetrieval';

const CustomActivitiesStudent = () => {

    //use state hooks to store relevant values
    const [listOfActivities, setListOfActivities] = useState({})

    const userId = sessionStorage.getItem("UserId");

    useEffect(() => {

        //returns list of all activities with corresponding user id
        ActivityOneRetrievalByUserId(userId, setListOfActivities, false)

    }, [])

    const sampleData = {
        "36": {
            "id": 36,
            "UserId": "10",
            "Published": null,
            "createdAt": "2025-01-29T09:51:34.000Z",
            "updatedAt": "2025-01-29T09:51:38.000Z",
            "activityIds": [1,2,3,4,5,null],
            "username": "S1",
            "activityTitle": "Title 1"
        },
        "37": {
            "id": 37,
            "UserId": "10",
            "Published": null,
            "createdAt": "2025-01-29T09:51:37.000Z",
            "updatedAt": "2025-01-29T09:51:40.000Z",
            "activityIds": [1,2,3,4,5,6],
            "username": "S1",
            "activityTitle": "Title 2"
        }
    }

    return (
        <div className='custom-activities-container'>

            <Typography className="custom-activities-title">
                Your Custom Activities
            </Typography>

            {/*displays the set of user activities along with their title title*/}
            {/*if student has created no activities*/}
            {Object.entries(listOfActivities).length === 0 ? (
                <div className='custom-activities-blank'>
                    Currently, no templates are selected. Please choose one from the list below.
                </div>
            ) : (
                Object.entries(listOfActivities).map(([key, activity]) => {
                    return (
                        
                        <div className='custom-activities'>

                            <div className='activity-container'>

                                {/*checks whether title is given*/}
                                <Typography className="activity-title">
                                    {activity.activityTitle === "" ? "No Title Provided" : activity.activityTitle}
                                </Typography>

                            </div>

                            {/*button group for activities one to six*/}
                            <ActivityButtonGroup activity={activity} customStudent={true}/>

                        </div>
                    )
                })
            )}



        </div>
    )
}

export default CustomActivitiesStudent