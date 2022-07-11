import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import cls from 'classnames';
import useSWR from 'swr';

import { StoreContext } from '../../store/store-context';

import { fetchCoffeeStores } from '../../lib/coffee-stores';

import { fetcher } from '../../lib/fetcher';

import styles from '../../styles/coffee-store.module.css';

// Next.js will pre-render this page at build time using the props returned by getStaticProps
export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id;
  });

  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

/*
If a page has Dynamic Routes and uses getStaticProps,
it needs to define a list of paths to be statically generated.

When you export a function called getStaticPaths (Static Site Generation)
from a page that uses dynamic routes, Next.js will statically
pre-render all the paths specified by getStaticPaths.
 */

export async function getStaticPaths({ params }) {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();

  const id = router.query.id;
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const [votingCount, setVotingCount] = useState(0);
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, imgUrl, locality, address } = coffeeStore;
      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighbourhood: locality ? locality : '',
          address: address ? address : '',
        }),
      });

      const dbCoffeeStore = response.json();
    } catch (e) {
      console.error('Error creating coffee store', e);
    }
  };

  useEffect(() => {
    if (!isEmpty(data)) {
      console.log('DATA: ', data);
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }

    if (error) {
      return <div>Something went wrong!</div>;
    }
  }, [data, error]);

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (!isEmpty(coffeeStores)) {
        const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id;
        });
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      // SSG
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, coffeeStores]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleUpvoteButton = () => {
    setVotingCount(votingCount + 1);
    console.log('handle upvote');
  };

  const { name, address, locality, neighbourhood, imgUrl } = coffeeStore;

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">← Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>

          <Image
            src={
              imgUrl ||
              'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>

        <div className={cls('glass', styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" width={24} height={24} />
            <p className={styles.text}>{address}</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image src="/static/icons/nearMe.svg" width={24} height={24} />
            <p className={styles.text}>{locality || neighbourhood}</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width={24} height={24} />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
