import { Empty, Modal, Pagination } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Image, Text, Wrapper } from "../commonComponents";
import Theme from "../Theme";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { USER_TEA_MAINLIST_REQUEST } from "../../reducers/user";
import { useRouter } from "next/router";
import useWidth from "../../hooks/useWidth";

const CustomPage = styled(Pagination)`
  & .ant-pagination-next > button {
    border: none;
  }

  & .ant-pagination-prev > button {
    border: none;
  }

  & {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  & .ant-pagination-item,
  & .ant-pagination-next,
  & .ant-pagination-prev {
    border: none;
    width: 28px;
    height: 28px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${Theme.white_C} !important;
    margin: 0 5px !important;
  }

  & .ant-pagination-item-active a {
    color: ${Theme.subTheme2_C};
  }

  & .ant-pagination-item:focus-visible a,
  .ant-pagination-item:hover a {
    color: ${Theme.subTheme2_C};
  }

  & .ant-pagination-item-link svg {
    font-weight: bold;
    color: ${Theme.black_2C};
  }

  @media (max-width: 800px) {
    width: 18px;
    height: 18px !important;
  }
`;

const HoverText = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.subTheme5_C};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.subTheme6_C};
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
    <Wrapper margin={`100px 0 0`}>
      <Wrapper al={`flex-start`} margin={`0 0 20px`}>
        <Text fontSize={`26px`} fontWeight={`600`}>
          Toturs
        </Text>
        <Wrapper dr={`row`} ju={`space-between`}>
          <Text fontSize={`16px`}>
            Interact with our native Korean teachers and classmates from all
            over the world at your home
          </Text>
          <Pagination
            total={teaLastPage * 10}
            current={currentPage}
            onChange={pageChangeHandler}
          />
        </Wrapper>
      </Wrapper>

      <Wrapper dr={`row`} ju={`space-between`}>
        {teaMainList &&
          (teaMainList.length === 0 ? (
            <Wrapper>
              <Empty description="등록된 선생님이 없습니다." />
            </Wrapper>
          ) : (
            teaMainList.map((data, idx) => {
              return (
                <Wrapper
                  margin={`0 0 20px`}
                  width={width < 700 ? `100%` : `calc(100% / 3 - 20px)`}
                  key={idx}
                  padding={`20px`}
                  radius={`15px`}
                  al={`flex-start`}
                  shadow={`2px 4px 5px ${Theme.grey_C}`}
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
                    src={data.profileImage}
                    radius={`15px`}
                  />
                </Wrapper>
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
