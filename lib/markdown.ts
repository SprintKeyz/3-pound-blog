import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkParse from 'remark-parse';
import remarkBreaks from 'remark-breaks';
import { visit } from 'unist-util-visit';
import { Node } from 'unist';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface Post {
  id: string;
  content: string;
  data: {
    title?: string;
    week?: string;
    date?: string;
    [key: string]: any;
  };
}

// --------------------------
// Plugin: sets image width
// --------------------------
function remarkImageWidth() {
  return (tree: Node) => {
    visit(tree, 'image', (node: any) => {
      if (!node.data) node.data = {};
      if (!node.data.hProperties) node.data.hProperties = {};

      // Check for manual width in Markdown title
      if (node.title && node.title.includes('width=')) {
        const match = node.title.match(/width\s*=\s*(\d+%?)/i);
        if (match) {
          node.data.hProperties.width = match[1];
          return;
        }
      }

      // Default width if none specified
      node.data.hProperties.width = '75%';
    });
  };
}

export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory).filter((name) => name.endsWith('.md'));

  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      const matterResult = matter(fileContents);

      const processedContent = await remark()
        .use(remarkParse)
        .use(remarkBreaks)
        .use(remarkImageWidth) // <-- plugin applied here
        .use(html)
        .process(matterResult.content);

      return {
        id,
        content: processedContent.toString(),
        data: matterResult.data,
      };
    })
  );

  return posts.sort((a, b) => {
    const aNum = parseInt(a.id);
    const bNum = parseInt(b.id);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    return a.id.localeCompare(b.id);
  });
}
