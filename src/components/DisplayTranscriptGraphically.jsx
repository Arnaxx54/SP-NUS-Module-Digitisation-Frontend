import { Button, Tooltip, Typography } from "@mui/material";
import Draggable from 'react-draggable';
import { v4 as uuidv4 } from "uuid";
import { getComponentColor } from "./ComponentColors";
import React from "react";

//change to incorporate activity 5 values too

const DisplayTranscriptGraphically = ({ transcriptData, setTranscriptData }) => {

    const nodeRef = React.useRef(null);

    //handles dragging of components
    const handleDrag = (e, data, mainKey, subKey) => {

        checkClustering();

        setTranscriptData((prevState) => {
            const updatedContent = { ...prevState.content };
            if (subKey !== undefined) {
                const updatedSubItem = {
                    ...updatedContent[mainKey].response_text[subKey].clusterData,
                    x: data.x,
                    y: data.y,
                };
                updatedContent[mainKey].response_text[subKey].clusterData = updatedSubItem;
            } else {
                const updatedItem = {
                    ...updatedContent[mainKey],
                    x: data.x,
                    y: data.y,
                };
                updatedContent[mainKey] = updatedItem;
            }
            return { ...prevState, content: updatedContent };
        });
    };

    //checks which components are next to each other
    const checkClustering = () => {

        let colorsUsedData = {};

        colorsUsedData = classAssignment();

        replaceLabelNames();

        const graphicalData = { ...transcriptData };

        Object.entries(graphicalData.content).forEach(([key, value]) => {
            if (value.response_id) {
                Object.entries(value.response_text).forEach(([key2, value2]) => {
                    if (value2.clusterData) {
                        graphicalData.content[key].response_text[key2].clusterData.color = colorsUsedData[value2.clusterData.userClusterIndexA4];
                    }
                });
            }
        });

        setTranscriptData(graphicalData);
    };

    //searches for the current label name and replaces it
    const replaceLabelNames = () => {
        let graphicalData = transcriptData;

        Object.entries(graphicalData.content).map(([key, value]) => {
            if (value.type === "label") {
                let val = document.getElementById(value.id).innerHTML;
                graphicalData.content[key].clusterLabelA4 = val;
            }
        });

        setTranscriptData(graphicalData);
    };

    //checks whether two components are close to each other
    const checkProximity = (x1, y1, x2, y2, height1, height2) => {

        if (Math.abs(x1 - x2) <= 125) {
            if (height1 === 120 && height2 === 120) {
                if (Math.abs(y1 - y2) <= 70) {
                    return true;
                }
            }
            if (height1 === 40 && height2 === 40) {
                if (Math.abs(y1 - y2) <= 60) {
                    return true;
                }
            }
            if (height1 === 40 && height2 === 120) {
                if (Math.abs(y1 - y2) <= 70) {
                    return true;
                }
            }
            if (height1 === 120 && height2 === 40) {
                if (Math.abs(y1 - y2) <= 40) {
                    return true;
                }
            }
        } else {
            return false;
        }
    };

    //clusters relevant components based on their proximity and assigns them colors
    const classAssignment = () => {

        let colorsUsedData = {};
        let checkClassData = {};
        let graphicalData = transcriptData;
        let currentClass = 0;
        let flag = false;
        let flag2 = false;

        Object.entries(graphicalData.content).map(([key, data]) => {
            if (data.type === "label") {
                const element = document.querySelector(`[data-height-id="${data.id}"]`);
                graphicalData.content[key].height = element.clientHeight;
            } else if (data.response_id) {
                Object.entries(data.response_text).map(([key2, data2]) => {
                    if (data2.clusterData) {
                        const element = document.querySelector(`[data-height-id="${data2.clusterData.id}"]`);
                        graphicalData.content[key].response_text[key2].clusterData.height = element.clientHeight;
                    }
                });
            }
        });

        //sets all userClusterIndexA4 to -1 irrespective of their initial state
        Object.entries(graphicalData.content).forEach(([key, data]) => {
            if (data.type === "label") {
                data.userClusterIndexA4 = -1;
            } else if (data.response_id) {
                Object.entries(data.response_text).forEach(([key2, data2]) => {
                    if (data2.clusterData) {
                        data2.clusterData.userClusterIndexA4 = -1;
                    }
                });
            }
        });

        //creates an array of relevant components for clustering 
        Object.entries(graphicalData.content).forEach(([key, data]) => {
            if (data.response_id) {
                Object.entries(data.response_text).forEach(([key2, data2]) => {
                    if (data2.clusterData) {
                        data2.clusterData.coreKey = key;
                        data2.clusterData.subKey = key2;
                        checkClassData[Object.keys(checkClassData).length + 1] = data2.clusterData;
                    }
                });
            } else if (data.type === "label") {
                data.coreKey = key;
                checkClassData[Object.keys(checkClassData).length + 1] = data;
            }
        });

        //calls a function to check proximity between all the components and assigns their class and color accordingly
        Object.entries(checkClassData).forEach(([key, value]) => {
            Object.entries(checkClassData).forEach(([key2, value2]) => {
                if (checkProximity(value.x, value.y, value2.x, value2.y, value.height, value2.height) && value2.userClusterIndexA4 === -1) {
                    if (flag === true) {
                        currentClass = currentClass + 1;
                        flag = false;
                        flag2 = true;
                    }
                    if (flag2 === true && value.userClusterIndexA4 !== -1) {
                        currentClass = currentClass - 1;
                        flag2 = false;

                        checkClassData[key2].userClusterIndexA4 = checkClassData[key].userClusterIndexA4;
                        if (checkClassData[key2].type == "label") {
                            colorsUsedData[checkClassData[key2].userClusterIndexA4] = checkClassData[key2].color;
                        }
                    } else {
                        checkClassData[key2].userClusterIndexA4 = currentClass;
                        flag2 = false;
                        if (checkClassData[key2].type == "label") {
                            colorsUsedData[checkClassData[key2].userClusterIndexA4] = checkClassData[key2].color;
                        }
                    }
                }
            });
            flag = true;
            flag2 = false;
        });

        Object.entries(checkClassData).forEach(([key, data]) => {
            if (data.subKey) {
                graphicalData.content[data.coreKey].response_text[data.subKey].clusterData.userClusterIndexA4 = data.userClusterIndexA4;
            } else {
                graphicalData.content[data.coreKey].userClusterIndexA4 = data.userClusterIndexA4;
            }
        });

        setTranscriptData(graphicalData);
        return colorsUsedData;
    };

    //handles removal of labels
    const removeLabel = (key) => {
        setTranscriptData((prevData) => {
            const newData = { ...prevData };
            delete newData.content[key];
            return newData;
        });
    };

    //handles deletion of copy of components
    const handleDeleteCopy = (coreKey, subKey) => {
        setTranscriptData(prevData => {
            const newData = { ...prevData };
            delete newData.content[coreKey].response_text[subKey];
            return newData;
        });
    };

    //hanldes creation of copies of components
    const handleCreateCopy = (coreKey, subKey) => {
        setTranscriptData(prevState => {
            const newData = { ...prevState };
            const itemToCopy = { ...newData.content[coreKey].response_text[subKey] };
            itemToCopy.clusterData = {
                ...itemToCopy.clusterData,
                id: uuidv4(),
                x: itemToCopy.clusterData.x,
                y: itemToCopy.clusterData.y + 10,
                userClusterIndexA4: -1,
                type: "text-copy",
                height: 0,
            };
            const newSubKey = Object.keys(newData.content[coreKey].response_text).length + 1;
            newData.content[coreKey].response_text[newSubKey] = itemToCopy;
            return newData;
        });
    };

    //handles double click to create a new label
    const handleDoubleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top

        createLabelAtPosition(x / 2, y / 2);
    };

    //creates a new label at the position of the double click
    const createLabelAtPosition = (x, y) => {

        setTranscriptData((prevState) => {
            const newData = {
                ...prevState,
                content: {
                    ...prevState.content,
                    [Object.keys(prevState.content).length + 1]: {
                        id: uuidv4(),
                        clusterLabelA4: "Click to edit label",
                        x: x,
                        y: y,
                        userClusterIndexA4: -1,
                        type: "label",
                        color: getComponentColor(),
                    },
                },
            };
            return newData;
        });
    };

    return (
        <div id="main-container" onDoubleClick={handleDoubleClick}>
            {Object.entries(transcriptData.content).map(([key, data]) => {
                if (data.type === 'label') {
                    const labelStyle = {
                        position: 'absolute',
                        left: `${data.x}px`,
                        top: `${data.y}px`,
                    };
                    return (
                        <Draggable
                            nodeRef={nodeRef}
                            defaultPosition={{ x: data.x, y: data.y }}
                            key={data.id}
                            onDrag={(e, dragData) => handleDrag(e, dragData, key)}
                            bounds="parent"
                        >
                            <div ref={nodeRef} data-height-id={data.id} className='draggable-response-label' style={labelStyle}>

                                <Typography
                                    //prevents creation of a new line when pressing the 'enter' button
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); } }}
                                    style={{ backgroundColor: data.color }} id={data.id} className='draggable-response-label-child' contentEditable={!data.removed} suppressContentEditableWarning={true} variant="h6"
                                    onBlur={() => {
                                        let text = document.getElementById(data.id).innerHTML;
                                        if (text === "" || text === `<br>`) { removeLabel(key) }
                                    }}
                                >
                                    {data.clusterLabelA4}
                                </Typography>

                            </div>
                        </Draggable>
                    )


                } else if (data.response_id) {
                    return Object.entries(data.response_text).map(([responseKey, responseData]) => {
                        if (responseData.clusterData) {
                            console.log(responseData)
                            const componentStyle = {
                                position: 'absolute',
                                left: `${responseData.clusterData.x}px`,
                                top: `${responseData.clusterData.y}px`,
                                backgroundColor: responseData.clusterData.color ? responseData.clusterData.color : "#F5F5F4",
                                border: 'none',
                            };

                            return (
                                <Draggable
                                    defaultPosition={{ x: responseData.clusterData.x, y: responseData.clusterData.y }}
                                    key={responseData.clusterData.id}
                                    onDrag={(e, d) => handleDrag(e, d, key, responseKey)}
                                    bounds="parent"
                                    nodeRef={nodeRef}
                                >
                                    <div ref={nodeRef} data-height-id={responseData.clusterData.id} className='draggable-response' style={componentStyle} >

                                        <div className='copy-delete-section'>
                                            <Button variant="outlined" onClick={() => handleCreateCopy(key, responseKey)} className='create-copy-button'>+</Button>
                                            {responseData.clusterData.type === "text-copy" && <Button variant="outlined" onClick={() => handleDeleteCopy(key, responseKey)} className='create-delete-button'>-</Button>}
                                        </div>

                                        <Tooltip title={data.response_text[responseKey].text}>
                                            <Typography style={{ paddingTop: "5px" }} id={responseData.clusterData.id} fontSize={13}>
                                                {data.response_text[responseKey].text}
                                            </Typography>
                                        </Tooltip>

                                    </div>
                                </Draggable>
                            )
                        }
                    })
                }
            })}
        </div>
    )

}

export default DisplayTranscriptGraphically