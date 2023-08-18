import styles from "@/Admin styles/NewsAdd.module.css";
import AdminNav from "@/AdminComponents/AdminNav/AdminNav";
import AlertError from "@/AdminComponents/AlertError/AlertError";
import AlertSuccess from "@/AdminComponents/AlertSuccess/AlertSuccess";
import AlertWarning from "@/AdminComponents/AlertWarning/AlertWarning";
import UploadImage from "@/AdminComponents/UploadImage/UploadImage";
import axiosInstance from "@/axios.config";
import Image from "next/image";
import { useState } from "react";

const Add = () => {
  const [file, setFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [reqError, setReqError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile instanceof Blob) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = () => {
        setCurrentImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const onSubmit = async () => {
    if (file) {
      setReqError(null);
      setSuccess(null);
      setWarning(null);

      const formData = new FormData();
      formData.append(`image`, file);
      try {
        const res = await axiosInstance.post(`admin/news`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res);
        setSuccess("Новость успешно добавлена");
      } catch (error) {
        console.log(error);
        setReqError(
          error?.response?.data?.message ||
            "Произошла ошибка запроса. Попробуйте позднее"
        );
      }
    } else setWarning("Не все поля заполнены");
  };

  return (
    <div className={styles.container}>
      <AdminNav />
      <div className={styles.content}>
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
        </div>
        <div className={styles.btn} onClick={onSubmit}>
          Добавить новость
        </div>
      </div>
      {reqError && <AlertError text={reqError} />}
      {warning && <AlertWarning text={warning} />}
      {success && <AlertSuccess text={success} />}
    </div>
  );
};

export default Add;
