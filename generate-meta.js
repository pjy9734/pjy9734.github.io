// generate-meta.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 配置路径
const postsDir = path.join(__dirname, 'blog/posts');
const outputFile = path.join(__dirname, 'blog/meta.json');

// 检查 posts 目录是否存在
if (!fs.existsSync(postsDir)) {
    console.error('❌ blog/posts 目录不存在');
    process.exit(1);
}

// 读取所有 .md 文件
const files = fs.readdirSync(postsDir);
const mdFiles = files.filter(file => file.endsWith('.md'));

if (mdFiles.length === 0) {
    console.log('⚠️ 没有找到 Markdown 文件');
    // 写入空数组
    fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    process.exit(0);
}

// 提取每篇文章的信息
const posts = mdFiles.map(file => {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);
    
    return {
        slug: file.replace('.md', ''),           // 文件名作为 slug
        title: data.title || '无标题',
        date: data.date || new Date().toISOString().split('T')[0],
        description: data.description || ''
    };
});

// 按日期倒序排列（最新的在前）
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// 写入 meta.json
fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log(`✅ 已生成 meta.json，共 ${posts.length} 篇文章`);
