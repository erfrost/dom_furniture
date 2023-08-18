import AdminModal from "@/AdminComponents/AdminModal/AdminModal";
import AdminNav from "@/AdminComponents/AdminNav/AdminNav";
import AlertError from "@/AdminComponents/AlertError/AlertError";
import AlertSuccess from "@/AdminComponents/AlertSuccess/AlertSuccess";
import AlertWarning from "@/AdminComponents/AlertWarning/AlertWarning";
import axiosInstance from "@/axios.config";
import CategorySelect from "@/AdminComponents/CategorySelect/CategorySelect";
import styles from "@/Admin styles/Categories.module.css";
import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

const Delete = ({ categories, error }) => {
  const [categoryId, setCategoryId] = useState(undefined);
  const [reqError, setReqError] = useState(error);
  const [warning, setWarning] = useState(null);
  const [success, setSuccess] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = async () => {
    if (categoryId) {
      try {
        setReqError(null);
        setSuccess(null);
        setWarning(null);

        await axiosInstance.delete(`admin/categories/${categoryId}`);

        setSuccess("Категория успешно удалена");
      } catch (error) {
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
        <CategorySelect categories={categories} setCategoryId={setCategoryId} />
        <div className={styles.btn} onClick={onOpen}>
          Удалить категорию
        </div>
        <AdminModal
          text="категорию"
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={onSubmit}
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

export default Delete;
