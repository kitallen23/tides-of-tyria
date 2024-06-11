import ReactDOM from "react-dom";

const Portal = ({ children, targetId }) => {
    const target = document.getElementById(targetId);
    return target ? ReactDOM.createPortal(children, target) : null;
};

export default Portal;
