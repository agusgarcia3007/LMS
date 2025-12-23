import { createFileRoute, Link } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { source } from '@/lib/source';
import { baseOptions } from '@/lib/layout.shared';

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    return await getPostsServerFn();
  },
});

const getPostsServerFn = createServerFn({ method: 'GET' }).handler(async () => {
  const pages = source.getPages();
  return pages
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .map((page) => ({
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      author: page.data.author,
      image: page.data.image,
      date: new Date(page.data.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    }));
});

function Home() {
  const posts = Route.useLoaderData();

  return (
    <HomeLayout {...baseOptions()}>
      <div className="container max-w-6xl py-12 px-4">
        <header className="mb-12">
          <h1 className="text-4xl font-bold">Blog</h1>
          <p className="text-fd-muted-foreground mt-2">
            Updates, tutorials, and insights
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.url}
              to={post.url}
              className="group border border-fd-border rounded-lg overflow-hidden hover:border-fd-primary/50 transition-colors"
            >
              {post.image ? (
                <div className="aspect-video bg-fd-muted overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-fd-primary/10 to-fd-primary/5" />
              )}
              <div className="p-4">
                <h2 className="font-semibold text-lg group-hover:text-fd-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="text-fd-muted-foreground text-sm mt-2 line-clamp-2">
                    {post.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-4 text-xs text-fd-muted-foreground">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </HomeLayout>
  );
}
