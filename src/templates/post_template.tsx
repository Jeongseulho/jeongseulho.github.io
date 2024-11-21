import React, { FunctionComponent } from 'react';
import BaseLayout from 'layout/BaseLayout';
import PostLayout from 'layout/PostLayout';
import ContentHead from 'components/Detail/ContentHead';
import ContentBody from 'components/Detail/ContentBody';
import CommentWidget from 'components/Detail/CommentWidget';
import ContentFooter from 'components/Detail/ContentFooter';
import { PostPageItemType, PageContextType } from 'types/Post.types';
import { graphql } from 'gatsby';
import { PATH } from 'routes/path';

type PostTemplateProps = {
  path: string;
  data: {
    allMarkdownRemark: {
      edges: PostPageItemType[];
    };
  };
  pageContext: {
    slug: string;
    previous: PageContextType | null;
    next: PageContextType | null;
  };
  location: {
    href: string;
  };
};

const PostTemplate: FunctionComponent<PostTemplateProps> = function ({
  data,
  pageContext,
  location,
}: PostTemplateProps) {
  const { previous, next } = pageContext;
  const {
    node: {
      html,
      frontmatter: {
        title,
        summary,
        date,
        tags,
        thumbnail: {
          childImageSharp: { gatsbyImageData },
          publicURL,
        },
        sources,
        sources_link,
      },
    },
  } = data.allMarkdownRemark.edges[0];

  return (
    <BaseLayout
      path={PATH.index}
      meta={{
        title,
        description: summary,
        url: location.href,
        image: publicURL,
      }}
    >
      <PostLayout>
        <ContentHead title={title} date={date} />
        <ContentBody html={html} thumbnail={gatsbyImageData} />
        <ContentFooter
          previous={previous}
          next={next}
          tags={tags}
          sources={sources}
          sources_link={sources_link}
        />
        <CommentWidget />
      </PostLayout>
    </BaseLayout>
  );
};

export default PostTemplate;

export const queryMarkdownDataBySlug = graphql`
  query queryMarkdownDataBySlug($slug: String) {
    allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          html
          tableOfContents
          frontmatter {
            title
            summary
            date(formatString: "YYYY년 MM월 DD일")
            tags
            thumbnail {
              childImageSharp {
                gatsbyImageData
              }
              publicURL
            }
            sources
            sources_link
          }
        }
      }
    }
  }
`;
