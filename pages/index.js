import Head from 'next/head';
import Image from 'next/image';
import isEmpty from 'lodash/isEmpty';

import Banner from '../components/banner';
import Card from '../components/card';

import styles from '../styles/Home.module.css';

import coffeeStoresData from '../data/coffee-stores.json';

export async function getStaticProps(context) {
  return {
    props: { coffeeStores: coffeeStoresData }, // will be passed to the page component as props
  };
}

const Home = ({ coffeeStores }) => {
  const handleBannerButtonClick = () => {
    console.log('hello banner button');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={'View stores nearby'}
          handleClick={handleBannerButtonClick}
        />
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="Image of a girl drinking coffee"
          />
        </div>
        {!isEmpty(coffeeStores) && (
          <>
            <h2 className={styles.heading}>Toronto Stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((c) => {
                return (
                  <Card
                    key={c.id}
                    className={styles.card}
                    name={c.name}
                    imgUrl={c.imgUrl}
                    href={`/coffee-store/${c.id}`}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
