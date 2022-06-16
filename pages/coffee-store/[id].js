import Link from 'next/link';
import { useRouter } from 'next/router';

import coffeeStoresData from '../../data/coffee-stores.json';

export function getStaticProps({ params }) {
  console.log('Params: ', params);
  return {
    props: {
      coffeeStore: coffeeStoresData.find((coffeeStore) => {
        return coffeeStore.id.toString() === params.id;
      }),
    },
  };
}

export function getStaticPaths({ params }) {
  return {
    paths: [
      { params: { id: '0' } },
      { params: { id: '1' } },
      { params: { id: '2' } },
    ],
    fallback: false,
  };
}

const CoffeeStore = (props) => {
  const router = useRouter();
  console.log('Router: ', router);
  console.log('Props: ', props);
  return (
    <div>
      Coffee store{router.query.id}
      <Link href="/">Back to home</Link>
      <p>{props.coffeeStore.address}</p>
      <p>{props.coffeeStore.name}</p>
    </div>
  );
};

export default CoffeeStore;
