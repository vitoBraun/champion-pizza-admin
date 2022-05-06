import React from 'react';
import {Button} from 'react-bootstrap'

const SubmitButton = ({submitFunc, buttonDisabled=null, buttonText}) => {
    return (
        <><Button 
        className="mx-md-n5"
        onClick={submitFunc} 
        disabled={buttonDisabled}>
        {buttonText}
      </Button></>
    );
};

export default SubmitButton;