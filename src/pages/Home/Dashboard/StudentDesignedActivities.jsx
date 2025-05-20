import { Button, Typography } from "@mui/material"
// import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import '../Stylesheets/Dashboard.css'
import ActivityButtonGroup from "../../../components/ActivityButtonGroup"
import { StudentActivitiesDataRetrieval } from "../../../hooks/DataRetrieval"

const StudentDesignedActivities = () => {

    //use state hooks to store relevant values
    const [listOfActivities, setListOfActivities] = useState({})

    useEffect(() => {

        StudentActivitiesDataRetrieval(setListOfActivities)

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
                Student Activities
            </Typography>

            {/*displays list of activities created by students*/}
            {/*when no activities have been created by students*/}
            {Object.entries(listOfActivities).length === 0 ? (
                <div className='custom-activities-blank'>
                    Currently, no templates have been authored by students.
                </div>
            ) : (
                Object.entries(listOfActivities).map(([key, activity]) => {
                    return (
                        <div className='other-activities'>

                            <div className='activity-container'>

                                {/*checks whether title is given*/}
                                <Typography className="activity-title">
                                    {activity.activityTitle === "" ? "No Title Provided" : activity.activityTitle}
                                </Typography>

                                <Typography className='activity-author'>
                                    ({activity.username})
                                </Typography>

                            </div>

                            {/*button group for activities one to six*/}
                            <ActivityButtonGroup activity={activity}/>

                        </div>
                    )
                })
            )}

        </div>
    )
}

export default StudentDesignedActivities