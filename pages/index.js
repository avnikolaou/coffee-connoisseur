import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';

import Banner from '../components/banner';
import Card from '../components/card';

import { fetchCoffeeStores } from '../lib/coffee-stores';
import useTrackLocation from '../hooks/use-track-location';

import styles from '../styles/Home.module.css';

// Next.js will pre-render this page at build time using the props returned by 'getStaticProps'.
export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: { coffeeStores }, // will be passed to the page component as props
  };
}

const Home = (props) => {
  const { handleTrackLocation, latLong, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  const [coffeeStores, setCoffeeStores] = useState('');
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latLong) {
        try {
          const fetchedCoffeeStores = await fetchCoffeeStores(latLong, 9);
          setCoffeeStores(fetchedCoffeeStores);
        } catch (e) {
          setCoffeeStoresError(e.message);
        }
      }
    }
    setCoffeeStoresByLocation();
  }, [latLong]);

  const handleBannerButtonClick = () => {
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
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}

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
            <h2 className={styles.heading}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}

        {!isEmpty(props.coffeeStores) && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading}>Toronto Stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((c) => {
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
