import { Typography } from "@mui/material";
import './Components.css'

// displays transcript for activity two and three
const DisplayTranscript = ({ transcriptData, handleClick }) => {

    if (Object.keys(transcriptData).length === 0) {
        return (
            <div>No transcript data available.</div>
        )
    } else {
        return (
            <div id="content-container" className="content-container">
                {Object.entries(transcriptData.activity_mvc).map(([key, value]) => {
                    //interview text
                    if (key % 2 !== 0) {
                        value.html = value.html.replace('<p', '<span').replace('</p>', '</span>');
                        return (
                            <div style={{ marginBottom: "20px" }}>
                                <Typography
                                    sx={{ display: 'inline-block' }}
                                    dangerouslySetInnerHTML={{ __html: `${transcriptData.interviewer}: ${value.html}` }}
                                ></Typography>
                            </div>
                        );
                    } else {

                        //interviewee text
                        return (
                            <div style={{ marginBottom: "20px" }}>
                                <Typography sx={{ display: 'inline' }}>
                                    <strong>{transcriptData.interviewee}</strong>:{" "}
                                </Typography>
                                {Object.entries(value).map(([key2, responseValue]) => (
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        onClick={handleClick}
                                        dangerouslySetInnerHTML={{ __html: responseValue.html }}
                                    ></Typography>
                                ))}
                            </div>
                        );
                    }

                })}
            </div>
        )
    }
}

export default DisplayTranscript