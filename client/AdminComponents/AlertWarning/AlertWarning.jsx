import { Alert, AlertIcon } from "@chakra-ui/react";
import styles from "./AlertWarning.module.css";

const AlertWarning = ({ text }) => {
  return (
    <Alert status="warning" className={styles.alert}>
      <AlertIcon />
      {text}
    </Alert>
  );
};

export default AlertWarning;
