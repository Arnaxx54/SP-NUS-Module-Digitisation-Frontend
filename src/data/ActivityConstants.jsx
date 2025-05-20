export const activityOneDefaultInstruction = 'Use the text boxes below to provide the details of your interview transcript. After you fill in the boxes, click the Preview button to see how the transcript looks before proceeding to the next activity. If you would like to make any changes you can do so by editing the transcript text directly. Click the Submit button when you are satisfied with the look of your interview transcript. The final version of your transcript will be used in the next activity.'
export const activityTwoDefaultInstruction = 'Read through the transcript and click on sentences from the <strong>interviewee</strong> that you think provide insights or convey important information. Clicking a sentence will highlight it in yellow. Clicking a highlighted sentence again will unhighlight it. When you are satisfied with your sentence selections, click the Submit button to continue to the next activity. Your choices of which sentences to highlight will be carried forward to the next activity.'
export const activityThreeDefaultInstruction =
    `<Typography>The transcript you submitted was passed through an AI model trained to identify important sentences. The model’s sentence selection was then compared with yours. The sentences you and the model both selected are now highlighted in green. Sentences that the model classified as being important but you did not are highlighted in blue. Sentences you selected as being important but the model did not are highlighted in yellow.</Typography>
<br/> <br/>
<Typography>Please review the version of your transcript with the new highlights below. You’ll likely agree with some of the sentence selections and disagree with others. As you review the transcript, feel free to refine your sentence selections. When you are satisfied with your selections, click the Submit button to continue to the next activity. Only your choices about which sentences are important (yellow and green highlights) will be used in the next activity.</Typography>
<br/> <br/>
<Typography>You can refer to the following key to remind yourself of what the three colours mean.</Typography>
<ul style={{ marginTop: 0 }}>
    <li><Typography>Only the model selected - blue</Typography></li>
    <li><Typography>Only you selected - yellow</Typography></li>
    <li><Typography>Both you and the model selected - green</Typography></li>
</ul>`
export const activityFourDefaultInstruction =
    `<Typography>The sentences you selected in the previous activity have been arranged on the left side of the pane below. Use the space below to cluster the sentences into themes by arranging the sentences that go together near each other. It’s okay if the sentences in a cluster overlap a bit.</Typography>
      <br />
      <br />
      <Typography>You can then name the cluster by clicking the Add Label button to create a new text box. You can edit the label text by clicking on its text. You can drag the label anywhere in the clustering area by clicking and holding the label area. You can remove a label from the clustering area by deleting all of its text.</Typography>
      <br />
      <br />
      <Typography>Once you are satisfied with your clusters and their labels, you can save everything by clicking the Submit button. Once submitted, your clusters and labels will be used in the next activity.</Typography>`
export const activityFiveDefaultInstruction =
    `<Typography>For this activity, you will see two views of your clusters and labels. In the User view, you will see the arrangement you submitted in the previous activity or the arrangement you are currently working on. In the Alternative view, you will see how the AI model would have clustered the sentences you selected. The Alternative view does not provide labels for the clusters, but you might be able to infer them yourself.</Typography>
      <br />
      <br />
      <Typography>Compare the two arrangement and refine the arrangement in the User view in anyway that you feel improves it. When you are satisfied with the arrangement in the User view, click the Submit button to continue to the next activity.</Typography>`
export const activitySixDefaultInstruction =
    `<Typography>The sentences and cluster labels you submitted for the previous activity have been arranged in the space below. For each cluster, add any number of insights that you think emerge from the selected sentences. After surfacing the insights, add a set of needs that relate to those insights one at a time. Identifying the insights and needs should be helpful when designing your prototype.</Typography>
      <br/>
      <br/>
      <Typography>When you are satisfied with your listed insights and needs, click the Submit button to complete this stage of the design thinking process. You can come back and make changes to your submissions whenever you like.</Typography>`

export const activityOneDefaultLabel = 'Activity 1 Label'
export const activityTwoDefaultLabel = 'Activity 2 Label'
export const activityThreeDefaultLabel = 'Activity 3 Label'
export const activityFourDefaultLabel = 'Activity 4 Label'
export const activityFiveDefaultLabel = 'Activity 5 Label'
export const activitySixDefaultLabel = 'Activity 6 Label'

export const noTranscriptData = 'No transcript has been displayed since no data was entered in Activity 1.'

export const userSelectedHighlightingColor = 'rgb(255, 199, 44)'
export const modelSelectedHighlightingColor = 'rgb(23, 177, 105)'
export const userAndModelSelectedHighlightingColor = 'rgb(108, 180, 238)'

export const userSelectedHighlightingColorCheck = new RegExp("background-color: rgb\\(\\s*255\\s*,\\s*199\\s*,\\s*44\\s*\\)", "g")
export const modelSelectedHighlightingColorCheck = new RegExp("background-color: rgb\\(\\s*23\\s*,\\s*177\\s*,\\s*105\\s*\\)", "g");
export const userAndModelSelectedHighlightingColorCheck = new RegExp("background-color: rgb\\(\\s*108\\s*,\\s*180\\s*,\\s*238\\s*\\)", "g");

export const componentWidth = 120
export const componentHeight = 70
export const numberOfComponentsPerRow = 2
