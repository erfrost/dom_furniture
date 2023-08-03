import Link from "next/link";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <div className={styles.Header}>
      <span className={styles.logo}>LOGO</span>
      <div className={styles.nav}>
        <Link className={styles.link} href="/">
          Home
        </Link>
        <Link className={styles.link} href="/about">
          About
        </Link>
      </div>
    </div>
  );
};

export default Header;
