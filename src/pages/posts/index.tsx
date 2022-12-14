import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';
import { RichText } from 'prismic-dom';
import Link from 'next/link';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updateAt: string;
};

interface PostsProps {
  postsFormatted: Post[];
}

export default function Posts({ postsFormatted }) {
  console.log(postsFormatted);
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {postsFormatted.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updateAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const prismic = getPrismicClient();

  const posts = await prismic.getByType('post', {
    pageSize: 100,
  });

  const postsFormatted = posts.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find((content) => content.type === 'paragraph')
          ?.text ?? '',
      updateAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      ),
    };
  });

  return {
    props: { postsFormatted },
  };
}
