import AdminCategoriesPage from "@/AdminComponents/AdminCategoriesPage/AdminCategoriesPage";
import AdminNav from "@/AdminComponents/AdminNav/AdminNav";
import AlertError from "@/AdminComponents/AlertError/AlertError";
import AlertSuccess from "@/AdminComponents/AlertSuccess/AlertSuccess";
import AlertWarning from "@/AdminComponents/AlertWarning/AlertWarning";
import CategorySelect from "@/AdminComponents/CategorySelect/CategorySelect";
import axiosInstance from "@/axios.config";
import styles from "@/Admin styles/Categories.module.css";
import { useState } from "react";

const Add = ({ categories, error }) => {
  const [categoryId, setCategoryId] = useState(undefined);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [reqError, setReqError] = useState(error);
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

  const onSubmit = async (e) => {
    if (title && file) {
      setReqError(null);
      setSuccess(null);
      setWarning(null);

      const formData = new FormData();
      formData.append(`image`, file);
      formData.append("title", title || currentSubcategory.title);
      formData.append("category_id", categoryId);
      try {
        await axiosInstance.post("admin/subcategories", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Подкатегория успешно добавлена");
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
        <CategorySelect categories={categories} setCategoryId={setCategoryId} />
        <AdminCategoriesPage
          title={title}
          setTitle={setTitle}
          setWarning={setWarning}
          handleFileChange={handleFileChange}
          currentImage={currentImage}
          onSubmit={onSubmit}
          btnText="Добавить подкатегорию"
        />
      </div>
      {reqError && <AlertError text={reqError} />}
      {warning && <AlertWarning text={warning} />}
      {success && <AlertSuccess text={success} />}
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const res = await axiosInstance.get("categories");

    return {
      props: {
        categories: res.data,
      },
    };
  } catch (error) {
    return {
      props: {
        error: "Произошла ошибка при получении данных",
      },
    };
  }
}

export default Add;
