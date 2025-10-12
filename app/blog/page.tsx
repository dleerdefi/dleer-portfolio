import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function Blog() {
  // Placeholder blog posts - will be replaced with MDX content later
  const blogPosts = [
    {
      title: "Building Sustainable Token Economics",
      excerpt: "Deep dive into designing token economies that align incentives and create long-term value.",
      date: "Coming Soon",
      tags: ["DeFi", "Tokenomics", "Game Theory"],
      readTime: "10 min"
    },
    {
      title: "Neo4j Knowledge Graphs for Web3",
      excerpt: "How to leverage graph databases for on-chain data analysis and DeFi protocol insights.",
      date: "Coming Soon",
      tags: ["Neo4j", "Data", "Analytics"],
      readTime: "8 min"
    },
    {
      title: "MEV Protection Strategies",
      excerpt: "Practical approaches to protect your protocol and users from MEV exploitation.",
      date: "Coming Soon",
      tags: ["MEV", "Security", "DeFi"],
      readTime: "12 min"
    }
  ];

  const categories = ["DeFi", "Token Economics", "Neo4j", "Smart Contracts", "Security"];

  return (
    <>
      {/* Hero Section */}
      <Section className="py-16 bg-bg-secondary">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Blog
        </h1>
        <p className="text-lg text-text-secondary max-w-3xl">
          Technical articles on DeFi protocol design, token economics, and knowledge graph applications.
          Deep dives into blockchain architecture and practical implementation guides.
        </p>
      </Section>

      {/* Categories */}
      <Section>
        <h2 className="text-2xl font-bold text-text-primary mb-6">Categories</h2>
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((category) => (
            <Badge key={category} variant="default">
              {category}
            </Badge>
          ))}
        </div>

        {/* Blog Posts */}
        <h2 className="text-2xl font-bold text-text-primary mb-8">Recent Posts</h2>
        <div className="grid gap-6">
          {blogPosts.map((post, index) => (
            <Card key={index} className="hover:border-accent-primary transition-all">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {post.title}
                  </h3>
                  <p className="text-text-secondary mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="text-text-muted">{post.date}</span>
                    <span className="text-text-muted">•</span>
                    <span className="text-text-muted">{post.readTime} read</span>
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Coming Soon Notice */}
      <Section className="bg-bg-secondary">
        <Card className="text-center py-12">
          <h3 className="text-2xl font-bold text-accent-primary mb-4">
            Full Blog System Coming Soon
          </h3>
          <p className="text-text-secondary max-w-2xl mx-auto">
            The blog is being built with MDX support for rich content, code syntax highlighting,
            and embedded demos. Subscribe to get notified when new articles are published.
          </p>
          <div className="mt-8">
            <button className="bg-accent-primary text-bg-primary px-4 py-2 rounded-lg font-medium hover:bg-accent-hover transition-all">
              Get Notified
            </button>
          </div>
        </Card>
      </Section>
    </>
  );
}