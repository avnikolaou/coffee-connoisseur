import styles from './banner.module.css';

const Banner = (props) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.titleFirst}>Coffee</span>
        <span className={styles.titleSecond}>Connoisseur</span>
      </h1>
      <p className={styles.subTitle}>Discover your local coffee shops!</p>
      <div className={styles.buttonWrapper}>
        <button className={styles.button} onClick={props.handleClick}>
          {props.buttonText}
        </button>
      </div>
    </div>
  );
};

export default Banner;
