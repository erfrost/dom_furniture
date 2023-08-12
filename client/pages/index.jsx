import Header from "@/AdminComponents/Header/Header";
import Image from "next/image";
import { useState } from "react";

const Index = () => {
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFiles((prevState) => [...prevState, e.target.files[0]]);

    const reader = new FileReader();
    reader.onload = () => {
      setImage((prevState) => [...prevState, reader.result]);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    const formData = new FormData();
    files.map((img, index) => formData.append(`image_${index}`, img));

    try {
      // const { data } = await axiosInstance.post("admin/uploadImage", formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      // console.log(data);
      // const res = await axiosInstance.post("admin/items", {
      //   title: "fdgdfgfg",
      //   description: "fdgdfgfg",
      //   price: 2000,
      //   category_id: "64c63879b14f327a0ffcdc4d",
      //   subcategory_id: "64c64214d9415426da6cc201",
      //   specifications: [],
      //   photo_names: data,
      // });
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(image, files);
  return (
    <>
      <Header />
      <div>
        <span>Home</span>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            multiple
            type="file"
            name="image"
            onChange={handleFileChange}
          />
          <button type="submit">Загрузить</button>
        </form>
        {image &&
          image.map((img, index) => (
            <Image
              src={
                "http://localhost:8080/images/54e73963-3a13-421f-8dfd-1276b1e2181b-400x400.jpeg"
              }
              alt="Uploaded"
              width="300"
              height="300"
              key={index}
            />
          ))}
      </div>
    </>
  );
};

export default Index;
