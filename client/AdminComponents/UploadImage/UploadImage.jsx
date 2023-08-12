import { PlusSquareIcon } from "@chakra-ui/icons";
import styles from "./UploadImage.module.css";

const UploadImage = ({ onChangeFunction }) => {
  return (
    <form className={styles.uploadForm}>
      <input
        type="file"
        accept=".jpg, .jpeg, .png, .webp"
        className={styles.imageInput}
        onChange={onChangeFunction}
      />
      <PlusSquareIcon className={styles.uploadIcon} boxSize="25%" />
    </form>
  );
};

export default UploadImage;
