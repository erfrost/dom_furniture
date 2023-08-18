import styles from "@/Admin styles/Feedbacks.module.css";
import AdminModal from "@/AdminComponents/AdminModal/AdminModal";
import AdminNav from "@/AdminComponents/AdminNav/AdminNav";
import AlertError from "@/AdminComponents/AlertError/AlertError";
import AlertSuccess from "@/AdminComponents/AlertSuccess/AlertSuccess";
import AlertWarning from "@/AdminComponents/AlertWarning/AlertWarning";
import axiosInstance from "@/axios.config";
import { CloseIcon } from "@chakra-ui/icons";
import { IconButton, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

const Index = ({ feedbacks, error }) => {
  const [allFeedbacks, setAllFeedbacks] = useState(feedbacks);
  const [currentFeedbackId, setCurrentFeedbackId] = useState(undefined);
  const [reqError, setReqError] = useState(error);
  const [success, setSuccess] = useState(null);
  const [warning, setWarning] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = async () => {
    setReqError(null);
    setSuccess(null);
    if (currentFeedbackId) {
      try {
        await axiosInstance.delete(`feedback/${currentFeedbackId}`);

        setSuccess("Отзыв успешно удален");
        setAllFeedbacks((prevState) =>
          prevState.filter((item) => item._id !== currentFeedbackId)
        );
      } catch (error) {
        setReqError(
          error?.response?.data?.message ||
            "Произошла ошибка запроса. Попробуйте позднее"
        );
      }
    } else setWarning("Отзыв не выбран");
  };

  return (
    <div className={styles.container}>
      <AdminNav />
      {allFeedbacks.length ? (
        <div className={styles.list}>
          {allFeedbacks?.map((item) => (
            <div className={styles.listContainer} key={item._id}>
              <div className={styles.itemList}>
                <div className={styles.name}>{item.name}</div>
                <div className={styles.text}>{item.text}</div>
              </div>
              <IconButton
                className={styles.btn}
                onClick={(e) => {
                  onOpen(e);
                  setCurrentFeedbackId(item._id);
                }}
              >
                <CloseIcon className={styles.icon} />
              </IconButton>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.nullLength}>Не найдено ни одного отзыва</div>
      )}
      <AdminModal
        text="отзыв"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
      />
      {reqError && <AlertError text={reqError} />}
      {success && <AlertSuccess text={success} />}
      {warning && <AlertWarning text={warning} />}
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const res = await axiosInstance.get("feedback");

    return {
      props: {
        feedbacks: res.data,
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

export default Index;
