import { Empty, Modal, Pagination } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Image, Text, Wrapper } from "../commonComponents";
import Theme from "../Theme";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { USER_TEA_MAINLIST_REQUEST } from "../../reducers/user";
import { useRouter } from "next/router";
import useWidth from "../../hooks/useWidth";

const HoverText = styled(Text)`
  font-weight: 600;
  color: ${(props) => props.theme.subTheme5_C};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.subTheme6_C};
  }
`;

const Box = styled(Wrapper)`
  width: calc(100% / 3 - 20px);
  margin: 0 30px 0 0;
  background: ${Theme.white_C};
  border: 1px solid ${Theme.white_C};

  &:nth-child(3n) {
    margin: 0;
  }

  &:hover {
    border: 1px solid ${Theme.basicTheme_Ct};
  }

  @media (max-width: 900px) {
    width: 100%;
    margin: 0 0 20px;
  }
`;

const Tutors = () => {
  const { teaMainList, teaLastPage } = useSelector((state) => state.user);

  const width = useWidth();
  const router = useRouter();
  const dispatch = useDispatch();

  const [dModal, setDModal] = useState(false);
  const [dData, setDData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch({
      type: USER_TEA_MAINLIST_REQUEST,
      data: {
        page: currentPage,
      },
    });
  }, [router.query, currentPage]);

  // 모달 열기
  const dModalToggle = useCallback(
    (data) => {
      if (data) {
        setDData(data);
      } else {
        setDData(null);
      }

      setDModal((prev) => !prev);
    },
    [dModal, dData]
  );

  const pageChangeHandler = useCallback(
    (page) => {
      setCurrentPage(page);
    },
    [currentPage]
  );

  return (
    <Wrapper margin={`70px 0 0`}>
      <Wrapper al={`flex-start`} margin={`0 0 15px`}>
        <Text fontSize={`18px`} fontWeight={`bold`}>
          Tuturs
        </Text>
        <Wrapper dr={`row`} ju={`space-between`}>
          <Text>
            Interact with our native Korean teachers and classmates from all
            over the world at your home
          </Text>
          <Pagination
            total={teaLastPage * 3}
            pageSize={3}
            current={currentPage}
            onChange={pageChangeHandler}
          />
        </Wrapper>
      </Wrapper>

      <Wrapper dr={`row`} ju={`flex-start`} al={`flex-start`}>
        {teaMainList &&
          (teaMainList.length === 0 ? (
            <Wrapper>
              <Empty description="등록된 선생님이 없습니다." />
            </Wrapper>
          ) : (
            teaMainList.map((data, idx) => {
              return (
                <Box
                  key={idx}
                  padding={`20px`}
                  radius={`15px`}
                  al={`flex-start`}
                  shadow={`2px 4px 5px ${Theme.grey_C}`}
                >
                  <Text fontSize={`18px`} fontWeight={`bold`}>
                    {data.username}
                  </Text>
                  <Text fontSize={`11px`}>{data.teaCountry}</Text>
                  <Text fontSize={`11px`}>{data.teaLanguage}</Text>

                  <Wrapper margin={`20px 0 10px`} al={`flex-start`}>
                    <Text fontSize={`15px`} fontWeight={`600`}>
                      {data.title}
                    </Text>

                    <Text widht={`100%`} minHeight={`130px`}>
                      {data.info
                        ? data.info.slice(0, 300) + "..."
                        : "소개글이 없습니다"}
                    </Text>
                  </Wrapper>

                  <HoverText onClick={() => dModalToggle(data)}>
                    Read more
                  </HoverText>

                  <Image
                    margin={`50px 0 0`}
                    height={`200px`}
                    ojectFit={`contain`}
                    src={
                      data.profileImage
                        ? data.profileImage
                        : `https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/logo/profile-test.png`
                    }
                    radius={`15px`}
                  />
                </Box>
              );
            })
          ))}
      </Wrapper>

      {/* DMODAL  */}
      <Modal
        title="Totur"
        visible={dModal}
        onCancel={() => dModalToggle(null)}
        footer={null}
      >
        {dData && (
          <Wrapper radius={`15px`} al={`flex-start`}>
            <Text fontSize={`26px`} fontWeight={`600`}>
              {dData.username}
            </Text>
            <Text>{dData.teaCountry}</Text>
            <Text>{dData.teaLanguage}</Text>

            <Wrapper margin={`20px 0 10px`} al={`flex-start`}>
              <Text fontSize={`18px`} fontWeight={`600`}>
                {dData.title}
              </Text>

              <Text widht={`100%`} minHeight={`130px`}>
                {dData.info ? dData.info : "소개글이 없습니다"}
              </Text>
            </Wrapper>

            <Image
              margin={`50px 0 0`}
              src={dData.profileImage}
              radius={`15px`}
            />
          </Wrapper>
        )}
      </Modal>
    </Wrapper>
  );
};

export default Tutors;
