import { Select } from "@chakra-ui/react";
import styles from "./AdminItemSelect.module.css";

const AdminItemSelect = ({
  title,
  categories,
  itemCatId,
  setItemCatId,
  itemSubcatId,
  setItemSubcatId,
  itemSubcategories,
  currentItemId,
  setCurrentItemId,
  items,
}) => {
  return (
    <div className={styles.currentItemContainer}>
      <span className={styles.currentItemTitle}>{title}</span>
      <div className={styles.currentItemSelects}>
        <Select
          placeholder="Категория"
          className={styles.selectsItem}
          value={itemCatId}
          onChange={(e) => setItemCatId(e.target.value)}
        >
          {categories?.map((cat) => (
            <option value={cat._id} key={cat._id}>
              {cat.title}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Подкатегория"
          className={styles.selectsItem}
          disabled={!itemSubcategories.length && true}
          value={itemSubcatId}
          onChange={(e) => setItemSubcatId(e.target.value)}
        >
          {itemSubcategories?.map((subcat) => (
            <option value={subcat._id} key={subcat._id}>
              {subcat.title}
            </option>
          ))}
        </Select>

        <Select
          placeholder="Товар"
          className={styles.selectsItem}
          disabled={!items.length && true}
          value={currentItemId}
          onChange={(e) => setCurrentItemId(e.target.value)}
        >
          {items?.map((item) => (
            <option value={item._id} key={item._id}>
              {item.title}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default AdminItemSelect;
