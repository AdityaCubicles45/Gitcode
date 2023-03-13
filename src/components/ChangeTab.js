export default function ChangeTab(props){
    return(
        <div className="change-tab">

            <div className="tab-btn-div">
            <img className = "collab"alt="collab" width="100"  height="100" src="./images/collaboration.png"></img>
            <button className="tab-btn" onClick={props.meeting}>
                CodeTogether
            </button>
         
            </div>
            <div className="tab-btn-div">
            <img className = "upload"alt="upload" width="100"  height="100" src="./images/upload-file.png"></img>
            <button className="tab-btn" onClick={props.addfile}>
                Upload File
            </button>
    
            </div>
            <div className="tab-btn-div">
            <img className = "addFile"alt="addFile" width="100"  height="100" src="./images/add_file.png"></img>
            <button className="tab-btn" onClick={props.editor}>
                New File
            </button>
            </div>
            <div>
            <button className='back-btn' onClick={props.goback}>{" Back "}</button>
            </div>
        </div>
    )
}