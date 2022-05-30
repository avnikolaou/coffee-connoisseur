import Link from 'next/link';
import { useRouter } from 'next/router';

const CoffeeStore = () => {
  const router = useRouter();
  console.log('Router: ', router);
  return (
    <div>
      Coffee store{router.query.id}
      <Link href="/">Back to home</Link>
    </div>
  );
};

export default CoffeeStore;
