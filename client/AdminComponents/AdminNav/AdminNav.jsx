import Link from "next/link";
import styles from "./AdminNav.module.css";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

const AdminNav = () => {
  return (
    <div className={styles.AdminHeader}>
      <Menu>
        <MenuButton className={styles.btn}></MenuButton>
        <MenuList className={styles.list}>
          <Link href="/admin/items/add">
            <MenuItem className={`${styles.menuBtn} ${styles.firstBtn}`}>
              Добавление товара
            </MenuItem>
          </Link>
          <Link href="/admin/items/change">
            <MenuItem className={styles.menuBtn}>Изменение товара</MenuItem>
          </Link>
          <Link href="/admin/items/delete">
            <MenuItem className={`${styles.menuBtn} ${styles.lastBtn}`}>
              Удаление товара
            </MenuItem>
          </Link>
          <MenuDivider />
          <Link href="/admin/categories/add">
            <MenuItem className={`${styles.menuBtn} ${styles.firstBtn}`}>
              Добавление категории
            </MenuItem>
          </Link>
          <Link href="/admin/categories/change">
            <MenuItem className={styles.menuBtn}>Изменение категории</MenuItem>
          </Link>
          <Link href="/admin/categories/delete">
            <MenuItem className={`${styles.menuBtn} ${styles.lastBtn}`}>
              Удаление категории
            </MenuItem>
          </Link>
          <MenuDivider />
          <Link href="/admin/subcategories/add">
            <MenuItem className={`${styles.menuBtn} ${styles.firstBtn}`}>
              Добавление подкатегории
            </MenuItem>
          </Link>
          <Link href="/admin/subcategories/change">
            <MenuItem className={styles.menuBtn}>
              Изменение подкатегории
            </MenuItem>
          </Link>
          <Link href="/admin/subcategories/delete">
            <MenuItem className={`${styles.menuBtn} ${styles.lastBtn}`}>
              Удаление подкатегории
            </MenuItem>
          </Link>
          <MenuDivider />
          <Link href="/admin/news/add">
            <MenuItem className={`${styles.menuBtn} ${styles.firstBtn}`}>
              Добавление новости
            </MenuItem>
          </Link>
          <Link href="/admin/news/delete">
            <MenuItem className={`${styles.menuBtn} ${styles.lastBtn}`}>
              Удаление новости
            </MenuItem>
          </Link>
          <MenuDivider />
          <Link href="/admin/feedbacks">
            <MenuItem className={`${styles.menuBtn} ${styles.centralBtn}`}>
              Отзывы
            </MenuItem>
          </Link>
        </MenuList>
      </Menu>
    </div>
  );
};

export default AdminNav;
