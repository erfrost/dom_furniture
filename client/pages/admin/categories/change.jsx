import AdminCategoriesPage from "@/AdminComponents/AdminCategoriesPage/AdminCategoriesPage";
import AdminNav from "@/AdminComponents/AdminNav/AdminNav";
import AlertError from "@/AdminComponents/AlertError/AlertError";
import AlertSuccess from "@/AdminComponents/AlertSuccess/AlertSuccess";
import AlertWarning from "@/AdminComponents/AlertWarning/AlertWarning";
import CategorySelect from "@/AdminComponents/CategorySelect/CategorySelect";
import axiosInstance from "@/axios.config";
import styles from "@/Admin styles/Categories.module.css";
import { useEffect, useState } from "react";

const Change = ({ categories, error }) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(undefined);
  const [categoryId, setCategoryId] = useState(undefined);
  const [currentCategory, setCurrentCategory] = useState(undefined);
  const [reqError, setReqError] = useState(error);
  const [warning, setWarning] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (categoryId) {
      setCurrentImage(null);
      const category = categories.find((cat) => cat._id === categoryId);
      setTitle(category.title);
      setOriginalImage(category.photo_name);

      setCurrentCategory(category);
    }
  }, [categoryId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile instanceof Blob) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = () => {
        setCurrentImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setOriginalImage(undefined);
    }
  };

  const onSubmit = async (e) => {
    if (categoryId && (title || file)) {
      setReqError(null);
      setSuccess(null);
      setWarning(null);

      const formData = new FormData();
      formData.append(`image`, file);
      try {
        const photos = await axiosInstance.post("admin/uploadImage", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        await axiosInstance.patch(`admin/categories/${categoryId}`, {
          title: title || currentCategory.title,
          photo_name: photos.data.length
            ? photos.data
            : [currentCategory.photo_name],
        });
        setSuccess("Категория успешно обновлена");
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
          originalImage={originalImage}
          currentImage={currentImage}
          onSubmit={onSubmit}
          btnText="Обновить категорию"
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
        errorr: "Произошла ошибка при получении данных",
      },
    };
  }
}

export default Change;
