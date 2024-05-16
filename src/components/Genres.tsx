import Link from 'next/link';

interface Igenres {
  index: number;
  name: string;
  length: number;
  id: number;
}

const Genres = ({ index, name, length, id }: Igenres) => {
  return (
    <Link href={`/genres/${id}?genre=${name}.toLowerCase()}`}>
      <div className='flex gap-4 text-textColor hover:text-white'>
        <div>{name}</div>
      </div>
    </Link>
  );
};
