import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
        <p className={styles.copyright}>
            copyright {new Date().getFullYear()} by Worldwise
        </p>
    </footer>
  )
}

export default Footer
