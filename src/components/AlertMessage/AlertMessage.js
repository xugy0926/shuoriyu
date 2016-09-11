import React from 'react';
import { Alert,} from 'react-bootstrap';

function AlertMessage({ message, style, ...props }) {
	if (!style) {
		style = 'danger';
	}
    return (
      <Alert bsStyle={style}>
        {message}
      </Alert>
    );
  }

export default AlertMessage;