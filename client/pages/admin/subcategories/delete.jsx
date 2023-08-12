import AdminModal from "@/AdminComponents/AdminModal/AdminModal";
import AdminNav from "@/AdminComponents/AdminNav/AdminNav";
import AlertError from "@/AdminComponents/AlertError/AlertError";
import AlertSuccess from "@/AdminComponents/AlertSuccess/AlertSuccess";
import AlertWarning from "@/AdminComponents/AlertWarning/AlertWarning";
import SubcategorySelect from "@/AdminComponents/SubcategorySelect/SubcategorySelect";
import axiosInstance from "@/axios.config";
import styles from "@/Admin styles/Categories.module.css";
import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Delete = ({ categories, error }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [categoryId, setCategoryId] = useState(undefined);
  const [subcategoryId, setSubcategoryId] = useState(undefined);
  const [reqError, setReqError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [success, setSuccess] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const onSubmit = async () => {
    if (subcategoryId) {
      try {
        setReqError(null);
        setSuccess(null);
        setWarning(null);

        const res = await axiosInstance.delete(
          `admin/subcategories/${subcategoryId}`
        );

        setSuccess(res.data.message);
      } catch (error) {
        console.log(error);
        setReqError(
          error?.response?.data?.message ||
            "Произошла ошибка запроса. Попробуйте позднее"
        );
      }
    }
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
        <div className={styles.btn} onClick={onOpen}>
          Удалить подкатегорию
        </div>
      </div>
      <AdminModal
        text="подкатегорию"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
      />
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

export default Delete;
