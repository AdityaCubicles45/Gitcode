export default function ChangeTab(props){
    return(
        <div className="change-tab">

            <div className="tab-btn-div">

            <button className="tab-btn" onClick={props.meeting}>
                CodeTogether
            </button>
            {/* <img src="./images/meet.png"></img> */}
            </div>
            <div className="tab-btn-div">

            <button className="tab-btn" onClick={props.addfile}>
                Upload File
            </button>
            {/* <img src="./images/add-file.png"></img> */}
            </div>
            <div className="tab-btn-div">

            <button className="tab-btn" onClick={props.editor}>
                New File
            </button>

            <button className='back-btn' onClick={props.goback}>{" Back "}</button>
            {/* <img src="./images/add-file.png"></img> */}
            </div>


        </div>
    )
}