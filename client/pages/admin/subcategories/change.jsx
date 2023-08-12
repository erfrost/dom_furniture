import AdminCategoriesPage from "@/AdminComponents/AdminCategoriesPage/AdminCategoriesPage";
import AdminNav from "@/AdminComponents/AdminNav/AdminNav";
import AlertError from "@/AdminComponents/AlertError/AlertError";
import AlertSuccess from "@/AdminComponents/AlertSuccess/AlertSuccess";
import AlertWarning from "@/AdminComponents/AlertWarning/AlertWarning";
import SubcategorySelect from "@/AdminComponents/SubcategorySelect/SubcategorySelect";
import axiosInstance from "@/axios.config";
import styles from "@/Admin styles/Categories.module.css";
import { useEffect, useState } from "react";

const Change = ({ categories, error }) => {
  const [title, setTitle] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [currentSubcategory, setCurrentSubcategory] = useState(undefined);
  const [subcategoryId, setSubcategoryId] = useState(undefined);
  const [categoryId, setCategoryId] = useState(undefined);
  const [file, setFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [reqError, setReqError] = useState(error);
  const [warning, setWarning] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function fetchSubcategories() {
      if (categoryId) {
        setReqError(null);
        try {
          const res = await axiosInstance.get(`/subcategories/${categoryId}`);
          console.log(res.data);
          setSubcategories(res.data);
        } catch (error) {
          console.log(error);
          setReqError(
            error?.response?.data?.message ||
              "Произошла ошибка запроса. Попробуйте позднее"
          );
        }
      }
    }
    fetchSubcategories();
  }, [categoryId]);

  useEffect(() => {
    if (subcategoryId) {
      setCurrentImage(null);
      const subcategory = subcategories.find(
        (cat) => cat._id === subcategoryId
      );
      setTitle(subcategory.title);
      setOriginalImage(subcategory.photo_name);

      setCurrentSubcategory(subcategory);
    }
  }, [subcategoryId]);

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
    if (subcategoryId && (title || file)) {
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
        console.log(photos.data);
        const res = await axiosInstance.patch(
          `admin/subcategories/${subcategoryId}`,
          {
            title: title || currentSubcategory.title,
            photo_name: photos.data.length
              ? photos.data
              : [currentSubcategory.photo_name],
          }
        );
        console.log(res);
        setSuccess("Подкатегория успешно обновлена");
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
        <SubcategorySelect
          categories={categories}
          subcategories={subcategories}
          setCategoryId={setCategoryId}
          setSubcategoryId={setSubcategoryId}
        />
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
      {error && <AlertError text={error} />}
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

export default Change;
