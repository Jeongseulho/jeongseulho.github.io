import React from 'react';
import { graphql, Link } from 'gatsby';
import styled from '@emotion/styled';
import BaseLayout from '../layout/BaseLayout';
import { PATH } from '../routes/path';
import { Guidance2, Summary } from '../styles/typography';
import { theme } from '../theme';
import NoContent from '../components/Common/NoContent';

const LectureListWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 60px 16px;
`;

const LectureHead = styled.div`
  width: 100%;
  padding-bottom: 40px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.dark[50]};
  margin-bottom: 40px;
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PostItem = styled(Link)`
  display: flex;
  align-items: flex-start;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);

    & > span {
      color: ${({ theme }) => theme.colors.primary.default};
      &::after {
        width: 100%;
      }
    }
  }
`;

const PostIndex = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark[50]};
  margin-right: 20px;
  line-height: 1;
  min-width: 40px;
  display: inline-block;
  transition: color 0.3s;
  position: relative;

  &::after {
    display: block;
    content: '';
    width: 0;
    height: 3px;
    margin-bottom: 3px;
    margin-top: 4px;
    background-color: ${props => props.theme.colors.primary[300]};
    transition: width 0.3s;
  }
`;

const PostContent = styled.div`
  flex: 1;
`;

const PostTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  word-break: keep-all;
`;

const PostDate = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.dark[100]};
`;

const LectureListTemplate = ({
  data,
  pageContext,
}: {
  data: {
    allMarkdownRemark: {
      nodes: any[];
    };
    site: {
      siteMetadata: {
        siteUrl: string;
      };
    };
  };
  pageContext: {
    category: string;
  };
}) => {
  const { category } = pageContext;
  const posts = data.allMarkdownRemark.nodes;

  return (
    <BaseLayout
      path={PATH.lecture}
      meta={{
        title: `${category} 강의`,
        description: `${category} 관련 강의 포스트 목록`,
        url: `${data.site.siteMetadata.siteUrl}/lecture/${category}`,
      }}
    >
      <LectureListWrapper>
        <LectureHead>
          <Guidance2>{category}</Guidance2>
          <Summary textColor={theme.colors.dark[100]}>
            {posts.length}개의 포스트
          </Summary>
        </LectureHead>
        {posts.length > 0 ? (
          <PostGrid>
            {posts.map((post, index) => (
              <PostItem key={post.id} to={post.fields.slug}>
                <PostIndex>{String(index + 1).padStart(2, '0')}</PostIndex>
                <PostContent>
                  <PostTitle>{post.frontmatter.title}</PostTitle>
                  <PostDate>{post.frontmatter.date}</PostDate>
                </PostContent>
              </PostItem>
            ))}
          </PostGrid>
        ) : (
          <NoContent />
        )}
      </LectureListWrapper>
    </BaseLayout>
  );
};

export default LectureListTemplate;

export const pageQuery = graphql`
  query LectureListQuery($category: String) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: ASC } }
      filter: {
        fields: { slug: { regex: "/lecture/" } }
        frontmatter: { categories: { in: [$category] } }
      }
    ) {
      nodes {
        id
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "YYYY.MM.DD")
        }
      }
    }
  }
`;
