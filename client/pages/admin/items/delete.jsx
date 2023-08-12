import AdminItemSelect from "@/AdminComponents/AdminItemSelect/AdminItemSelect";
import AdminModal from "@/AdminComponents/AdminModal/AdminModal";
import AdminNav from "@/AdminComponents/AdminNav/AdminNav";
import AlertError from "@/AdminComponents/AlertError/AlertError";
import AlertSuccess from "@/AdminComponents/AlertSuccess/AlertSuccess";
import AlertWarning from "@/AdminComponents/AlertWarning/AlertWarning";
import axiosInstance from "@/axios.config";
import styles from "@/Admin styles/ItemsDelete.module.css";
import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Delete = ({ categories, error }) => {
  const [categoryId, setCategoryId] = useState(undefined);
  const [subcategoryId, setSubcategoryId] = useState(undefined);
  const [subcategories, setSubcategories] = useState([]);
  const [itemId, setItemId] = useState(undefined);
  const [items, setItems] = useState([]);
  const [reqError, setReqError] = useState(error);
  const [warning, setWarning] = useState(null);
  const [success, setSuccess] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    async function fetchSubcategories() {
      if (categoryId) {
        setItems([]);
        setSubcategoryId(undefined);
        setItemId(undefined);
        setReqError(null);
        try {
          const res = await axiosInstance.get(`/subcategories/${categoryId}`);
          setSubcategories(res.data);
        } catch (error) {
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
    async function fetchItems() {
      if (subcategoryId) {
        setItemId(undefined);
        setItems([]);
        setReqError(null);
        try {
          const res = await axiosInstance.get(
            `/items/by_subcategory/${subcategoryId}`
          );
          setItems(res.data);
        } catch (error) {
          setReqError(
            error?.response?.data?.message ||
              "Произошла ошибка запроса. Попробуйте позднее"
          );
        }
      }
    }
    fetchItems();
  }, [subcategoryId]);

  const handleClick = (e) => {
    setWarning(null);
    if (itemId) {
      onOpen(e);
    } else setWarning("Товар не выбран");
  };

  const onSubmit = async () => {
    if (itemId) {
      setReqError(null);
      setSuccess(null);
      setWarning(null);

      try {
        const res = await axiosInstance.delete(`admin/items/${itemId}`);
        console.log(res);
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
        <AdminItemSelect
          title="Выберите товар для его удаления"
          categories={categories}
          itemCatId={categoryId}
          setItemCatId={setCategoryId}
          itemSubcatId={subcategoryId}
          setItemSubcatId={setSubcategoryId}
          itemSubcategories={subcategories}
          currentItemId={itemId}
          setCurrentItemId={setItemId}
          items={items}
        />
        <div className={styles.btn} onClick={(e) => handleClick(e)}>
          Удалить товар
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
    const res = await axiosInstance.get("/categories");

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
