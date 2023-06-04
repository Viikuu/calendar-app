import "./Modal.css";
interface ModalProps {
  show: boolean,
  setShow: React.Dispatch<React.SetStateAction<any>>,
  children: React.ReactNode,
}

export const Modal: React.FC<ModalProps> = (props) => {

  return <>
    {props.show ? <div className="modal">
      <div className="modal-content">
      {props.children}
    
    <button className="closeModal xButton" onClick={e => {
            props.setShow(false);
         }}
        > X </button>
        </div>
    </div> : null}
    </>;
  
}