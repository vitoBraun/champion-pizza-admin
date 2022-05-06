import React from "react";
import { Alert } from "react-bootstrap";

const AlertBlock = ({ notice = false, noticeError = false }) => {
  return (
    <>
      {noticeError && (
        <Alert variant="danger" style={{ marginTop: "20px" }}>
          {noticeError}
        </Alert>
      )}
      {notice && (
        <Alert variant="success" style={{ marginTop: "20px" }}>
          {notice}
        </Alert>
      )}
    </>
  );
};

export default AlertBlock;
