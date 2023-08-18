import {
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Textarea,
} from "@chakra-ui/react";
import AdminNav from "../AdminNav/AdminNav";
import styles from "./AdminItemPage.module.css";
import { CloseIcon, PlusSquareIcon } from "@chakra-ui/icons";
import Image from "next/image";
import AlertError from "../AlertError/AlertError";
import AlertWarning from "../AlertWarning/AlertWarning";
import AlertSuccess from "../AlertSuccess/AlertSuccess";
import { useEffect, useState } from "react";
import axiosInstance from "@/axios.config";

const AdminItemPage = ({ categories }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(undefined);
  const [subcategoryId, setSubcategoryId] = useState(undefined);
  const [price, setPrice] = useState(null);
  const [specifications, setSpecifications] = useState([]);
  const [specificationTitle, setSpecificationTitle] = useState("");
  const [specificationValue, setSpecificationValue] = useState("");
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [reqError, setReqError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function fetchSubcategories() {
      if (!subcategoryId && categoryId) {
        setReqError(null);
        try {
          const res = await axiosInstance.get(`/subcategories/${categoryId}`);
          console.log(res);
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

  const addSpecification = () => {
    setWarning(null);
    if (specificationTitle && specificationValue) {
      setSpecifications((prevState) => [
        ...prevState,
        { title: specificationTitle, value: specificationValue },
      ]);
      setSpecificationTitle("");
      setSpecificationValue("");
    } else setWarning("Поля не должны быть пустыми");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFiles((prevState) => [...prevState, e.target.files[0]]);

    const reader = new FileReader();
    reader.onload = () => {
      setImages((prevState) => [...prevState, reader.result]);
    };
    reader.readAsDataURL(selectedFile);
  };

  const onSubmit = async (e) => {
    setSuccess(null);

    const formData = new FormData();
    files.map((img, index) => formData.append(`image_${index}`, img));

    try {
      const { data } = await axiosInstance.post("admin/uploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const res = await axiosInstance.post("admin/items", {
        title,
        description,
        price,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        specifications: specifications,
        photo_names: data,
      });
      setReqError(null);
      setSuccess(res.data.message);
    } catch (error) {
      setReqError(
        error?.response?.data?.message ||
          "Произошла ошибка запроса. Попробуйте позднее"
      );
    }
  };

  return (
    <div className={styles.container}>
      <AdminNav />
      <div className={styles.main}>
        <div className={styles.forms}>
          <Input
            placeholder="Название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Описание товара"
            resize="none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className={styles.selects}>
            <Select
              className={styles.selectsItem}
              placeholder="Категория"
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories?.map((cat) => (
                <option value={cat._id} key={cat._id}>
                  {cat.title}
                </option>
              ))}
            </Select>
            <Select
              className={styles.selectsItem}
              placeholder="Подкатегория"
              disabled={!subcategories.length && true}
              onChange={(e) => setSubcategoryId(e.target.value)}
            >
              {subcategories?.map((subcat) => (
                <option value={subcat._id} key={subcat._id}>
                  {subcat.title}
                </option>
              ))}
            </Select>
            <NumberInput className={styles.price}>
              <NumberInputField
                onChange={(e) => setPrice(Number(e.target.value))}
                value={price}
                placeholder="Price"
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </div>
          <div className={styles.specificationsContainer}>
            {specifications.length > 0 && (
              <div className={styles.specificationsItems}>
                {specifications?.map((item, index) => (
                  <div className={styles.item} key={index}>
                    <span className={styles.title}>{item.title}:</span>
                    <span className={styles.value}>{item.value}</span>
                    <IconButton className={styles.iconBtn}>
                      <CloseIcon boxSize="40%" />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.specificationsInputs}>
              <Input
                placeholder="Характеристика"
                value={specificationTitle}
                onChange={(e) => setSpecificationTitle(e.target.value)}
              />
              <Input
                placeholder="Значение"
                value={specificationValue}
                onChange={(e) => setSpecificationValue(e.target.value)}
              />
            </div>
            <div
              className={styles.specificationsBtn}
              onClick={addSpecification}
            >
              Добавить характеристику
            </div>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <form className={styles.uploadForm}>
            <input
              type="file"
              className={styles.avatarInput}
              onChange={handleFileChange}
            />
            <PlusSquareIcon className={styles.uploadIcon} boxSize="25%" />
          </form>
          {images.length > 0 && (
            <div className={styles.imagesList}>
              {images?.map((img, index) => (
                <Image
                  src={img}
                  alt="Uploaded"
                  width="300"
                  height="300"
                  key={index}
                  className={styles.image}
                />
              ))}
            </div>
          )}
          <div className={styles.submitBtn} onClick={onSubmit}>
            Добавить товар
          </div>
        </div>
      </div>
      {reqError && <AlertError text={reqError} />}
      {warning && <AlertWarning text={warning} />}
      {success && <AlertSuccess text={success} />}
    </div>
  );
};

export default AdminItemPage;
