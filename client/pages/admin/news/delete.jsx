import styles from "@/Admin styles/NewsDelete.module.css";
import AdminNav from "@/AdminComponents/AdminNav/AdminNav";
import AlertError from "@/AdminComponents/AlertError/AlertError";
import AlertSuccess from "@/AdminComponents/AlertSuccess/AlertSuccess";
import AlertWarning from "@/AdminComponents/AlertWarning/AlertWarning";
import axiosInstance from "@/axios.config";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import AdminModal from "@/AdminComponents/AdminModal/AdminModal";
import { useDisclosure } from "@chakra-ui/react";

const Delete = ({ news, error }) => {
  const [newsId, setNewsId] = useState(null);
  const [selectActive, setSelectActive] = useState(false);
  const [reqError, setReqError] = useState(error);
  const [warning, setWarning] = useState(null);
  const [success, setSuccess] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = async () => {
    if (newsId) {
      try {
        setReqError(null);
        setSuccess(null);
        setWarning(null);

        await axiosInstance.delete(`admin/news/${newsId}`);

        setSuccess("Новость успешно удалена");
      } catch (error) {
        setReqError(
          error?.response?.data?.message ||
            "Произошла ошибка запроса. Попробуйте позднее"
        );
      }
    }
  };
  console.log(newsId, warning);
  return (
    <div className={styles.container}>
      <AdminNav />
      <div className={styles.content}>
        <div className={styles.selectContainer}>
          <div
            className={styles.select}
            onClick={() => setSelectActive((prevState) => !prevState)}
          >
            {newsId ? "Новость выбрана" : "Выберите нужную новость"}
            <ChevronDownIcon fontSize="large" />
          </div>
          <motion.div
            className={styles.selectList}
            initial={{
              padding: 0,
              height: 0,
            }}
            animate={{
              padding: selectActive ? "10px 16px" : 0,
              height: selectActive ? "auto" : 0,
              y: "1px",
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          >
            {news?.map((item) => (
              <Image
                src={`http://localhost:8080/images/${item.photo_name}`}
                alt="image"
                width={300}
                height={150}
                key={item._id}
                className={styles.image}
                onClick={() => {
                  setNewsId(item._id);
                  setSelectActive(false);
                }}
              />
            ))}
          </motion.div>
        </div>
        <div
          className={styles.btn}
          onClick={(e) =>
            !newsId ? setWarning("Новость не выбрана") : onOpen(e)
          }
        >
          Удалить новость
        </div>
        <AdminModal
          text="новость"
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
    const res = await axiosInstance.get("news");

    return {
      props: {
        news: res.data,
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
