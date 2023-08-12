import axiosInstance from "@/axios.config";
import { CloseIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "@/Admin styles/ItemsAdd.module.css";
import UploadImage from "@/AdminComponents/UploadImage/UploadImage";
import AdminNav from "@/AdminComponents/AdminNav/AdminNav";
import AdminItemSelect from "@/AdminComponents/AdminItemSelect/AdminItemSelect";
import AlertError from "@/AdminComponents/AlertError/AlertError";
import AlertWarning from "@/AdminComponents/AlertWarning/AlertWarning";
import AlertSuccess from "@/AdminComponents/AlertSuccess/AlertSuccess";
import { MAX_DESCRIPTION_CHARACTERS, MAX_TITLE_CHARACTERS } from "@/config";

const Change = ({ categories, error }) => {
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
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [itemSubcategories, setItemSubcategories] = useState([]);
  const [itemCatId, setItemCatId] = useState(undefined);
  const [itemSubcatId, setItemSubcatId] = useState(undefined);
  const [currentItemId, setCurrentItemId] = useState(undefined);
  const [reqError, setReqError] = useState(error);
  const [warning, setWarning] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function fetchSubcategories() {
      if (categoryId) {
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
    async function fetchSubcategories() {
      if (itemCatId) {
        setItems([]);
        setItemSubcatId(undefined);
        setCurrentItemId(undefined);
        setReqError(null);
        try {
          const res = await axiosInstance.get(`/subcategories/${itemCatId}`);
          setItemSubcategories(res.data);
        } catch (error) {
          setReqError(
            error?.response?.data?.message ||
              "Произошла ошибка запроса. Попробуйте позднее"
          );
        }
      }
    }
    fetchSubcategories();
  }, [itemCatId]);

  useEffect(() => {
    async function fetchItems() {
      if (itemSubcatId) {
        setCurrentItemId(undefined);
        setItems([]);
        setReqError(null);
        try {
          const res = await axiosInstance.get(
            `/items/by_subcategory/${itemSubcatId}`
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
  }, [itemSubcatId]);

  useEffect(() => {
    async function getCurrentItem() {
      if (currentItemId) {
        try {
          const res = await axiosInstance.get(
            `items/by_itemId/${currentItemId}`
          );
          setCurrentItem(res.data);
        } catch (error) {
          setReqError(
            error?.response?.data?.message ||
              "Произошла ошибка запроса. Попробуйте позднее"
          );
        }
      }
    }
    getCurrentItem();
  }, [currentItemId]);

  useEffect(() => {
    if (currentItem) {
      setTitle(currentItem.title);
      setDescription(currentItem.description);
      setCategoryId(currentItem.category_id);
      setSubcategoryId(currentItem.subcategory_id);
      setPrice(currentItem.price);
      setSpecifications(currentItem.specifications);
    }
  }, [currentItem]);
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

  const onSpecificationRemove = (index) => {
    const updatedSpecifications = specifications.filter((el, i) => i !== index);
    setSpecifications(updatedSpecifications);
  };

  const handleFileChange = (e) => {
    if (selectedFile instanceof Blob) {
      const selectedFile = e.target.files[0];
      setFiles((prevState) => [...prevState, e.target.files[0]]);

      const reader = new FileReader();
      reader.onload = () => {
        setImages((prevState) => [...prevState, reader.result]);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const deleteImage = (i) => {
    const newImages = images.filter((item, index) => index !== i);
    setImages(newImages);

    const newFiles = files.filter((item, index) => index !== i);
    setFiles(newFiles);
  };

  const onSubmit = async (e) => {
    if (currentItemId && files.length) {
      setReqError(null);
      setSuccess(null);
      setWarning(null);

      const formData = new FormData();
      files.map((img, index) => formData.append(`image_${index}`, img));

      try {
        const photos = await axiosInstance.post("admin/uploadImage", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const res = await axiosInstance.patch(
          `admin/items/${currentItemId || currentItem._id}`,
          {
            title: title || currentItem.title,
            description: description || currentItem.description,
            price: price || currentItem.price,
            category_id: categoryId || currentItem.category_id,
            subcategory_id: subcategoryId || currentItem.subcategory_id,
            specifications: specifications || currentItem.specifications,
            photo_names: photos.data.length
              ? [...currentItem.photo_names, ...photos.data]
              : currentItem.photo_names,
          }
        );

        setReqError(null);
        setSuccess(res.data.message);
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
      <div className={styles.main}>
        <div className={styles.forms}>
          <AdminItemSelect
            title="Выберите товар для его изменения"
            categories={categories}
            itemCatId={itemCatId}
            setItemCatId={setItemCatId}
            itemSubcatId={itemSubcatId}
            setItemSubcatId={setItemSubcatId}
            itemSubcategories={itemSubcategories}
            currentItemId={currentItemId}
            setCurrentItemId={setCurrentItemId}
            items={items}
          />
          <Input
            placeholder="Название"
            value={title}
            onChange={(e) =>
              setTitle((prevState) => {
                if (e.target.value.length > MAX_TITLE_CHARACTERS) {
                  return prevState;
                } else return e.target.value;
              })
            }
          />
          <Textarea
            placeholder="Описание товара"
            resize="none"
            value={description}
            onChange={(e) =>
              setDescription((prevState) => {
                if (e.target.value.length > MAX_DESCRIPTION_CHARACTERS) {
                  return prevState;
                } else return e.target.value;
              })
            }
          />
          <div className={styles.selects}>
            <Select
              placeholder="Категория"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories?.map((cat) => (
                <option value={cat._id} key={cat._id}>
                  {cat.title}
                </option>
              ))}
            </Select>

            <Select
              placeholder="Подкатегория"
              disabled={!subcategories.length && true}
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
            >
              {subcategories?.map((subcat) => (
                <option value={subcat._id} key={subcat._id}>
                  {subcat.title}
                </option>
              ))}
            </Select>

            <NumberInput className={styles.numberInput}>
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
                    <IconButton
                      className={styles.iconBtn}
                      onClick={() => onSpecificationRemove(index)}
                    >
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
          <Stack width="100%" direction="column" gap="25px">
            <UploadImage onChangeFunction={handleFileChange} />
            <div className={styles.imagesList}>
              {images?.map((img, index) => (
                <div className={styles.photoContainer} key={index}>
                  <Image
                    src={img}
                    alt="Uploaded"
                    width="300"
                    height="300"
                    className={styles.image}
                  />
                  <IconButton
                    className={styles.imageBtn}
                    onClick={() => deleteImage(index)}
                  >
                    <CloseIcon boxSize="40%" />
                  </IconButton>
                </div>
              ))}
              {currentItem?.photo_names.map((img, index) => (
                <div className={styles.photoContainer} key={index}>
                  <Image
                    src={"http://localhost:8080/images/" + img}
                    alt="Uploaded"
                    width="300"
                    height="300"
                    className={styles.image}
                  />
                  <IconButton
                    className={styles.imageBtn}
                    onClick={() =>
                      setCurrentItem((prevState) => {
                        const photos = [...prevState.photo_names];
                        console.log(photos, index);
                        const filteredPhotos = photos.filter(
                          (photo, i) => i !== index
                        );
                        return { ...prevState, photo_names: filteredPhotos };
                      })
                    }
                  >
                    <CloseIcon boxSize="40%" />
                  </IconButton>
                </div>
              ))}
            </div>
          </Stack>
          <div className={styles.submitBtn} onClick={onSubmit}>
            Обновить товар
          </div>
        </div>
      </div>
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

export default Change;
