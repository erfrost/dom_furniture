import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import styles from "./AlertError.module.css";

const AlertError = ({ text }) => {
  return (
    <Alert status="error" className={styles.alert}>
      <AlertIcon />
      <AlertTitle>Произошла ошибка:</AlertTitle>
      <AlertDescription>{text}</AlertDescription>
    </Alert>
  );
};

export default AlertError;
