import axios from "axios";

export const activityLogger = async ({ isInstructor, event, activityLabel, activityIdLabel }) => {

    let loggingData = {
        DateTime: Date.now(),
        [isInstructor ? "ActivitySequenceId" : "StudentTemplateId"]: sessionStorage.getItem("ActivitiesId"),
        [isInstructor ? "InstructorId" : "StudentId"]: sessionStorage.getItem("UserId"),
        Event: event,
        ActivityId: sessionStorage.getItem(activityIdLabel),
        ActivityType: activityLabel,
    };

    if (isInstructor) {
        //updates instructor log
        await axios.post(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/instructorlog/create`, loggingData);
    } else {
        //updates student log
        await axios.post(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/studentlog/create`, loggingData);
    }

}