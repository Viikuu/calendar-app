import React from 'react';
import './AddEvent.css';
import { CreateEvent } from './CreateEvent/CreateEvent';
import { GeneratedEvent } from './GeneratedEvent/GeneratedEvent';


const possibleEvents= {
  Single: [
    'Travel',
    'Indoor Sports',
    'Outdoor Sports',
  ],
  Weekly: [
    'Work Meeting',
    'Sport',
    'Other'
  ],
  Monthly: [
    'Payday',
    'Other'
  ],
  Yearly: [
    'Birthday',
    'Other'
  ]
};

export const AddEvent: React.FC<{setShow:React.Dispatch<React.SetStateAction<boolean>>}> = ({setShow}) => {
  const [eventType, setEventType] = React.useState<string>('Travel');
  const [repetability, setRepetability] = React.useState<string>('Single');
  const [choosen, setChoosen] = React.useState<boolean>(false);

  function onChangeValue(event) {
    setRepetability(event.target.value);

    setEventType((event.target.value === 'Single' ?
            possibleEvents.Single[0]:
            (event.target.value === 'Weekly' ?
              possibleEvents.Weekly[0] :
              (event.target.value === 'Monthly' ?
                possibleEvents.Monthly[0] :
                possibleEvents.Yearly[0]))));
  }
  return (
    <div className='addEvent'>
      <div className='repetability' onChange={onChangeValue}>
        <label>Single</label>
        <input type="radio" value={'Single'} name="repetability" defaultChecked disabled={choosen} /> 
        <label>Weakly</label>
        <input type="radio" value={'Weekly'} name='repetability' disabled={choosen}/>
        <label>Monthly</label>
        <input type="radio" value={'Monthly'} name='repetability' disabled={choosen}/> 
        <label>Yearly</label>
        <input type="radio" value={'Yearly'} name='repetability' disabled={choosen}/> 
      </div>
      <div>
        <label>Type: </label>
        <select value={eventType} onChange={async (e) => {
          setEventType(e.target.value);
        }} name="eventType">
          {(repetability === 'Single' ?
            possibleEvents.Single :
            (repetability === 'Weekly' ?
              possibleEvents.Weekly :
              (repetability === 'Monthly' ?
                possibleEvents.Monthly :
                possibleEvents.Yearly))).map((event: any, index: number) => (
            <option key={index} value={event} disabled={repetability === 'Single' && choosen}>{event}</option>
          ))}
        </select>
      </div>
      <button onClick={async e => {
          setChoosen(true);
        }}  disabled= {choosen}>
        +
      </button>

      {choosen ?
        (
          <> { repetability === 'Single' ?
            (<GeneratedEvent eventType={eventType} setShow={setShow}/>) :
            (<CreateEvent eventType={eventType} repetability={repetability} setShow={setShow} />)}
          </>
        ) :
        (<></>)}
      
      </div>
  )
}