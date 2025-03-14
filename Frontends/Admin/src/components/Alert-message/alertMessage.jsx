import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import "./alertMessage.scss"; // Import the external CSS file
import { Box } from "@mui/material";

// Function for Slide Animation (Right to Left)
function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}

const AlertMessage = ({ open, message, onClose, severity }) => {
  // Set the error title based on severity
  const errorTitle =
    severity === "error" ? "Error!" : severity === "success" ? "Success!" : "";

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={TransitionLeft}
      className={`custom-snackbar ${severity}`}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "399px",
          height: "72px",
          position: "relative",
          paddingTop: "0px",
          boxSizing: "border-box",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "0px",
            left: "25%",
            width: "50%",
            height: "5px",
            borderTopLeftRadius: "10px",
            backgroundColor: severity === "error" ? "#e00d02" : "#2da131",
            transform: "translateX(-50%)",
          },
        }}
        icon={false}
      >
        {severity === "error" ? (
          <>
            <strong className="error-title">{errorTitle}</strong>
            <br />
            <span className="error-message">{message}</span>
          </>
        ) : severity === "success" ? (
          <>
            <strong className="success-title">{errorTitle}</strong>
            <br />
            <span className="success-message">{message}</span>
          </>
        ) : (
          message
        )}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage;
