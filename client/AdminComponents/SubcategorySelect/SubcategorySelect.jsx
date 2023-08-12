import { Select, Stack } from "@chakra-ui/react";

const SubcategorySelect = ({
  categories,
  subcategories,
  setCategoryId,
  setSubcategoryId,
}) => {
  console.log(subcategories);
  return (
    <Stack direction="row" width="100%" gap="25px">
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
      <Select
        width="100%"
        placeholder="Подкатегория"
        onChange={(e) => setSubcategoryId(e.target.value)}
        disabled={!subcategories.length && true}
      >
        {subcategories?.map((cat) => (
          <option value={cat._id} key={cat._id}>
            {cat.title}
          </option>
        ))}
      </Select>
    </Stack>
  );
};

export default SubcategorySelect;
