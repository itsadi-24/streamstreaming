'use client';
import { Imovie } from '@/app/discover/[id]/page';
import Card from '@/components/Card';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import { BASE_URL } from '@/utils/Const';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

type GenresProps = {
  key: React.Key | null | undefined;
  id: React.Key | null | undefined;
  index: any;
  name: any;
  length: number;
};

const Genres: React.FC<GenresProps> = ({ id, index, name, length }) => {
  const [title, setTitle] = useState('');
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const mainRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    mainRef?.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    const id = params.id;
    const genre = searchParams.get('genre');
    const page = searchParams.get('page');

    setTitle(`${genre} Movies`);

    axios
      .get(`${BASE_URL}/discover/movie`, {
        params: {
          api_key: process.env.NEXT_PUBLIC_API_KEY,
          with_genres: id,
          page,
        },
      })
      .then((response) => {
        console.log('res: ', response);

        setMovies(response.data.results);
        setCurrentPage(response.data.page);
        setTotalPage(response.data.total_page);
      })
      .catch((error) => console.log(error));
  }, [params.id, searchParams]);

  const handlePageChange = (button: string) => {
    let page = '';
    if (button === 'prev') {
      page = `page=${currentPage - 1}`;
    } else {
      page = `page=${currentPage + 1}`;
    }
    router.push(
      `/genres/${params.id}?genre=${searchParams.get('genre')}&${page}`
    );
  };
  return (
    <main
      className=' bg-primary px-10 max-h-[calc(100vh-77px)] pb-6 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#22222a] scrollbar-track-primary relative'
      ref={mainRef}
    >
      <h2 className='text-[24px] tracking-[2px] capitalize'>{title}</h2>

      {movies.length === 0 && <Loading />}

      <div className=' grid gap-8 moviesGrid place-items-center mt-8'>
        {movies.map((movie: Imovie) => (
          <Card
            key={movie.id}
            img={movie.poster_path}
            id={movie.id}
            title={movie.title}
            releaseDate={movie.release_date}
          />
        ))}
      </div>

      <div className='flex justify-center gap-16 py-6 pt-16'>
        <button
          onClick={() => handlePageChange('prev')}
          className={`bg-purple-900 p-2 px-8 hover:bg-purple-950 ${
            currentPage === 1 && 'hidden'
          }`}
        >
          Prev
        </button>
        <button
          onClick={() => handlePageChange('next')}
          className={`bg-purple-900 p-2 px-8 hover:bg-purple-950 ${
            currentPage === totalPage && 'hidden'
          }`}
        >
          Next
        </button>
      </div>
      <div className='pb-20'>
        <Footer />
      </div>
    </main>
  );
};

export default Genres;
