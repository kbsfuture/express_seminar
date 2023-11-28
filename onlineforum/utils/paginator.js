const lodash = require("lodash");
const PAGE_LIST_SIZE = 10;

// 총 개수, 페이지, 한 페이지에 표시하는 게시물 개수를 매개변수로 받음
module.exports = ({ totalCount, page, perPage = 10 }) => {
  const PER_PAGE = perPage;
  const totalPage = Math.ceil(totalCount / PER_PAGE);

  let quotient = parseInt(page / PAGE_LIST_SIZE);

  //   page는 현재 페이지
  //   PAGE_LIST_SIZE는 몇 개 페이지를 보여줄지
  //   perPage는 한 페이지당 표시되는 게시물 개수

  if (page % PAGE_LIST_SIZE === 0) {
    quotient -= 1;
  }

  const startPage = quotient * PAGE_LIST_SIZE + 1;

  const endPage =
    startPage + PAGE_LIST_SIZE - 1 < totalPage
      ? startPage + PAGE_LIST_SIZE - 1
      : totalPage;

  const isFirstpage = page === 1;
  const isLastpage = page === totalPage;
  const hasPrev = page > 1;
  const hasNext = page < totalPage;

  const paginator = {
    pageList: lodash.range(startPage.endPage + 1),
    page,
    prevPage: page - 1,
    nextPage: page + 1,
    startPage,
    lastPage: totalPage,
    hasPrev,
    hasNext,
    isFirstpage,
    isLastpage,
  };
  return paginator;
};
