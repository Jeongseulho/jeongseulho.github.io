/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);

/**
 * Setup import alias
 */
exports.onCreateWebpackConfig = ({ getConfig, actions }) => {
  const output = getConfig().output || {};

  actions.setWebpackConfig({
    output,
    resolve: {
      alias: {
        types: path.resolve(__dirname, 'src/@types'),
        components: path.resolve(__dirname, 'src/components'),
        hooks: path.resolve(__dirname, 'src/hooks'),
        assets: path.resolve(__dirname, 'src/assets'),
        layout: path.resolve(__dirname, 'src/layout'),
        pages: path.resolve(__dirname, 'src/pages'),
        routes: path.resolve(__dirname, 'src/routes'),
        styles: path.resolve(__dirname, 'src/styles'),
        theme: path.resolve(__dirname, 'src/theme'),
      },
    },
  });
};

// Generate a Slug Each Post Data
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode });

    createNodeField({ node, name: 'slug', value: slug });
  }
};

// Generate Post Page Through Markdown Data
exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  // Get All Markdown File For Paging
  const queryPostMarkdownData = await graphql(
    `
      {
        allMarkdownRemark(
          sort: [
            { frontmatter: { date: DESC } }
            { frontmatter: { title: ASC } }
          ]
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                tags
                categories
                update
                title
              }
            }
          }
        }
      }
    `,
  )
    .then(result => {
      // Import Post Template Component
      const PostTemplateComponent = path.resolve(
        __dirname,
        'src/templates/post_template.tsx',
      );

      const posts = result.data.allMarkdownRemark.edges.filter(
        ({ node }) =>
          node.frontmatter.update &&
          (node.frontmatter.tags !== null ||
            node.frontmatter.categories !== null),
      );

      // Page Generating Function
      const generatePostPage = (
        {
          node: {
            fields: { slug },
          },
        },
        index,
      ) => {
        const previous =
          index === posts.length - 1 ? null : posts[index + 1].node;
        const next = index === 0 ? null : posts[index - 1].node;
        const pageOptions = {
          path: slug,
          component: PostTemplateComponent,
          context: { slug, previous, next },
        };

        createPage(pageOptions);
      };

      // Generate Post Page And Passing Slug Props for Query
      posts.forEach(generatePostPage);
    })
    .catch(error => {
      reporter.panicOnBuild(`Error while running create post page query`);
      return;
    });

  const queryDiaryMarkdownData = await graphql(
    `
      {
        allMarkdownRemark(
          sort: [
            { frontmatter: { date: DESC } }
            { frontmatter: { title: ASC } }
          ]
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                index
                update
              }
            }
          }
        }
      }
    `,
  )
    .then(result => {
      // Import Post Template Component
      const DiaryTemplateComponent = path.resolve(
        __dirname,
        'src/templates/diary_template.tsx',
      );

      const diaryPosts = result.data.allMarkdownRemark.edges.filter(
        ({ node }) =>
          node.frontmatter.update && node.frontmatter.index !== null,
      );

      // Page Generating Function
      const generateDiaryPage = (
        {
          node: {
            fields: { slug },
          },
        },
        index,
      ) => {
        const previous =
          index === diaryPosts.length - 1 ? null : diaryPosts[index + 1].node;
        const next = index === 0 ? null : diaryPosts[index - 1].node;
        const pageOptions = {
          path: slug,
          component: DiaryTemplateComponent,
          context: { slug, previous, next },
        };

        createPage(pageOptions);
      };

      // Generate Diary Page And Passing Slug Props for Query
      diaryPosts.forEach(generateDiaryPage);
    })
    .catch(error => {
      reporter.panicOnBuild(`Error while running create diary page query`);
      return;
    });

  const queryLectureMarkdownData = await graphql(
    `
      {
        allMarkdownRemark(
          sort: [
            { frontmatter: { date: DESC } }
            { frontmatter: { title: ASC } }
          ]
          filter: { fields: { slug: { regex: "/lecture/.+/.+/" } } }
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                categories
                title
                date
                tags
              }
            }
          }
        }
      }
    `,
  )
    .then(result => {
      const LectureTemplateComponent = path.resolve(
        __dirname,
        'src/templates/lecture_template.tsx',
      );

      const lecturePosts = result.data.allMarkdownRemark.edges;

      // 각 포스트별로 페이지 생성
      lecturePosts.forEach((post, index) => {
        const currentCategory = post.node.frontmatter.categories[0];

        // 같은 카테고리의 포스트들만 필터링
        const sameCategoryPosts = lecturePosts.filter(
          p => p.node.frontmatter.categories[0] === currentCategory,
        );

        // 현재 포스트의 같은 카테고리 내에서의 인덱스 찾기
        const categoryIndex = sameCategoryPosts.findIndex(
          p => p.node.fields.slug === post.node.fields.slug,
        );

        // 같은 카테고리 내에서 이전/다음 포스트 찾기
        const previous =
          categoryIndex === sameCategoryPosts.length - 1
            ? null
            : sameCategoryPosts[categoryIndex + 1].node;
        const next =
          categoryIndex === 0
            ? null
            : sameCategoryPosts[categoryIndex - 1].node;

        createPage({
          path: post.node.fields.slug,
          component: LectureTemplateComponent,
          context: {
            slug: post.node.fields.slug,
            previous,
            next,
          },
        });
      });
    })
    .catch(error => {
      reporter.panicOnBuild(`Error while running create lecture page query`);
      return;
    });

  // 카테고리별 강의 목록 페이지 생성
  const result = await graphql(`
    {
      allMarkdownRemark(filter: { fields: { slug: { regex: "/lecture/" } } }) {
        group(field: { frontmatter: { categories: SELECT } }) {
          fieldValue
        }
      }
    }
  `);

  result.data.allMarkdownRemark.group.forEach(({ fieldValue }) => {
    createPage({
      path: `/lecture/${fieldValue}`,
      component: path.resolve('./src/templates/lecture-list.tsx'),
      context: {
        category: fieldValue,
      },
    });
  });

  return Promise.all([
    queryPostMarkdownData,
    queryDiaryMarkdownData,
    queryLectureMarkdownData,
  ]);
};
