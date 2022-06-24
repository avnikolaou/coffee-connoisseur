import Head from 'next/head';
import Image from 'next/image';
import isEmpty from 'lodash/isEmpty';

import Banner from '../components/banner';
import Card from '../components/card';

import { fetchCoffeeStores } from '../lib/coffee-stores';
import useTrackLocation from '../hooks/use-track-location';

import styles from '../styles/Home.module.css';

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: { coffeeStores }, // will be passed to the page component as props
  };
}

const Home = ({ coffeeStores }) => {
  const { handleTrackLocation, latLong, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  console.log({ latLong });
  console.log({ locationErrorMsg });

  const handleBannerButtonClick = () => {
    console.log('hello banner button');
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? 'Locating...' : 'View stores nearby'}
          handleClick={handleBannerButtonClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="Image of a girl drinking coffee"
          />
        </div>
        {!isEmpty(coffeeStores) && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading}>Toronto Stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((c) => {
                return (
                  <Card
                    key={c.id}
                    className={styles.card}
                    name={c.name}
                    imgUrl={
                      c.imgUrl ||
                      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                    }
                    href={`/coffee-store/${c.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
