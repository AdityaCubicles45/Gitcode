export default function Navbar(props){
    const add = props.address.slice(0,4)+"...."+props.address.slice(-4);
    console.log(add)
    return(
        <div className ="navbar">
            {/* <div className="brand"> */}

            <img alt="brand logo" className="brand-name" src="./images/logo.png"></img>

            <div className="avatar">

            <img alt="avatar1" width="50" height="50" src="./images/avatar.png"></img>

            <button className="btn-grad" onClick={props.walletConnected?props.disconnect:props.connectWallet}>
            {props.walletConnected?add:"Connect Wallet"}
            </button>
            </div>
        </div>
    )
}