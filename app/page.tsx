import Navbar from '../components/Navbar';
import { getAllPosts } from '../lib/markdown';

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">No posts yet!</h2>
            <p className="text-gray-500">
              Create some markdown files in the <code className="bg-gray-200 px-2 py-1 rounded">posts/</code> directory to get started.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-12">
            {posts
              .sort(
                (a, b) =>
                  new Date(b.data.date ?? '').getTime() - new Date(a.data.date ?? '').getTime()
              )
              .map((post) => {
                // Strip HTML to count words
                const textOnly = post.content.replace(/<[^>]*>/g, '');
                const wordCount = textOnly.split(/\s+/).filter(Boolean).length;

                return (
                  <article key={post.id} className="bg-white rounded-lg shadow-md p-8">
                    {post.data.title && (
                      <h2 className="text-3xl font-bold mb-2 text-gray-800">{post.data.title}</h2>
                    )}
                    <div className="flex items-center text-gray-500 mb-6 space-x-2 text-sm">
                      {post.data.date && <span>{new Date(post.data.date).toLocaleDateString()}</span>}
                      <span>|</span>
                      <span>{wordCount} words</span>
                    </div>
<div
  className="prose prose-lg max-w-none dark:prose-invert"
  dangerouslySetInnerHTML={{ __html: post.content }}
/>
                  </article>
                );
              })}
          </div>
        )}
      </main>
    </div>
  );
}
