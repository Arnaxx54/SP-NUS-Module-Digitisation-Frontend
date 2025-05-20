import {useNavigate} from 'react-router'

const Navigation = () => {

    const navigate = useNavigate();
    const activitiesTag = ['ActivityOneId','ActivityTwoId','ActivityThreeId','ActivityFourId','ActivityFiveId','ActivitySixId'];

    {/*handles navigation from student designed activities to respective activities*/}
    const dashboardNavigation = (activityId, activityLabel, activity) => {
        {activitiesTag.map((tag, i) => (
            sessionStorage.setItem(tag, activity.activityIds[i])
        ))}
        sessionStorage.setItem("new-chain", false);
        sessionStorage.setItem("ActivitiesId", activity.id);

        //doesn't exist for customActivitiesStudent. Only for StudentDesignedActivities.
        sessionStorage.setItem("custom-activities-instructor", false);
        
        navigate(`/activity${activityLabel}/${activityId}`);
    }

}

export default Navigation