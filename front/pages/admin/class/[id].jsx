import React, { useCallback, useEffect, useState, useRef } from "react";

import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";

const DetailClass = () => {
  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["클래스 관리", "클래스 상세보기"]}
        title={`클래스 등록`}
        subTitle={`클래스를 등록할 할 수 있습니다.`}
      />
    </AdminLayout>
  );
};

export default DetailClass;
