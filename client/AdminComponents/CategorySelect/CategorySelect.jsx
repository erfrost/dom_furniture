import { Select } from "@chakra-ui/react";

const CategorySelect = ({ categories, setCategoryId }) => {
  return (
    <Select
      width="100%"
      placeholder="Категория"
      onChange={(e) => setCategoryId(e.target.value)}
    >
      {categories?.map((cat) => (
        <option value={cat._id} key={cat._id}>
          {cat.title}
        </option>
      ))}
    </Select>
  );
};

export default CategorySelect;
