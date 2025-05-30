import React, { FunctionComponent } from 'react';
import BaseLayout from 'layout/BaseLayout';
import PostLayout from 'layout/PostLayout';
import ContentHead from 'components/Detail/ContentHead';
import CommentWidget from 'components/Detail/CommentWidget';
import { MarkdownRenderer } from 'components/Detail/styles/code.styles';
import { DiaryPageItemType } from 'types/Post.types';
import { graphql } from 'gatsby';
import { PATH } from 'routes/path';
type DiaryTemplateProps = {
  path: string;
  data: {
    allMarkdownRemark: {
      edges: DiaryPageItemType[];
    };
    file: {
      publicURL: string;
    };
  };
  pageContext: unknown;
  location: {
    href: string;
  };
};

const DiaryTemplate: FunctionComponent<DiaryTemplateProps> = function ({
  data,
  location,
}: DiaryTemplateProps) {
  const {
    node: {
      html,
      frontmatter: { title, summary, date },
    },
  } = data.allMarkdownRemark.edges[0];

  return (
    <BaseLayout
      path={PATH.diary}
      meta={{
        title,
        description: summary,
        image: data.file.publicURL,
        url: location.href,
      }}
    >
      <PostLayout>
        <ContentHead title={title} date={date} />
        <MarkdownRenderer dangerouslySetInnerHTML={{ __html: html }} />
        <CommentWidget />
      </PostLayout>
    </BaseLayout>
  );
};

export default DiaryTemplate;

export const queryMarkdownDataBySlug = graphql`
  query queryMarkdownDataBySlug($slug: String) {
    allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          html
          frontmatter {
            title
            summary
            date(formatString: "YYYY년 MM월 DD일")
            index
            update
          }
        }
      }
    }
    file(name: { eq: "profile-image" }) {
      childImageSharp {
        gatsbyImageData(width: 120, height: 120)
      }
      publicURL
    }
  }
`;
