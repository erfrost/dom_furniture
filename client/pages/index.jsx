import axiosInstance from "@/axios.config";
import Header from "@/components/Header/Header";
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
    e.preventDefault();

    const formData = new FormData();
    files.map((img, index) => formData.append(`image_${index}`, img));

    try {
      const { data } = await axiosInstance.post("admin/uploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(data);
      const res = await axiosInstance.post("admin/items", {
        title: "fdgdfgfg",
        description: "fdgdfgfg",
        price: 2000,
        category_id: "64c63879b14f327a0ffcdc4d",
        subcategory_id: "64c64214d9415426da6cc201",
        specifications: [],
        imageNames: data,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

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
              src={img}
              alt="Uploaded"
              width="300"
              height="300"
              key={index}
            />
          ))}
        <Image
          src={
            "http://localhost:8080/images/ca801d2d-bf5c-4b4d-a380-791ff1d7b46c-400x400.jpeg"
          }
          alt="Uploaded"
          width="300"
          height="300"
        />
      </div>
    </>
  );
};

export default Index;
