import '../Stylesheets/Dashboard.css'
import CustomActivitiesInstructor from './CustomActivitiesInstructor';
import CustomActivitiesStudent from './CustomActivitiesStudent';
import InstructorDesignedActivities from './InstructorDesignedActivities';
import StudentDesignedActivities from './StudentDesignedActivities';

const Dashboard = () => {

    const occupation = sessionStorage.getItem("Occupation");

    //displays the correct set of components depending on whether an instructor or student is logged in
    return (
        <div className='container'>
            {occupation === "Instructor"
                ? <>
                    <CustomActivitiesInstructor />
                    <StudentDesignedActivities />
                </>
                : <>
                    <CustomActivitiesStudent />
                    <InstructorDesignedActivities />
                </>}
        </div>
    )
}

export default Dashboard