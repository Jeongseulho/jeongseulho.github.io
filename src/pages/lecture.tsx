import React from 'react';
import BaseLayout from '../layout/BaseLayout';
import { PATH } from '../routes/path';
import { Guidance2, Summary } from '../styles/typography';
import styled from '@emotion/styled';
import { theme } from '../theme';
import { graphql, Link } from 'gatsby';
import NoContent from '../components/Common/NoContent';

const LectureWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 60px 0px;
`;

const LectureHead = styled.div`
  width: 100%;
  padding: 0px 16px;
  padding-bottom: 40px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.dark[50]};
  margin-bottom: 40px;
`;

const Margin = styled.div`
  margin-top: 4px;
`;

const LectureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
  padding: 0 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CategoryCard = styled(Link)`
  display: block;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ThumbnailWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; // 16:9 비율
  background: ${({ theme }) => theme.colors.dark[50]};
`;

const Thumbnail = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const CategoryTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const PostCount = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.dark[100]};
`;

type LecturePageProps = {
  data: {
    site: {
      siteMetadata: {
        title: string;
        description: string;
        siteUrl: string;
      };
    };
    allMarkdownRemark: {
      group: {
        fieldValue: string;
        totalCount: number;
        nodes: {
          id: string;
          fields: {
            slug: string;
          };
          frontmatter: {
            title: string;
            date: string;
            thumbnail: {
              childImageSharp: {
                gatsbyImageData: {
                  images: {
                    fallback: {
                      src: string;
                    };
                  };
                };
              };
            };
          };
        }[];
      }[];
    };
  };
};

const LecturePage = ({
  data: {
    site: {
      siteMetadata: { title, description, siteUrl },
    },
    allMarkdownRemark: { group },
  },
}: LecturePageProps) => {
  return (
    <BaseLayout path={PATH.lecture} meta={{ title, description, url: siteUrl }}>
      <LectureWrapper>
        <LectureHead>
          <Guidance2>Lecture</Guidance2>
          <Margin />
          <Summary textColor={theme.colors.dark[100]}>강의 노트 모음</Summary>
        </LectureHead>
        {group.length > 0 ? (
          <LectureGrid>
            {group.map(category => {
              const thumbnail = category.nodes[0]?.frontmatter.thumbnail;
              return (
                <CategoryCard
                  key={category.fieldValue}
                  to={`/lecture/${category.fieldValue.toLowerCase()}`}
                >
                  <ThumbnailWrapper>
                    {thumbnail && (
                      <Thumbnail
                        src={
                          thumbnail.childImageSharp.gatsbyImageData.images
                            .fallback.src
                        }
                        alt={category.fieldValue}
                      />
                    )}
                  </ThumbnailWrapper>
                  <CardContent>
                    <CategoryTitle>{category.fieldValue}</CategoryTitle>
                    <PostCount>{category.totalCount}개의 포스트</PostCount>
                  </CardContent>
                </CategoryCard>
              );
            })}
          </LectureGrid>
        ) : (
          <NoContent />
        )}
      </LectureWrapper>
    </BaseLayout>
  );
};

export default LecturePage;

export const lectureQuery = graphql`
  query LectureQuery {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    allMarkdownRemark(
      filter: { fields: { slug: { regex: "/lecture/" } } }
      sort: { frontmatter: { date: ASC } }
    ) {
      group(field: { frontmatter: { categories: SELECT } }) {
        fieldValue
        totalCount
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "YYYY.MM.DD")
            thumbnail {
              childImageSharp {
                gatsbyImageData(width: 400)
              }
            }
          }
        }
      }
    }
  }
`;
