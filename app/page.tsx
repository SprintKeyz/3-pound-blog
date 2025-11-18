import Navbar from '../components/Navbar';
import { getAllPosts } from '../lib/markdown';

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No posts yet!</h2>
            <p>
              Create some markdown files in the{" "}
              <code className="bg-background/50 px-2 py-1 rounded border border-foreground/20">
                posts/
              </code>{" "}
              directory to get started.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-12">
            {posts
              .sort(
                (a, b) =>
                  new Date(b.data.date ?? '').getTime() -
                  new Date(a.data.date ?? '').getTime()
              )
              .map((post) => {
                // Strip HTML to count words
                const textOnly = post.content.replace(/<[^>]*>/g, '');
                const wordCount = textOnly.split(/\s+/).filter(Boolean).length;

                return (
                  <article
                    key={post.id}
                    className="bg-background/80 border border-foreground/10 rounded-lg shadow-md p-8"
                  >
                    {post.data.title && (
                      <h2 className="text-3xl font-bold mb-2">{post.data.title}</h2>
                    )}

                    <div className="flex items-center text-sm mb-2 space-x-2 opacity-80">
                      {post.data.date && (
                        <span>
                          {new Date(post.data.date).toLocaleDateString()}
                        </span>
                      )}
                      <span>|</span>
                      <span>{wordCount} words</span>
                    </div>

                    {post.data.week && (
                      <h2 className="text-xl font-bold mb-6 opacity-70">
                        Week {post.data.week}
                      </h2>
                    )}

                    <div className="post-content max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />

                  </article>
                );
              })}
          </div>
        )}
      </main>
    </div>
  );
}
