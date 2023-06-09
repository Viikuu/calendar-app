import "./Modal.css";
interface ModalProps {
  show: boolean,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
  children: React.ReactNode,
}

export const Modal: React.FC<ModalProps> = (props) => {

  return <>
    {props.show ? <div className="modal">
      
      <div className="modal-content">
        <button className="closeModal xButton" onClick={() => {
            props.setShow(false);
        }}
        > X </button>

        <div>
          {props.children}
        </div>
      </div>
    </div> : null}
    </>;
  
}