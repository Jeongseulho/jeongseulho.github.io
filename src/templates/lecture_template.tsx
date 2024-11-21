import React, { FunctionComponent } from 'react';
import BaseLayout from 'layout/BaseLayout';
import PostLayout from 'layout/PostLayout';
import ContentHead from 'components/Detail/ContentHead';
import ContentBody from 'components/Detail/ContentBody';
import CommentWidget from 'components/Detail/CommentWidget';
import ContentFooter from 'components/Detail/ContentFooter';
import { PostPageItemType, PageContextType } from 'types/Post.types';
import { graphql } from 'gatsby';
import { PATH } from '../routes/path';
type LectureTemplateProps = {
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

const LectureTemplate: FunctionComponent<LectureTemplateProps> = function ({
  data,
  pageContext,
  location,
}: LectureTemplateProps) {
  const { previous, next } = pageContext;
  const {
    node: {
      html,
      frontmatter: { title, date, tags },
    },
  } = data.allMarkdownRemark.edges[0];

  return (
    <BaseLayout
      path={PATH.lecture}
      meta={{
        title,
        description: title,
        url: location.href,
      }}
    >
      <PostLayout>
        <ContentHead title={title} date={date} />
        <ContentBody html={html} />
        <ContentFooter previous={previous} next={next} tags={tags} />
        <CommentWidget />
      </PostLayout>
    </BaseLayout>
  );
};

export default LectureTemplate;

export const queryMarkdownDataBySlug = graphql`
  query queryLectureMarkdownDataBySlug($slug: String) {
    allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          html
          tableOfContents
          frontmatter {
            title
            date(formatString: "YYYY년 MM월 DD일")
            tags
          }
        }
      }
    }
  }
`;
