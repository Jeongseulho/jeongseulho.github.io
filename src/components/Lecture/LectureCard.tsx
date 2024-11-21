import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'gatsby';

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

    h2 {
      color: ${({ theme }) => theme.colors.primary.default};
    }
  }
`;

const ThumbnailWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
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
  transition: color 0.3s;
`;

const PostCount = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.dark[100]};
`;

interface LectureCardProps {
  category: {
    fieldValue: string;
    totalCount: number;
    nodes: {
      frontmatter: {
        thumbnail?: {
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
  };
}

const LectureCard = ({ category }: LectureCardProps) => {
  const thumbnail = category.nodes[0]?.frontmatter.thumbnail;

  return (
    <CategoryCard to={`/lecture/${category.fieldValue.toLowerCase()}`}>
      <ThumbnailWrapper>
        {thumbnail && (
          <Thumbnail
            src={thumbnail.childImageSharp.gatsbyImageData.images.fallback.src}
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
};

export default LectureCard;
