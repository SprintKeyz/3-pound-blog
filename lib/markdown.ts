import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface Post {
  id: string;
  content: string;
  data: {
    title?: string;
    date?: string;
    [key: string]: any;
  };
}

export async function getAllPosts(): Promise<Post[]> {
  // Ensure posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const markdownFiles = fileNames.filter(name => name.endsWith('.md'));

  const allPostsData = await Promise.all(
    markdownFiles.map(async (fileName) => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Use remark to convert markdown into HTML string
      const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
      const content = processedContent.toString();

      return {
        id,
        content,
        data: matterResult.data,
      };
    })
  );

  // Sort posts by filename (1.md, 2.md, etc.)
  return allPostsData.sort((a, b) => {
    const aNum = parseInt(a.id);
    const bNum = parseInt(b.id);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    return a.id.localeCompare(b.id);
  });
}