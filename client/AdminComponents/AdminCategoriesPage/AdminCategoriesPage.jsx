import { Input } from "@chakra-ui/react";
import styles from "./AdminCategoriesPage.module.css";
import UploadImage from "../UploadImage/UploadImage";
import Image from "next/image";
import { MAX_TITLE_CHARACTERS } from "@/config";

const AdminCategoriesPage = ({
  title,
  setTitle,
  setWarning,
  handleFileChange,
  originalImage,
  currentImage,
  onSubmit,
  btnText,
}) => {
  return (
    <div className={styles.content}>
      <Input
        width="100%"
        placeholder="Название"
        value={title}
        onChange={(e) => {
          setTitle((prevState) => {
            if (e.target.value.length > MAX_TITLE_CHARACTERS) {
              return prevState;
            } else return e.target.value;
          });
          setWarning(null);
        }}
      />
      <div className={styles.imageContainer}>
        <UploadImage onChangeFunction={handleFileChange} />
        {currentImage && (
          <Image
            src={currentImage}
            alt="Current image"
            width={250}
            height={250}
            className={styles.image}
          />
        )}
        {originalImage && (
          <Image
            src={"http://localhost:8080/images/" + originalImage}
            alt="Current image"
            width={250}
            height={250}
            className={styles.image}
          />
        )}
      </div>
      <div className={styles.btn} onClick={onSubmit}>
        {btnText}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
