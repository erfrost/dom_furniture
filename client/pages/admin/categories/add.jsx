import AdminCategoriesPage from "@/AdminComponents/AdminCategoriesPage/AdminCategoriesPage";
import AdminNav from "@/AdminComponents/AdminNav/AdminNav";
import AlertError from "@/AdminComponents/AlertError/AlertError";
import AlertSuccess from "@/AdminComponents/AlertSuccess/AlertSuccess";
import AlertWarning from "@/AdminComponents/AlertWarning/AlertWarning";
import axiosInstance from "@/axios.config";
import styles from "@/Admin styles/Categories.module.css";
import { useState } from "react";

const Add = () => {
  const [title, setTitle] = useState("");
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
    } else {
      console.error("Selected file is not a Blob");
    }
  };

  const onSubmit = async (e) => {
    if (file && title) {
      setReqError(null);
      setSuccess(null);
      setWarning(null);

      const formData = new FormData();
      formData.append(`image`, file);
      formData.append("title", title);
      try {
        const res = await axiosInstance.post("admin/categories", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res);
        setSuccess("Категория успешно дабавлена");
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
        <AdminCategoriesPage
          title={title}
          setTitle={setTitle}
          setWarning={setWarning}
          handleFileChange={handleFileChange}
          currentImage={currentImage}
          onSubmit={onSubmit}
          btnText="Добавить категорию"
        />
      </div>
      {reqError && <AlertError text={reqError} />}
      {warning && <AlertWarning text={warning} />}
      {success && <AlertSuccess text={success} />}
    </div>
  );
};

export default Add;
