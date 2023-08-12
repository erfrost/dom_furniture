import { Alert, AlertIcon } from "@chakra-ui/react";
import styles from "./AlertSuccess.module.css";

const AlertSuccess = ({ text }) => {
  return (
    <Alert status="success" className={styles.alert}>
      <AlertIcon />
      {text}
    </Alert>
  );
};

export default AlertSuccess;
