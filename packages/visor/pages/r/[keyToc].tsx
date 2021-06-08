import { Layout } from "antd";
import { GetStaticPaths, GetStaticProps } from "next";
import React, { FC } from "react";
import { APIDocContextProvider } from "../../components/APIDocContext";
import { APIDocProps } from "../../components/APIDocProps";
import { MenuElm } from "../../components/Menu";
import { generalReadPackage } from "../../components/ReadPackage";

export const getStaticPaths: GetStaticPaths = async () => {
  await generalReadPackage.prepare();

  return {
    paths: [
      ...generalReadPackage.mapItems.keysToc.map(keyToc => ({ params: { keyToc } }))
    ],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<APIDocProps> = async (context) => {
  await generalReadPackage.prepareLoadToc();

  return {
    props: {
      mapItems: generalReadPackage.mapItems,
      items: generalReadPackage.items,
      toc: generalReadPackage.toc,
      uris: generalReadPackage.uris,
    },
  };
}

export const RenderItemToc: FC<APIDocProps> = ({ children, ...props }) => {
  return <APIDocContextProvider {...props}>
    <Layout>
      <Layout>
        <Layout.Sider>
          <MenuElm></MenuElm>
        </Layout.Sider>
        <Layout.Content>Content</Layout.Content>
      </Layout>
    </Layout>
  </APIDocContextProvider>;
}

export default RenderItemToc;
