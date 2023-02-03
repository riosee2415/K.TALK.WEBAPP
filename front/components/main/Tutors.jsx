import { Empty } from "antd";
import React from "react";
import { Image, Text, Wrapper } from "../commonComponents";
import Theme from "../Theme";
import styled from "styled-components";

const HoverText = styled(Text)`
  font-size: 18px;
  color: ${(props) => props.theme.subTheme5_C};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.subTheme6_C};
  }
`;

const Tutors = () => {
  const test = [
    {
      username: "test",
      teaCountry: "yonsei Univ",
      teaLanguage: "korean teaching",
      title: "testsetsetsetsetetse",
      info: "러ㅐㅑㅈ댜러ㅑㅐㄹㅈㄷ러ㅑㅐㅓ랴ㅐㅓㅑㅐ러ㅑㅈ더랴ㅐㅈ더ㅑㅐㄹㅈ더ㅑㅐ러ㅑㅐㅈㄷ랮ㄷ랴ㅐㅈ댜ㅐㄹㅈ댜ㅐ랮덪더ㅑㅐ러ㅐㅈ랮더ㅐㄹ더재ㅓㅐ랮대ㅑ랮ㄷ러ㅐ댜ㅐ저ㅐ래ㅑㅈ댜ㅐㅈ대댜ㅐ랴ㅐㅈ댜ㅐㅈㄷ랻저ㅑㅐㅈ댜ㅐㅈ더ㅑㅐㅐㅈㄷ러ㅐㅈ더ㅑㅈ댲댜ㅐㄹㅈ댜러ㅑㅈ러ㅑㅓㅑㅐ러쟈ㅐ더덪댜ㅐ러ㅑㅈ더ㅓㄹ절저덪ㄷ렂ㄷ러ㅐㅈ더ㅑㅐㅈ더랴ㅐㅈ더ㅐㅓㅑㅐㅈㄷ",
      profileImage:
        "https://search.pstatic.net/common/?src=http%3A%2F%2Fimgnews.naver.net%2Fimage%2F408%2F2022%2F12%2F16%2F0000175285_005_20221216220203213.jpg&type=a340",
    },
    {
      username: "test",
      teaCountry: "yonsei Univ",
      teaLanguage: "korean teaching",
      title: "testsetsetsetsetetse",
      info: "러ㅐㅑㅈ댜러ㅑㅐㄹㅈㄷ러ㅑㅐㅓ랴ㅐㅓㅑㅐ러ㅑㅈ더랴ㅐㅈ더ㅑㅐㄹㅈ더ㅑㅐ러ㅑㅐㅈㄷ랮ㄷ랴ㅐㅈ댜ㅐㄹㅈ댜ㅐ랮덪더ㅑㅐ러ㅐㅈ랮더ㅐㄹ더재ㅓㅐ랮대ㅑ랮ㄷ러ㅐ댜ㅐ저ㅐ래ㅑㅈ댜ㅐㅈ대댜ㅐ랴ㅐㅈ댜ㅐㅈㄷ랻저ㅑㅐㅈ댜ㅐㅈ더ㅑㅐㅐㅈㄷ러ㅐㅈ더ㅑㅈ댲댜ㅐㄹㅈ댜러ㅑㅈ러ㅑㅓㅑㅐ러쟈ㅐ더덪댜ㅐ러ㅑㅈ더ㅓㄹ절저덪ㄷ렂ㄷ러ㅐㅈ더ㅑㅐㅈ더랴ㅐㅈ더ㅐㅓㅑㅐㅈㄷ",
      profileImage:
        "https://search.pstatic.net/common/?src=http%3A%2F%2Fimgnews.naver.net%2Fimage%2F408%2F2022%2F12%2F16%2F0000175285_005_20221216220203213.jpg&type=a340",
    },
    {
      username: "test",
      teaCountry: "yonsei Univ",
      teaLanguage: "korean teaching",
      title: "testsetsetsetsetetse",
      info: "러ㅐㅑㅈ댜러ㅑㅐㄹㅈㄷ러ㅑㅐㅓ랴ㅐㅓㅑㅐ러ㅑㅈ더랴ㅐㅈ더ㅑㅐㄹㅈ더ㅑㅐ러ㅑㅐㅈㄷ랮ㄷ랴ㅐㅈ댜ㅐㄹㅈ댜ㅐ랮덪더ㅑㅐ러ㅐㅈ랮더ㅐㄹ더재ㅓㅐ랮대ㅑ랮ㄷ러ㅐ댜ㅐ저ㅐ래ㅑㅈ댜ㅐㅈ대댜ㅐ랴ㅐㅈ댜ㅐㅈㄷ랻저ㅑㅐㅈ댜ㅐㅈ더ㅑㅐㅐㅈㄷ러ㅐㅈ더ㅑㅈ댲댜ㅐㄹㅈ댜러ㅑㅈ러ㅑㅓㅑㅐ러쟈ㅐ더덪댜ㅐ러ㅑㅈ더ㅓㄹ절저덪ㄷ렂ㄷ러ㅐㅈ더ㅑㅐㅈ더랴ㅐㅈ더ㅐㅓㅑㅐㅈㄷ",
      profileImage:
        "https://search.pstatic.net/common/?src=http%3A%2F%2Fimgnews.naver.net%2Fimage%2F408%2F2022%2F12%2F16%2F0000175285_005_20221216220203213.jpg&type=a340",
    },
  ];

  return (
    <Wrapper margin={`100px 0 0`}>
      <Wrapper al={`flex-start`}>
        <Text>Toturs</Text>
        <Text>
          Interact with our native Korean teachers and classmates from all over
          the world at your home
        </Text>
      </Wrapper>

      <Wrapper dr={`row`} ju={`space-between`}>
        {test &&
          (test.length === 0 ? (
            <Wrapper>
              <Empty description="등록된 선생님이 없습니다." />
            </Wrapper>
          ) : (
            test.map((data, idx) => {
              return (
                <Wrapper
                  width={`calc(100% / 3 - 20px)`}
                  key={idx}
                  border={`1px solid ${Theme.black_2C}`}
                  padding={`20px`}
                  radius={`15px`}
                  al={`flex-start`}
                >
                  <Text fontSize={`26px`} fontWeight={`600`}>
                    {data.username}
                  </Text>
                  <Text>{data.teaCountry}</Text>
                  <Text>{data.teaLanguage}</Text>

                  <Wrapper margin={`20px 0 10px`} al={`flex-start`}>
                    <Text fontSize={`18px`} fontWeight={`600`}>
                      {data.title}
                    </Text>
                    <Text widht={`100%`}>{data.info.slice(0, 100)}...</Text>
                  </Wrapper>

                  <HoverText>Read more</HoverText>

                  <Image
                    margin={`50px 0 0`}
                    height={`200px`}
                    src={data.profileImage}
                    radius={`15px`}
                  />
                </Wrapper>
              );
            })
          ))}
      </Wrapper>
    </Wrapper>
  );
};

export default Tutors;
